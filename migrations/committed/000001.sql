--! Previous: -
--! Hash: sha1:fb1599b0aaec225d7579082917100cb36ede5016

-- Enter migration here

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR (128) NOT NULL,
  picture VARCHAR (512),
  name VARCHAR (256) NOT NULL,
  email VARCHAR(256) NOT NULL,
  created TIMESTAMP DEFAULT NOW()
);

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

DROP TABLE IF EXISTS employees CASCADE;

CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  business_id INTEGER NOT NULL REFERENCES businesses(id),
  created TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, business_id)
);
