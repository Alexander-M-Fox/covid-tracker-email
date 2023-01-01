// @ts-check
const { Client } = require('pg');

const pgclient = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
});

pgclient.connect();

const account = `
    CREATE TABLE public.account_tbl
    (
        acc_id character varying(64) NOT NULL,
        email character varying(100) NOT NULL,
        password character varying(100) NOT NULL,
        acc_name character varying(32) NOT NULL,
        CONSTRAINT pk_acc_id PRIMARY KEY (acc_id)
    );

    ALTER TABLE public.account_tbl
        OWNER to "covid-tracker-user";

    ALTER TABLE public.account_tbl
        ADD COLUMN send_emails boolean NOT NULL;
`;

const country = `
    CREATE TABLE public.country_tbl
    (
        country_name character varying(100) NOT NULL,
        acc_id character varying(64) NOT NULL,
        CONSTRAINT "comp_pk_cName_accId_from_country_tbl" PRIMARY KEY (country_name, acc_id),
        CONSTRAINT fk_acc_id_from_country_tbl FOREIGN KEY (acc_id)
            REFERENCES public.account_tbl (acc_id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE CASCADE
            NOT VALID
    );

    ALTER TABLE public.country_tbl
        OWNER to "covid-tracker-user";
`;

const webhook = `
    CREATE TABLE public.webhook_tbl
    (
        webhook_url character varying(200) NOT NULL,
        acc_id character varying(64) NOT NULL,
        CONSTRAINT "comp_pk_webhookUrl_accId_from_webhook_tbl" PRIMARY KEY (webhook_url, acc_id),
        CONSTRAINT fk_acc_id_from_webhook_tbl FOREIGN KEY (acc_id)
            REFERENCES public.account_tbl (acc_id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE CASCADE
            NOT VALID
    );

    ALTER TABLE public.webhook_tbl
        OWNER to "covid-tracker-user";
`;

pgclient.query(account, (err, res) => {
    if (err) throw err;
});

pgclient.query(country, (err, res) => {
    if (err) throw err;
});

pgclient.query(webhook, (err, res) => {
    if (err) throw err;
    pgclient.end();
});
