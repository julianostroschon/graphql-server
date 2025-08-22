import knex from 'knex';

import { environment } from '@/support/utils';
import config from './knexfile';

// Cria e exporta a conexão com o banco de dados
const connection: knex.Knex = knex(config[environment as keyof typeof config]);

export default connection;