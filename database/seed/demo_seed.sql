-- =====================================================================
-- UniWell University Well-Being Platform - Seed & Demo Data
-- Safe synthetic demo data conforming to Section N
-- =====================================================================

-- 1. SEED USERS
INSERT INTO users (id, email, password_hash, full_name, role) VALUES
('a0000000-0000-0000-0000-000000000001', 'demo.student@campus.ac.za', '$2b$12$e8F4y6G7H8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E', 'Demo Student', 'student'),
('a0000000-0000-0000-0000-000000000002', 'siqinisekonqobile@gmail.com', '$2b$12$e8F4y6G7H8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E', 'Siqiniseko Nqobile', 'student'),
('a0000000-0000-0000-0000-000000000003', 'demo.counsellor@campus.ac.za', '$2b$12$e8F4y6G7H8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E', 'Demo Counsellor', 'counsellor'),
('a0000000-0000-0000-0000-000000000004', 'dr.khumalo@campus.ac.za', '$2b$12$e8F4y6G7H8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E', 'Dr. Nomvula Khumalo, Ph.D.', 'counsellor'),
('a0000000-0000-0000-0000-000000000005', 'demo.admin@campus.ac.za', '$2b$12$e8F4y6G7H8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E', 'Demo Administrator', 'administrator'),
('a0000000-0000-0000-0000-000000000006', 'admin@campus.ac.za', '$2b$12$e8F4y6G7H8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E', 'Prof. Siphesihle Sithole', 'administrator')
ON CONFLICT (email) DO NOTHING;

-- 2. SEED STUDENTS
INSERT INTO students (id, user_id, student_number, faculty, program, year_of_study, residential_status, pulse_score, stress_band, primary_indicator, average_sleep_hours) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'DEMO001', 'Faculty of Science & Computing', 'B.Sc. Computer Science', 2, 'on_campus', 65, 'moderate', 'Exam pace', 6.5),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'ZA-2024-4192', 'Faculty of Engineering & the Built Environment', 'B.Sc. Electrical & Computer Engineering', 2, 'on_campus', 68, 'moderate', 'Academic load', 6.0)
ON CONFLICT (student_number) DO NOTHING;

-- 3. SEED COUNSELLORS
INSERT INTO counsellors (id, user_id, title, specialization, license_number, is_approved, office_location) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'Student Wellness Counsellor', 'General Student Adjustment & Academic Anxiety', 'HPCSA-DEMO-01', TRUE, 'Student Center Room 204'),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', 'Lead Clinical Psychologist', 'STEM Academic Overwhelm & Cognitive Behavioral Care', 'HPCSA-PS-0148922', TRUE, 'Solomon Mahlangu House 3rd Floor')
ON CONFLICT (user_id) DO NOTHING;

-- 4. SEED SUPPORT RESOURCES
INSERT INTO support_resources (id, title, category, description, estimated_minutes, target_stress_bands, resource_type, action_label) VALUES
('res_breath_478', '4-7-8 Parasympathetic Breathing Pacer', 'Well-being', 'Evidence-based paced respiration exercise to stimulate vagal tone and down-regulate physiological tension within 120 seconds.', 3, ARRAY['moderate', 'high'], 'interactive_exercise', 'Launch Pacer'),
('res_cbt_reframe', 'Cognitive Appraisal & Reframing Tool', 'Academic', 'Guided step-by-step cognitive restructuring protocol to challenge catastrophic academic assumptions and unhelpful thought loops.', 5, ARRAY['low', 'moderate', 'high'], 'interactive_exercise', 'Open Exercise'),
('res_sleep_hygiene', 'Circadian Sleep Optimization Protocol', 'Well-being', 'Structured evening wind-down checklist and blue-light moderation protocol for students operating under acute sleep debt.', 4, ARRAY['moderate', 'high'], 'interactive_exercise', 'View Checklist'),
('res_academic_pacing', 'Engineering & STEM Study Interval System', 'Academic', 'Pomodoro and distributed rehearsal intervals designed with Faculty advisors to prevent late-semester cram burnout.', 8, ARRAY['low', 'moderate', 'high'], 'workshop', 'Explore Guide'),
('res_peer_circles', 'Campus Peer Well-Being Circles', 'Social Support', 'Weekly student-facilitated support circles hosted across campus residences and community halls for peer connection.', 45, ARRAY['low', 'moderate'], 'workshop', 'Find Times'),
('res_crisis_support', '24/7 University Crisis Helpline & SADAG', 'Emergency Support', 'Immediate, confidential crisis de-escalation with licensed trauma counselors (SADAG 0800 567 567 / Campus Protection Services).', 1, ARRAY['high'], 'helpline', 'Access Helpline')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED SCREENING QUESTIONS (Mapping dataset features to student prompts)
INSERT INTO screening_questions (question_key, category, question_text, dataset_feature, min_value, max_value) VALUES
('sleep_hours', 'Sleep & rest', 'On average, how many hours of restful sleep do you get each night?', 'Sleep_Hours_Per_Night', 3.0, 10.0),
('assignment_load', 'Academic life', 'How often do you feel overwhelmed by your academic workload?', 'Assignment_Load', 1.0, 9.0),
('exam_frequency', 'Exam & test pace', 'How frequent are exams, tests, and major deadlines across your current modules?', 'Exam_Frequency', 1.0, 9.0),
('family_support', 'Social & family support', 'How supported do you feel by family, friends, or campus peers when facing difficulties?', 'Family_Support', 1.0, 9.0),
('screen_time', 'Screen time & reflections', 'How many hours per day do you spend on digital screens outside of lecture coursework?', 'Screen_Time_Hours_Per_Day', 1.0, 14.0)
ON CONFLICT (question_key) DO NOTHING;
