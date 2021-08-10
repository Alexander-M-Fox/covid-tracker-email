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

-- create account_tbl

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

-- create country_tbl

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

-- create webhook_tbl

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