-- 000004_add_user_password_hash.up.sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
