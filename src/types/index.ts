export type StressBand = 'low' | 'moderate' | 'high' | 'neutral';

export type UserRole = 'student' | 'counsellor' | 'dean' | 'admin';

export type JourneyStep = 
  | 'registration' 
  | 'screening' 
  | 'analysis' 
  | 'support' 
  | 'counselling' 
  | 'followup';

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  title?: string;
  approved: boolean; // Counsellors must be approved by admin
  createdAt: string;
  notes?: string;
}

export interface StudentProfile {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  faculty: string;
  program: string;
  yearOfStudy: number;
  residentialStatus: 'on_campus' | 'off_campus_commuter' | 'international';
  preferredPronouns: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  registeredAt: string;
  screeningStatus: 'pending' | 'completed' | 'rescreening_due';
  registrationProgressPercent: number; // e.g. 85% as shown in picture
  pulseScore?: number;                // e.g. 72 as shown in picture
  primaryIndicator?: string;          // e.g. "Academic load"
  averageSleepHours?: number;         // e.g. 6
}

export interface DatasetScreeningInput {
  studyHours: number;        // 0 - 10
  classAttendance: number;   // 40 - 100%
  examFrequency: number;     // 1 - 9
  assignmentLoad: number;    // 1 - 9
  sleepHours: number;        // 3 - 10
  physicalExercise: boolean; // Yes/No
  screenTime: number;        // 1 - 12
  socialMediaUse: number;    // 0 - 8
  familySupport: number;     // 1 - 9
  peerPressure: number;      // 1 - 9
  anxietyLevel: number;      // 1 - 9
  feelingText?: string;      // Free-text "Tell us how you're feeling"
}

export interface ScreeningRecord {
  id: string;
  studentId: string;
  studentName?: string;
  timestamp: string;
  termWeek: number; // 1 - 12
  input: DatasetScreeningInput;
  rawScore: number;
  pulseScore: number; // 0 - 100 scale
  stressBand: StressBand;
  primaryIndicator: string;
  aiAnalysis: {
    clinicalSummary: string;
    identifiedTriggers: string[];
    protectiveFactors: string[];
    recommendedPathway: 'self_guided' | 'peer_circle' | 'priority_counselling';
    actionItems: string[];
  };
  previousScoreDelta?: number;
}

export type AppointmentStatus = 'booked' | 'attended' | 'no_show' | 'rescheduled' | 'cancelled';
export type AppointmentModality = 'in_person' | 'video' | 'walk_and_talk';

export interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  studentFaculty: string;
  studentYear: number;
  counsellorId: string;
  counsellorName: string;
  counsellorRole: string;
  dateTime: string; // ISO
  formattedDate: string;
  formattedTime: string;
  modality: AppointmentModality;
  focusArea: string;
  intakeNotes?: string;
  status: AppointmentStatus;
  stressBand: StressBand;
  reminderStatus: {
    dayPriorSent: boolean;
    hoursPriorSent: boolean;
  };
  counsellorSessionNotes?: string;
  followUpRecommended?: string;
  rescheduledToDate?: string;
  rating?: number; // 1 - 5
  feedback?: string;
}

export interface SupportResource {
  id: string;
  title: string;
  category: 'psychoeducation' | 'mindfulness' | 'academic' | 'peer_circle' | 'sleep' | 'crisis';
  description: string;
  estimatedMinutes: number;
  stressBandTarget: StressBand[];
  type: 'interactive_exercise' | 'audio_guide' | 'workshop' | 'helpline';
  actionLabel: string;
}

export interface UniversityAnalytics {
  totalEnrolled: number;
  totalScreened: number;
  screeningRatePercent: number;
  stressBandDistribution: {
    lowCount: number;
    lowPercent: number;
    moderateCount: number;
    moderatePercent: number;
    highCount: number;
    highPercent: number;
  };
  appointmentMetrics: {
    totalBooked: number;
    attendedCount: number;
    attendedPercent: number;
    noShowCount: number;
    noShowPercent: number;
    cancelledCount: number;
    avgWaitDays: number;
  };
  reScreeningMetrics: {
    completedFollowUps: number;
    avgStressReductionPercent: number;
    improvedOutcomePercent: number;
  };
  averageSatisfactionRating: number;
  weeklyTrend: {
    week: string;
    termWeek: number;
    avgStressScore: number;
    screeningsCount: number;
    counsellingSessionsCount: number;
  }[];
  facultyBreakdown: {
    faculty: string;
    totalStudents: number;
    highStressPercent: number;
    avgScore: number;
  }[];
}
