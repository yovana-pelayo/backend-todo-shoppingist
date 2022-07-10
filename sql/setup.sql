-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`


DROP TABLE IF EXISTS todo;
DROP TABLE IF EXISTS userSL;

CREATE TABLE userSL (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL
);

CREATE TABLE todo (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    description VARCHAR NOT NULL,
    complete BOOLEAN NOT NULL DEFAULT(false),
    FOREIGN KEY (user_id) REFERENCES userSL(id)
);