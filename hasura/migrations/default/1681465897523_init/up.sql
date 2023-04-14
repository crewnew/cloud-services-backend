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
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.banned_emails (
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.companies (
    id integer NOT NULL,
    company_name text NOT NULL,
    phone text NOT NULL
);
CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;
CREATE TABLE public.invoices (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    date date NOT NULL,
    status text NOT NULL,
    total numeric NOT NULL,
    company_id integer NOT NULL,
    CONSTRAINT invoice_total CHECK (((total > (0)::numeric) AND (total < (10000)::numeric)))
);
CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;
CREATE TABLE public.reservations (
    id integer NOT NULL,
    company_id integer NOT NULL,
    rooms_id integer NOT NULL,
    date_from timestamp with time zone DEFAULT now(),
    date_to timestamp with time zone DEFAULT now(),
    CONSTRAINT length CHECK ((((date_to - date_from) <= '01:00:00'::interval) OR ((date_to - date_from) <= '02:00:00'::interval)))
);
CREATE SEQUENCE public.reservations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.reservations_id_seq OWNED BY public.reservations.id;
CREATE TABLE public.reviews (
    id integer NOT NULL,
    rating_stars integer NOT NULL,
    review_text text NOT NULL
);
CREATE TABLE public.roles (
    role text NOT NULL
);
CREATE TABLE public.rooms (
    id integer NOT NULL,
    room_number text NOT NULL
);
CREATE SEQUENCE public.rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;
CREATE TABLE public.users (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    first_name text NOT NULL,
    last_name text DEFAULT 'NoSurname'::text,
    email text NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    role text DEFAULT 'worker'::text NOT NULL,
    company_id integer
);
COMMENT ON TABLE public.users IS 'Internal users';
CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);
ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);
ALTER TABLE ONLY public.reservations ALTER COLUMN id SET DEFAULT nextval('public.reservations_id_seq'::regclass);
ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.banned_emails
    ADD CONSTRAINT banned_emails_pkey PRIMARY KEY (email);
ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role);
ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
CREATE TRIGGER insert_user BEFORE INSERT OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.check_banned_emails();
CREATE TRIGGER set_public_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_invoices_updated_at ON public.invoices IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_users_updated_at ON public.users IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_rooms_id_fkey FOREIGN KEY (rooms_id) REFERENCES public.rooms(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_id_fkey FOREIGN KEY (id) REFERENCES public.reservations(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_fkey FOREIGN KEY (role) REFERENCES public.roles(role) ON UPDATE CASCADE ON DELETE SET DEFAULT;
