--! Previous: sha1:a82343f8db8b5c16f588f5183f5daf0ebcee10b1
--! Hash: sha1:56faa049251abc4b8cfd232cfd1eab5caf384bd0

-- Enter migration here
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR (128),
  picture VARCHAR (512),
  name VARCHAR (256) NOT NULL,
  email VARCHAR(256) NOT NULL,
  created TIMESTAMP DEFAULT NOW()
);
