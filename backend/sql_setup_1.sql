-- create postgres user

CREATE ROLE "covid-tracker-user" WITH
	LOGIN
	NOSUPERUSER
	CREATEDB
	CREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1
	PASSWORD 'xxxxxx';  -- change me on server before running

-- create db

CREATE DATABASE "covid-tracker-email"
    WITH 
    OWNER = "covid-tracker-user"
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

RAISE NOTICE 'Please exit shell, run \'psql -U covid-tracker-user -h 127.0.0.1 covid-tracker-email\', and run script 2.'; 

