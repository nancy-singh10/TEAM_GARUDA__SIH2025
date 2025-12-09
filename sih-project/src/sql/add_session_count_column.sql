-- Add session_count column to track number of sessions per student
ALTER TABLE student_charging_logs
ADD COLUMN session_count INTEGER DEFAULT 1;
