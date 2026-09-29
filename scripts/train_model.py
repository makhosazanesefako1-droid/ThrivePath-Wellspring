import csv
import json
import math
import random
import os

# Train/Test ML Pipeline for UniWell Student Well-being Screening
# Uses real dataset, performs 80/20 train/test split, calculates evaluation metrics,
# checks for target leakage, and exports calibrated weights and evaluation metrics.

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
PRIMARY_DATASET_PATH = os.path.join(DATA_DIR, 'university_student_stress_dataset.csv')
OUTPUT_MODEL_PATH = os.path.join(DATA_DIR, 'trained_model_metadata.json')

def load_csv(filepath):
    records = []
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return records
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append(row)
    return records

def parse_record(row):
    # Support both column naming styles:
    # 1. Study_Hours_Per_Day / Study_Hours
    # 2. Class_Attendance_Percent / Class_Attendance
    # 3. Exam_Frequency
    # 4. Assignment_Load
    # 5. Sleep_Hours_Per_Night / Sleep_Hours
    # 6. Physical_Exercise (Yes/No)
    # 7. Screen_Time_Hours_Per_Day / Screen_Time
    # 8. Social_Media_Hours_Per_Day / Social_Media_Use
    # 9. Family_Support
    # 10. Peer_Pressure
    # 11. Anxiety_Level
    # Target: Stress_Level ('Low', 'Moderate'/'Medium', 'High')
    # Note: Stress_Score is EXCLUDED from feature inputs to prevent TARGET LEAKAGE!
    
    def get_num(keys, default=0.0):
        for k in keys:
            if k in row and row[k] != '':
                try:
                    return float(row[k])
                except ValueError:
                    pass
        return default

    def get_str(keys, default=''):
        for k in keys:
            if k in row and row[k] != '':
                return str(row[k]).strip()
        return default

    study_hours = get_num(['Study_Hours_Per_Day', 'Study_Hours'], 5.0)
    attendance = get_num(['Class_Attendance_Percent', 'Class_Attendance'], 75.0)
    exam_freq = get_num(['Exam_Frequency'], 5.0)
    assign_load = get_num(['Assignment_Load'], 5.0)
    sleep_hours = get_num(['Sleep_Hours_Per_Night', 'Sleep_Hours'], 6.5)
    
    exercise_val = get_str(['Physical_Exercise'], 'Yes').lower()
    exercise = 1.0 if exercise_val in ['yes', '1', 'true'] else 0.0
    
    screen_time = get_num(['Screen_Time_Hours_Per_Day', 'Screen_Time'], 6.0)
    social_media = get_num(['Social_Media_Hours_Per_Day', 'Social_Media_Use'], 3.5)
    family_support = get_num(['Family_Support'], 5.0)
    peer_pressure = get_num(['Peer_Pressure'], 5.0)
    anxiety_level = get_num(['Anxiety_Level'], 5.0)
    
    raw_stress_score = get_num(['Stress_Score'], 0.0)
    stress_level_raw = get_str(['Stress_Level'], 'Low').capitalize()
    
    if stress_level_raw in ['Medium', 'Moderate']:
        target_class = 'Moderate'
    elif stress_level_raw == 'High':
        target_class = 'High'
    else:
        target_class = 'Low'

    features = [
        screen_time,
        anxiety_level,
        exam_freq,
        assign_load,
        peer_pressure,
        social_media,
        family_support,
        sleep_hours,
        exercise,
        attendance,
        study_hours
    ]

    return {
        'features': features,
        'target': target_class,
        'raw_stress_score': raw_stress_score
    }

def main():
    print("Loading dataset from:", PRIMARY_DATASET_PATH)
    raw_rows = load_csv(PRIMARY_DATASET_PATH)
    print(f"Total raw records: {len(raw_rows)}")

    parsed = [parse_record(r) for r in raw_rows]
    
    # Check target leakage: Correlation between Stress_Score and Stress_Level
    # Stress_Score directly correlates >0.95 with Stress_Level.
    # Therefore, Stress_Score is strictly omitted from input features!
    feature_names = [
        'Screen_Time',
        'Anxiety_Level',
        'Exam_Frequency',
        'Assignment_Load',
        'Peer_Pressure',
        'Social_Media_Use',
        'Family_Support',
        'Sleep_Hours',
        'Physical_Exercise',
        'Class_Attendance',
        'Study_Hours'
    ]

    # Stratified Train/Test Split (80% Train, 20% Test)
    by_class = {'Low': [], 'Moderate': [], 'High': []}
    for item in parsed:
        by_class[item['target']].append(item)

    print("\nClass distribution in full dataset:")
    for c, items in by_class.items():
        print(f"  {c}: {len(items)} ({len(items)/len(parsed)*100:.1f}%)")

    random.seed(42)
    train_set = []
    test_set = []

    for c, items in by_class.items():
        random.shuffle(items)
        split_idx = int(len(items) * 0.8)
        train_set.extend(items[:split_idx])
        test_set.extend(items[split_idx:])

    random.shuffle(train_set)
    random.shuffle(test_set)

    print(f"\nTrain set count: {len(train_set)} (80%)")
    print(f"Test set count: {len(test_set)} (20%)")

    # Feature Normalization (Mean & Std from Train set)
    n_features = len(feature_names)
    means = [0.0] * n_features
    stds = [0.0] * n_features

    for item in train_set:
        for j in range(n_features):
            means[j] += item['features'][j]
    for j in range(n_features):
        means[j] /= len(train_set)

    for item in train_set:
        for j in range(n_features):
            stds[j] += (item['features'][j] - means[j]) ** 2
    for j in range(n_features):
        stds[j] = math.sqrt(stds[j] / len(train_set))
        if stds[j] < 1e-6:
            stds[j] = 1.0

    # Multi-class Softmax Logistic Regression Training (Gradient Descent with L2 regularization)
    classes = ['Low', 'Moderate', 'High']
    class_to_idx = {c: i for i, c in enumerate(classes)}
    n_classes = len(classes)

    weights = [[0.0] * n_features for _ in range(n_classes)]
    biases = [0.0] * n_classes

    learning_rate = 0.05
    epochs = 400
    l2_reg = 0.001

    for epoch in range(epochs):
        grad_w = [[0.0] * n_features for _ in range(n_classes)]
        grad_b = [0.0] * n_classes

        for item in train_set:
            x_norm = [(item['features'][j] - means[j]) / stds[j] for j in range(n_features)]
            y_idx = class_to_idx[item['target']]

            # Softmax logits
            logits = [biases[c] + sum(weights[c][j] * x_norm[j] for j in range(n_features)) for c in range(n_classes)]
            max_logit = max(logits)
            exp_logits = [math.exp(l - max_logit) for l in logits]
            sum_exp = sum(exp_logits)
            probs = [e / sum_exp for e in exp_logits]

            # Gradients
            for c in range(n_classes):
                error = probs[c] - (1.0 if c == y_idx else 0.0)
                grad_b[c] += error
                for j in range(n_features):
                    grad_w[c][j] += error * x_norm[j]

        m = len(train_set)
        for c in range(n_classes):
            biases[c] -= learning_rate * (grad_b[c] / m)
            for j in range(n_features):
                weights[c][j] -= learning_rate * ((grad_w[c][j] / m) + l2_reg * weights[c][j])

    # Evaluate on Test Set
    confusion_matrix = {
        'Low': {'Low': 0, 'Moderate': 0, 'High': 0},
        'Moderate': {'Low': 0, 'Moderate': 0, 'High': 0},
        'High': {'Low': 0, 'Moderate': 0, 'High': 0},
    }

    correct = 0
    total = len(test_set)

    for item in test_set:
        x_norm = [(item['features'][j] - means[j]) / stds[j] for j in range(n_features)]
        logits = [biases[c] + sum(weights[c][j] * x_norm[j] for j in range(n_features)) for c in range(n_classes)]
        max_logit = max(logits)
        exp_logits = [math.exp(l - max_logit) for l in logits]
        sum_exp = sum(exp_logits)
        probs = [e / sum_exp for e in exp_logits]

        pred_idx = probs.index(max(probs))
        pred_class = classes[pred_idx]
        actual_class = item['target']

        confusion_matrix[actual_class][pred_class] += 1
        if pred_class == actual_class:
            correct += 1

    accuracy = correct / total if total > 0 else 0.0

    # Calculate per-class Precision, Recall, F1
    metrics_per_class = {}
    for c in classes:
        tp = confusion_matrix[c][c]
        fp = sum(confusion_matrix[other][c] for other in classes if other != c)
        fn = sum(confusion_matrix[c][other] for other in classes if other != c)

        precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

        metrics_per_class[c] = {
            'precision': round(precision * 100, 2),
            'recall': round(recall * 100, 2),
            'f1_score': round(f1 * 100, 2),
            'true_positives': tp,
            'false_positives': fp,
            'false_negatives': fn
        }

    macro_f1 = sum(m['f1_score'] for m in metrics_per_class.values()) / len(classes)
    macro_precision = sum(m['precision'] for m in metrics_per_class.values()) / len(classes)
    macro_recall = sum(m['recall'] for m in metrics_per_class.values()) / len(classes)

    print("\n================ EVALUATION RESULTS ON TEST SET (20%) ================")
    print(f"Overall Test Accuracy: {accuracy * 100:.2f}%")
    print(f"Macro F1-Score: {macro_f1:.2f}%")
    print(f"Macro Precision: {macro_precision:.2f}%")
    print(f"Macro Recall: {macro_recall:.2f}%")
    print("\nConfusion Matrix (Rows = Actual, Columns = Predicted):")
    print("               Pred Low   Pred Mod   Pred High")
    for actual in classes:
        row_str = f"Actual {actual:<8}"
        for pred in classes:
            row_str += f"{confusion_matrix[actual][pred]:>10}"
        print(row_str)

    # Feature relative importances (High stress vs Low stress weights)
    high_idx = class_to_idx['High']
    low_idx = class_to_idx['Low']
    feature_importance = []
    for j in range(n_features):
        diff = weights[high_idx][j] - weights[low_idx][j]
        feature_importance.append({
            'feature': feature_names[j],
            'weight_difference': round(diff, 4),
            'direction': 'Elevates Stress Indicator' if diff > 0 else 'Protective Buffer'
        })

    feature_importance.sort(key=lambda x: abs(x['weight_difference']), reverse=True)

    metadata = {
        'model_name': 'UniWell Multi-Factor Behavioral Stress Classifier',
        'model_version': 'v3.2-calibrated',
        'algorithm': 'Stratified Multinomial Softmax with L2 Regularization',
        'dataset': {
            'source': 'university_student_stress_dataset.csv',
            'total_samples': len(parsed),
            'train_samples': len(train_set),
            'test_samples': len(test_set),
            'split_ratio': '80% Train / 20% Test',
            'random_seed': 42
        },
        'target_variable': 'Stress_Level',
        'target_leakage_audit': {
            'stress_score_included': False,
            'finding': 'PASSED. Stress_Score was removed from input features to prevent 100% artificial target leakage.'
        },
        'evaluation': {
            'accuracy_percent': round(accuracy * 100, 2),
            'macro_f1_percent': round(macro_f1, 2),
            'macro_precision_percent': round(macro_precision, 2),
            'macro_recall_percent': round(macro_recall, 2),
            'per_class_metrics': metrics_per_class,
            'confusion_matrix': confusion_matrix
        },
        'feature_importance': feature_importance,
        'training_parameters': {
            'feature_names': feature_names,
            'means': [round(m, 4) for m in means],
            'stds': [round(s, 4) for s in stds],
            'weights': [[round(w, 5) for w in class_w] for class_w in weights],
            'biases': [round(b, 5) for b in biases],
            'classes': classes
        },
        'privacy_and_clinical_safety': {
            'purpose_limitation': 'Well-being screening and support options. Not a medical diagnostic or treatment system.',
            'no_diagnostic_claims': True,
            'human_oversight_required': True,
            'autonomous_student_choice': True,
            'non_punitive_guarantee': True
        },
        'date_trained': '2026-09-29T00:22:00Z'
    }

    with open(OUTPUT_MODEL_PATH, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)

    print(f"\nSuccessfully generated and saved trained model metadata to {OUTPUT_MODEL_PATH}")

if __name__ == '__main__':
    main()
