--! Previous: -
--! Hash: sha1:47a60a4c75f2580e08fd52d5e7be540c75f4e4a9

-- Enter migration here
--! Previous: -
--! Hash: sha1:5ca221873efa05a08b46385fc991daf6f0f920ca

-- Enter migration here

DROP TABLE IF EXISTS businesses CASCADE;

CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  name VARCHAR (256) NOT NULL,
  timezone VARCHAR (128) NOT NULL,
  country_code VARCHAR (2) NOT NULL,
  vat_number VARCHAR (64),
  vat INTEGER NOT NULL DEFAULT 25,
  visit_reminders BOOLEAN NOT NULL DEFAULT false,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

DROP TYPE IF EXISTS EMPLOYEE_ROLE CASCADE;
CREATE TYPE EMPLOYEE_ROLE AS ENUM ('admin', 'worker');

DROP TABLE IF EXISTS employees CASCADE;

CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR (512) NOT NULL,
  business_id INTEGER NOT NULL REFERENCES businesses(id),
  role EMPLOYEE_ROLE NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, business_id)
);

DROP INDEX IF EXISTS employees_user_id_idx;
CREATE INDEX employees_user_id_idx ON employees (user_id);

DROP TABLE IF EXISTS services CASCADE;

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR (512) NOT NULL,
  description TEXT,
  unit_cost NUMERIC (8, 2) NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS clients CASCADE;

CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  first_name VARCHAR (256),
  last_name VARCHAR (256),
  business_name VARCHAR (256),
  is_business BOOLEAN NOT NULL default false,
  address1 VARCHAR (256),
  address2 VARCHAR (256),
  city VARCHAR (256),
  postal_code VARCHAR (32),
  country VARCHAR (256),
  address_use_property BOOLEAN NOT NULL DEFAULT true,
  email VARCHAR (256),
  phone VARCHAR (128),
  is_active BOOLEAN NOT NULL DEFAULT true,
  visit_reminders BOOLEAN NOT NULL DEFAULT true,
  external_id VARCHAR (256),
  imported_from VARCHAR (128),
  imported_via VARCHAR (128),
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

DROP INDEX IF EXISTS clients_first_name_idx;
CREATE INDEX clients_first_name_idx ON clients (first_name);

DROP INDEX IF EXISTS clients_last_name_idx;
CREATE INDEX clients_last_name_idx ON clients (last_name);

DROP INDEX IF EXISTS clients_business_name;
CREATE INDEX clients_business_name ON clients (business_name);


DROP TABLE IF EXISTS properties CASCADE;

CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  description TEXT,
  address1 VARCHAR (512),
  address2 VARCHAR (512),
  city VARCHAR (256),
  postal_code VARCHAR (32),
  country VARCHAR (256),
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

DROP TYPE IF EXISTS INVOICE_JOB_CHOICES CASCADE;
CREATE TYPE INVOICE_JOB_CHOICES AS ENUM ('never', 'visit', 'closed', 'monthly');

DROP TABLE IF EXISTS jobs CASCADE;

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  recurrences VARCHAR (512),
  begins TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ends TIMESTAMP WITH TIME ZONE,
  start_time TIMESTAMP WITH TIME ZONE,
  finish_time TIMESTAMP WITH TIME ZONE,
  anytime BOOLEAN NOT NULL DEFAULT true,
  title VARCHAR (528),
  description TEXT,
  closed BOOLEAN NOT NULL DEFAULT false,
  invoice INVOICE_JOB_CHOICES NOT NULL DEFAULT 'never',
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS job_assignments CASCADE;

CREATE TABLE job_assignments (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  employee_id INTEGER NOT NULL REFERENCES employees (id) ON DELETE CASCADE,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS invoices CASCADE;

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS invoice_reminders CASCADE;

CREATE TABLE invoice_reminders (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  invoice_id INTEGER NOT NULL REFERENCES invoices (id) ON DELETE SET NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

DROP INDEX IF EXISTS invoice_reminders_date_idx;
CREATE INDEX invoice_reminders_date_idx ON invoice_reminders (date);

DROP TABLE IF EXISTS visits CASCADE;

CREATE TABLE visits (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  invoice_id INTEGER REFERENCES invoices (id) ON DELETE SET NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  begins TIMESTAMP WITH TIME ZONE,
  ends TIMESTAMP WITH TIME ZONE,
  anytime BOOLEAN NOT NULL DEFAULT true,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

DROP INDEX IF EXISTS visits_completed_idx;
CREATE INDEX visits_completed_idx ON visits (completed);

DROP INDEX IF EXISTS visits_begins_idx;
CREATE INDEX visits_begins_idx ON visits (begins);

DROP INDEX IF EXISTS visits_ends_idx;
CREATE INDEX visits_ends_idx ON visits (ends);

DROP TABLE IF EXISTS visit_assignments CASCADE;

CREATE TABLE visit_assignments (
  id SERIAL PRIMARY KEY,
  visit_id INTEGER NOT NULL REFERENCES visits (id) ON DELETE CASCADE,
  employee_id INTEGER NOT NULL REFERENCES employees (id) ON DELETE CASCADE,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS lineitems CASCADE;

CREATE TABLE lineitems (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
  name VARCHAR (512) NOT NULL,
  quantity INTEGER NOT NULL default 1,
  unit_cost NUMERIC (8, 2) NOT NULL DEFAULT 0,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS lineitem_overrides CASCADE;

CREATE TABLE lineitem_overrides (
  id SERIAL PRIMARY KEY,
  lineitem_id INTEGER NOT NULL REFERENCES lineitems (id) ON DELETE CASCADE,
  visit_id INTEGER NOT NULL REFERENCES visits (id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
