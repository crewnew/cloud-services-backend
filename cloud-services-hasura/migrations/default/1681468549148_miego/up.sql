SET check_function_bodies = false;
CREATE FUNCTION public.check_banned_emails() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
inserted_email text;
BEGIN
SELECT NEW.email INTO inserted_email;
IF EXISTS(SELECT b.email FROM banned_emails b WHERE
b.email = inserted_email)
THEN
Raise exception 'The email address % is banned!',
inserted_email;
END IF;
RETURN NEW;
END;
$$;
CREATE TABLE public.user_role (
    value text NOT NULL
);
CREATE TABLE public.users (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    first_name text NOT NULL,
    last_name text DEFAULT 'No surname'::text,
    verified boolean DEFAULT false NOT NULL,
    email text NOT NULL,
    role text NOT NULL,
    company_id integer
);
ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
CREATE TRIGGER insert_user BEFORE INSERT OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.check_banned_emails();
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_fkey FOREIGN KEY (role) REFERENCES public.user_role(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
