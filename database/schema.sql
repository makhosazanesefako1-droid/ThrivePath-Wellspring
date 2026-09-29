-- =====================================================================
-- UniWell University Well-Being Platform - Production PostgreSQL Schema
-- Database: PostgreSQL 15+
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. USERS & ROLES
-- ---------------------------------------------------------------------
CREATE TYPE user_role_enum AS ENUM ('student', 'counsellor', 'administrator');
CREATE TYPE appointment_status_enum AS ENUM ('booked', 'confirmed', 'attended', 'no_show', 'rescheduled', 'cancelled');
CREATE TYPE appointment_modality_enum AS ENUM ('in_person', 'video', 'walk_and_talk');
CREATE TYPE stress_band_enum AS ENUM ('low', 'moderate', 'high');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'student',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ---------------------------------------------------------------------
-- 2. STUDENTS
-- ---------------------------------------------------------------------
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_number VARCHAR(50) UNIQUE NOT NULL,
    faculty VARCHAR(150) NOT NULL,
    program VARCHAR(150) NOT NULL,
    year_of_study INTEGER NOT NULL CHECK (year_of_study BETWEEN 1 AND 7),
    residential_status VARCHAR(50) NOT NULL DEFAULT 'on_campus',
    preferred_pronouns VARCHAR(50) DEFAULT 'they/them',
    pulse_score INTEGER CHECK (pulse_score BETWEEN 0 AND 100),
    stress_band stress_band_enum,
    primary_indicator VARCHAR(100),
    average_sleep_hours NUMERIC(3,1) CHECK (average_sleep_hours BETWEEN 0 AND 24),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_number ON students(student_number);
CREATE INDEX idx_students_faculty ON students(faculty);

-- ---------------------------------------------------------------------
-- 3. COUNSELLORS
-- ---------------------------------------------------------------------
CREATE TABLE counsellors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    specialization VARCHAR(255),
    license_number VARCHAR(100),
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    office_location VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_counsellors_user_id ON counsellors(user_id);
CREATE INDEX idx_counsellors_approved ON counsellors(is_approved);

-- ---------------------------------------------------------------------
-- 4. ADMINISTRATORS
-- ---------------------------------------------------------------------
CREATE TABLE administrators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department VARCHAR(150) NOT NULL,
    admin_level VARCHAR(50) NOT NULL DEFAULT 'dean_staff',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 5. REGISTRATIONS & ONBOARDING
-- ---------------------------------------------------------------------
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    academic_year INTEGER NOT NULL DEFAULT 2026,
    progress_percent INTEGER NOT NULL DEFAULT 85 CHECK (progress_percent BETWEEN 0 AND 100),
    consent_given BOOLEAN NOT NULL DEFAULT TRUE,
    emergency_contact_name VARCHAR(150) NOT NULL,
    emergency_contact_phone VARCHAR(50) NOT NULL,
    emergency_contact_relation VARCHAR(50) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_registrations_student ON registrations(student_id);

-- ---------------------------------------------------------------------
-- 6. SCREENING QUESTIONS & DEFINITIONS
-- ---------------------------------------------------------------------
CREATE TABLE screening_questions (
    id SERIAL PRIMARY KEY,
    question_key VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    dataset_feature VARCHAR(100) NOT NULL,
    min_value NUMERIC(4,1) NOT NULL,
    max_value NUMERIC(4,1) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ---------------------------------------------------------------------
-- 7. SCREENINGS & RESULTS
-- ---------------------------------------------------------------------
CREATE TABLE screenings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    term_week INTEGER NOT NULL DEFAULT 8 CHECK (term_week BETWEEN 1 AND 16),
    pulse_score INTEGER NOT NULL CHECK (pulse_score BETWEEN 0 AND 100),
    stress_band stress_band_enum NOT NULL,
    primary_indicator VARCHAR(100) NOT NULL,
    previous_score_delta INTEGER,
    clinical_summary TEXT,
    feeling_text TEXT,
    is_rescreening BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_screenings_student_id ON screenings(student_id);
CREATE INDEX idx_screenings_created_at ON screenings(created_at);

-- ---------------------------------------------------------------------
-- 8. SCREENING RESPONSES (Answers to individual questions)
-- ---------------------------------------------------------------------
CREATE TABLE screening_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    screening_id UUID NOT NULL REFERENCES screenings(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES screening_questions(id),
    numeric_response NUMERIC(4,1) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_responses_screening ON screening_responses(screening_id);

-- ---------------------------------------------------------------------
-- 9. ML PREDICTIONS & AUDIT (Zero Target Leakage)
-- ---------------------------------------------------------------------
CREATE TABLE ml_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    screening_id UUID UNIQUE NOT NULL REFERENCES screenings(id) ON DELETE CASCADE,
    model_version VARCHAR(50) NOT NULL DEFAULT 'v2.4-rf',
    predicted_level stress_band_enum NOT NULL,
    confidence_score NUMERIC(5,4) NOT NULL,
    features_payload JSONB NOT NULL,
    target_leakage_excluded BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 10. SUPPORT RESOURCES
-- ---------------------------------------------------------------------
CREATE TABLE support_resources (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    estimated_minutes INTEGER NOT NULL DEFAULT 5,
    target_stress_bands VARCHAR(50)[] NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    action_label VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 11. COUNSELLOR AVAILABILITY
-- ---------------------------------------------------------------------
CREATE TABLE counsellor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    counsellor_id UUID NOT NULL REFERENCES counsellors(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_availability_counsellor ON counsellor_availability(counsellor_id);

-- ---------------------------------------------------------------------
-- 12. APPOINTMENTS
-- ---------------------------------------------------------------------
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    counsellor_id UUID NOT NULL REFERENCES counsellors(id) ON DELETE RESTRICT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    modality appointment_modality_enum NOT NULL DEFAULT 'video',
    focus_area VARCHAR(200) NOT NULL,
    intake_notes TEXT,
    status appointment_status_enum NOT NULL DEFAULT 'booked',
    counsellor_session_notes TEXT,
    follow_up_recommended VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_student ON appointments(student_id);
CREATE INDEX idx_appointments_counsellor ON appointments(counsellor_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);

-- ---------------------------------------------------------------------
-- 13. APPOINTMENT REMINDERS
-- ---------------------------------------------------------------------
CREATE TABLE appointment_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    reminder_type VARCHAR(50) NOT NULL DEFAULT 'sms',
    dispatched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'delivered'
);

-- ---------------------------------------------------------------------
-- 14. COUNSELLOR UPDATES & CLINICAL LOGS
-- ---------------------------------------------------------------------
CREATE TABLE counsellor_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    counsellor_id UUID NOT NULL REFERENCES counsellors(id),
    status_applied appointment_status_enum NOT NULL,
    clinical_observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 15. FOLLOW-UPS
-- ---------------------------------------------------------------------
CREATE TABLE follow_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id),
    recommended_reason TEXT NOT NULL,
    due_date DATE NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_followups_student ON follow_ups(student_id);
CREATE INDEX idx_followups_completed ON follow_ups(is_completed);

-- ---------------------------------------------------------------------
-- 16. RE-SCREENINGS & RECOVERY COMPARISON
-- ---------------------------------------------------------------------
CREATE TABLE rescreenings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    baseline_screening_id UUID NOT NULL REFERENCES screenings(id),
    followup_screening_id UUID NOT NULL REFERENCES screenings(id),
    score_delta INTEGER NOT NULL,
    recovery_status VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 17. FEEDBACK & SERVICE RATINGS
-- ---------------------------------------------------------------------
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID UNIQUE NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 18. NOTIFICATIONS
-- ---------------------------------------------------------------------
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);

-- ---------------------------------------------------------------------
-- 19. AUDIT LOGS (Security & RBAC Enforcement)
-- ---------------------------------------------------------------------
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    ip_address VARCHAR(50),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
