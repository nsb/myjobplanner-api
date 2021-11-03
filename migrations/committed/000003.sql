--! Previous: sha1:56faa049251abc4b8cfd232cfd1eab5caf384bd0
--! Hash: sha1:37b521ba8962eae06abe46609c54b6a98d942fb5

-- Enter migration here

DROP TABLE IF EXISTS employees CASCADE;

CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  business_id INTEGER NOT NULL REFERENCES businesses(id),
  created TIMESTAMP DEFAULT NOW()
);
