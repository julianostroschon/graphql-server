import knex, { Knex } from 'knex';
import config from './knexfile';

// Determina o ambiente atual (development, test ou production)
const environment = process.env.NODE_ENV || 'development';

// Cria e exporta a conexão com o banco de dados
const connection: Knex = knex(config[environment]);

export default connection;