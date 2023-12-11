-- Will run everytime the container starts up.
-- If no <database_name> of datname is found, it will create a new one.
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'postgis_playground') THEN
       CREATE DATABASE postgis_playground;
   END IF;
END $$;