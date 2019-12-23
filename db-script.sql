CREATE TABLE users
(
  id uuid,
  email_address character varying(128),
  data jsonb,
  password_hash character varying(128),
  created_date timestamp with time zone DEFAULT now(),
  modified_date timestamp with time zone DEFAULT now(),
  CONSTRAINT user_pkey PRIMARY KEY (id)
)