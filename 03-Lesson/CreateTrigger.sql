-- This code creates a trigger in a PostgreSQL
CREATE TRIGGER insert_user -- Trigger name: "insert_user"
-- Set to be executed BEFORE an INSERT or UPDATE on the "users" table
BEFORE
INSERT
    OR
UPDATE
    ON "users" -- Will be executed for EACH ROW that is inserted or updated
    FOR EACH ROW 
    EXECUTE PROCEDURE check_banned_emails(); -- The trigger will execute a user-defined function called "check_banned_emails()" 