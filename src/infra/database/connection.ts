import knex, { Knex } from 'knex';
import { environment } from '../../support/utils';
import config from './knexfile';

// Cria e exporta a conexão com o banco de dados
const connection: Knex = knex(config[environment]);

export default connection;