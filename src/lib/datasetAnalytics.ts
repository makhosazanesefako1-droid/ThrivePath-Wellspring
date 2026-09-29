import studentStressData from '../../data/dataset_analytics.json';

export interface DatasetRecord {
  Age: number;
  Gender: string;
  Study_Hours: number;
  Class_Attendance: number;
  Tuition: string;
  Exam_Frequency: number;
  Assignment_Load: number;
  Sleep_Hours: number;
  Physical_Exercise: string;
  Social_Media_Use: number;
  Screen_Time: number;
  Family_Income_Level: string;
  Peer_Pressure: number;
  Family_Support: number;
  Anxiety_Level: number;
  University_Type: string;
  Stress_Score: number;
  Stress_Level: 'Low' | 'Medium' | 'High';
}

export interface DatasetAnalyticsSummary {
  totalRecords: number;
  classDistribution: { name: string; count: number; percentage: number; color: string }[];
  universityTypeDistribution: { name: string; count: number; avgStress: number; highStressRate: number }[];
  genderDistribution: { gender: string; count: number; avgStress: number }[];
  screenTimeVsStress: { screenHoursRange: string; avgStressScore: number; highStressPercent: number }[];
  sleepHoursVsStress: { sleepHoursRange: string; avgStressScore: number; highStressPercent: number }[];
  incomeLevelVsStress: { incomeLevel: string; avgStressScore: number; lowStressPercent: number }[];
  correlations: { feature: string; coefficient: number; type: 'risk' | 'protective'; label: string }[];
  records?: DatasetRecord[];
  sampleRecords: DatasetRecord[];
}

export const DATASET_ANALYTICS: DatasetAnalyticsSummary = studentStressData as any;
