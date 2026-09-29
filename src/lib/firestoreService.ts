import {
  db,
  auth,
  handleFirestoreError,
  OperationType,
} from './firebase.ts';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import type {
  ScreeningRecord,
  Appointment,
  StudentProfile,
  UserAccount,
} from '../types/index.ts';

/**
 * Save or sync screening record to Firestore
 */
export async function syncScreeningToFirestore(record: ScreeningRecord): Promise<void> {
  const collectionPath = 'screenings';
  try {
    const docRef = doc(db, collectionPath, record.id);
    await setDoc(docRef, {
      ...record,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionPath}/${record.id}`);
  }
}

/**
 * Save or sync appointment booking to Firestore
 */
export async function syncAppointmentToFirestore(appointment: Appointment): Promise<void> {
  const collectionPath = 'appointments';
  try {
    const docRef = doc(db, collectionPath, appointment.id);
    await setDoc(docRef, {
      ...appointment,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionPath}/${appointment.id}`);
  }
}

/**
 * Save or sync student profile to Firestore
 */
export async function syncStudentProfileToFirestore(profile: StudentProfile): Promise<void> {
  const collectionPath = 'studentProfiles';
  try {
    const docRef = doc(db, collectionPath, profile.id);
    await setDoc(docRef, {
      ...profile,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionPath}/${profile.id}`);
  }
}

/**
 * Fetch screenings for a student from Firestore
 */
export async function fetchScreeningsFromFirestore(studentId: string): Promise<ScreeningRecord[]> {
  const collectionPath = 'screenings';
  try {
    const q = query(
      collection(db, collectionPath),
      where('studentId', '==', studentId)
    );
    const snap = await getDocs(q);
    const records: ScreeningRecord[] = [];
    snap.forEach((d) => {
      records.push(d.data() as ScreeningRecord);
    });
    return records;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
}
