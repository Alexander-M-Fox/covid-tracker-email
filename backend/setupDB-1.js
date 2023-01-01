// @ts-check
const { Client } = require('pg');

const pgclient = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
});

pgclient.connect();

const role = `
    CREATE ROLE "covid-tracker-user" WITH
    LOGIN
    NOSUPERUSER
    CREATEDB
    CREATEROLE
    INHERIT
    NOREPLICATION
    CONNECTION LIMIT -1
    PASSWORD '${process.env.POSTGRES_PASSWORD}'; 
`;

const database = `
    CREATE DATABASE "covid-tracker-email"
    WITH 
    OWNER = "covid-tracker-user"
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
`;

pgclient.query(role, (err, res) => {
    if (err) throw err;
});

pgclient.query(database, (err, res) => {
    if (err) throw err;
    pgclient.end();
});
