-- Update User Role Constraint
-- This script updates the check constraint on the users table to allow all valid UserRole values (0-6)
-- Run this script directly on your PostgreSQL database

-- Drop the existing constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS "CK_User_Role";

-- Add the updated constraint that allows all valid roles:
-- 0 = Guest, 1 = User, 2 = Admin, 3 = Staff, 4 = Reviewer, 5 = Speaker, 6 = Partner
ALTER TABLE users ADD CONSTRAINT "CK_User_Role" CHECK (role IN (0, 1, 2, 3, 4, 5, 6));

-- Verify the constraint was updated
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'users'::regclass
AND conname = 'CK_User_Role';
