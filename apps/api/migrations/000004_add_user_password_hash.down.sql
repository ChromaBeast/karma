-- 000004_add_user_password_hash.down.sql
ALTER TABLE users DROP COLUMN IF EXISTS password_hash;
