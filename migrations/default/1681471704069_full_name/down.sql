-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE FUNCTION full_name(user_row users)
-- RETURNS TEXT AS $$
--    SELECT user_row.first_name || ' ' || user_row.last_name;
-- $$ LANGUAGE sql STABLE;