-- Add student_name column to student_charging_logs table
ALTER TABLE student_charging_logs
ADD COLUMN student_name TEXT;

-- Optional: Update existing records to have a default name if needed (or leave null)
-- UPDATE student_charging_logs SET student_name = 'Unknown' WHERE student_name IS NULL;
