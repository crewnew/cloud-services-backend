-- Create or replace a function named check_banned_emails
CREATE
OR REPLACE FUNCTION check_banned_emails() RETURNS trigger LANGUAGE plpgsql AS $ $

DECLARE
    -- Declare a variable to store the email address from the new record
    inserted_email text;

BEGIN
    -- Get the email address from the new record (the record being inserted)
    SELECT
        NEW.email INTO inserted_email;

    -- Check if the email address exists in the banned_emails table
    IF EXISTS(
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

    -- If the email is not found in the banned_emails table, continue with the operation
    RETURN NEW;

END;

$ $