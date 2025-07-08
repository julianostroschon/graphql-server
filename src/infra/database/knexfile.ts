import { Knex } from 'knex';
import { join } from 'node:path';

interface KnexConfig {
  [key: string]: Knex.Config;
}

const config: KnexConfig = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'graphql_server_dev',
    },
    migrations: {
      directory: join(__dirname, 'src/database/migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: join(__dirname, 'src/database/seeds'),
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