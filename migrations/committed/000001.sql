--! Previous: -
--! Hash: sha1:a82343f8db8b5c16f588f5183f5daf0ebcee10b1

-- Enter migration here
DROP TABLE IF EXISTS businesses CASCADE;

CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  name VARCHAR (256) NOT NULL,
  timezone VARCHAR(128) NOT NULL,
  country_code VARCHAR(2) NOT NULL,
  vat_number VARCHAR(64),
  email VARCHAR(256) NOT NULL,
  created TIMESTAMP DEFAULT NOW()
);
