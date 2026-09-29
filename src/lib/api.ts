import type {
  UserAccount,
  StudentProfile,
  ScreeningRecord,
  DatasetScreeningInput,
  Appointment,
  SupportResource,
  UniversityAnalytics,
} from '../types/index.ts';

export async function fetchHealth(): Promise<{ status: string; aiConfigured: boolean }> {
  const res = await fetch('/api/health');
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchCurrentSession(): Promise<{ user: UserAccount; isSuperAdmin: boolean }> {
  const res = await fetch('/api/auth/me');
  if (!res.ok) throw new Error('Failed to fetch session');
  return res.json();
}

export async function loginUser(email: string): Promise<UserAccount> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to sign in');
  }
  const data = await res.json();
  return data.user;
}

export async function registerUser(payload: {
  email: string;
  fullName: string;
  role: 'student' | 'counsellor' | 'admin';
  title?: string;
  notes?: string;
}): Promise<{ user: UserAccount; message: string }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to register account');
  }
  return res.json();
}

export async function switchDemoPersona(role: 'student' | 'counsellor' | 'admin', userId?: string): Promise<UserAccount> {
  const res = await fetch('/api/auth/switch-demo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, userId }),
  });
  if (!res.ok) throw new Error('Failed to switch persona');
  const data = await res.json();
  return data.user;
}

export async function fetchCounsellors(): Promise<UserAccount[]> {
  const res = await fetch('/api/admin/counsellors');
  if (!res.ok) throw new Error('Failed to fetch counsellors');
  const data = await res.json();
  return data.counsellors;
}

export async function approveCounsellor(id: string): Promise<void> {
  const res = await fetch(`/api/admin/counsellors/${id}/approve`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to approve counsellor');
}

export async function rejectCounsellor(id: string): Promise<void> {
  const res = await fetch(`/api/admin/counsellors/${id}/reject`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to reject counsellor');
}

export async function makeAdmin(email: string): Promise<void> {
  const res = await fetch('/api/admin/make-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to make admin');
  }
}

export async function fetchStudent(): Promise<StudentProfile> {
  const res = await fetch('/api/student');
  if (!res.ok) throw new Error('Failed to fetch student profile');
  const data = await res.json();
  return data.student;
}

export async function fetchScreenings(): Promise<ScreeningRecord[]> {
  const res = await fetch('/api/screenings');
  if (!res.ok) throw new Error('Failed to fetch screenings');
  const data = await res.json();
  return data.screenings;
}

export async function submitDatasetScreening(
  input: DatasetScreeningInput,
  termWeek: number = 8
): Promise<ScreeningRecord> {
  const res = await fetch('/api/screenings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, termWeek }),
  });
  if (!res.ok) throw new Error('Failed to submit screening');
  const data = await res.json();
  return data.screening;
}

export async function fetchAppointments(): Promise<Appointment[]> {
  const res = await fetch('/api/appointments');
  if (!res.ok) throw new Error('Failed to fetch appointments');
  const data = await res.json();
  return data.appointments;
}

export async function bookAppointment(payload: {
  dateTime: string;
  modality: 'in_person' | 'video' | 'walk_and_talk';
  focusArea: string;
  intakeNotes?: string;
  counsellorId?: string;
  counsellorName?: string;
  counsellorRole?: string;
}): Promise<Appointment> {
  const res = await fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to book appointment');
  const data = await res.json();
  return data.appointment;
}

export async function updateAppointment(
  id: string,
  updates: Partial<Appointment>
): Promise<Appointment> {
  const res = await fetch(`/api/appointments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update appointment');
  const data = await res.json();
  return data.appointment;
}

export async function submitAppointmentFeedback(
  id: string,
  rating: number,
  feedback: string
): Promise<Appointment> {
  const res = await fetch(`/api/appointments/${id}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating, feedback }),
  });
  if (!res.ok) throw new Error('Failed to submit feedback');
  const data = await res.json();
  return data.appointment;
}

export async function sendAppointmentReminder(id: string): Promise<Appointment> {
  const res = await fetch(`/api/appointments/${id}/reminder`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to send reminder');
  const data = await res.json();
  return data.appointment;
}

export async function fetchResources(): Promise<SupportResource[]> {
  const res = await fetch('/api/resources');
  if (!res.ok) throw new Error('Failed to fetch resources');
  const data = await res.json();
  return data.resources;
}

export async function fetchAnalytics(): Promise<UniversityAnalytics> {
  const res = await fetch('/api/analytics');
  if (!res.ok) throw new Error('Failed to fetch analytics');
  const data = await res.json();
  return data.analytics;
}

export async function resetDemo(): Promise<void> {
  const res = await fetch('/api/demo/reset', {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to reset demo');
}

export async function fetchModelInfo(): Promise<any> {
  const res = await fetch('/api/ml/model-info');
  if (!res.ok) throw new Error('Failed to fetch model info');
  return res.json();
}

export async function predictML(input: any): Promise<any> {
  const res = await fetch('/api/ml/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
  });
  if (!res.ok) throw new Error('Failed to run ML prediction');
  return res.json();
}

export async function fetchPrivacyLimits(): Promise<any> {
  const res = await fetch('/api/privacy-limits');
  if (!res.ok) throw new Error('Failed to fetch privacy & clinical safety limits');
  return res.json();
}

export async function runClinicalSafetyTests(): Promise<any> {
  const res = await fetch('/api/tests/run-clinical-safety', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to execute clinical safety test suite');
  return res.json();
}



