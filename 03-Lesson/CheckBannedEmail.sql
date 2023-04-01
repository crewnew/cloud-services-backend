CREATE OR REPLACE FUNCTION check_banned_emails() -- Create or replace a function named check_banned_emails
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    inserted_email text; -- Declare a variable to store the email address from the new record
BEGIN
    SELECT -- Get the email address from the new record (the record being inserted)
        NEW.email INTO inserted_email;
    IF EXISTS( -- Check if the email address exists in the banned_emails table
        SELECT 
            b.email 
        FROM 
            banned_emails b 
        WHERE
            b.email = inserted_email
    ) THEN
        -- If the email is found in the banned_emails table, raise an exception with a custom message
        Raise exception 'The email address % is banned!', inserted_email;
    END IF;
    RETURN NEW; -- If the email is not found in the banned_emails table, continue with the operation
END;
$$