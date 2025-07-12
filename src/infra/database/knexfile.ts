import { config as getEnv } from 'dotenv';
import { Knex } from 'knex';
import { join } from 'node:path';
getEnv();

type KnexConfig = {
  [K in 'development' | 'production']: Knex.Config;
};

const connection = process.env.DATABASE_URL || {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // ssl: { rejectUnauthorized: false },
};
console.log({ connection, env: process.env });


const config: KnexConfig = {
  development: {
    client: 'pg',
    connection,
    migrations: {
      directory: join(__dirname, './migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: join(__dirname, './seeds'),
      extension: 'ts',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: join(__dirname, 'dist/database/migrations'),
    },
    seeds: {
      directory: join(__dirname, 'dist/database/seeds'),
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export default config;