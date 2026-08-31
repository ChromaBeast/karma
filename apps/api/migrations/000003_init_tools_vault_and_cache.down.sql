-- 000003_init_tools_vault_and_cache.down.sql
DROP TABLE IF EXISTS prompt_cache CASCADE;
DROP TABLE IF EXISTS billing_accounts CASCADE;
DROP TABLE IF EXISTS managed_credit_ledger CASCADE;
DROP TABLE IF EXISTS llm_executions CASCADE;
DROP TABLE IF EXISTS api_key_vault CASCADE;
DROP TABLE IF EXISTS skill_gap_analyses CASCADE;
DROP TABLE IF EXISTS outreach_scripts CASCADE;
DROP TABLE IF EXISTS cover_letters CASCADE;
DROP TABLE IF EXISTS interview_sessions CASCADE;
DROP TABLE IF EXISTS linkedin_assets CASCADE;
