
import { StandaloneServerContextFunctionArgument } from '@apollo/server/dist/esm/standalone';
import type { Knex } from 'knex';
import database from './infra/database/connection';
import { User } from './infra/database/types';
import { logger } from './infra/logger';

// Renomeando para MyContext para compatibilidade direta com o codegen
interface MyContext {
  database: Knex;
  user?: User | null; // Usuário autenticado (opcional)
  logger: typeof logger;
}

const createContext = async (res: StandaloneServerContextFunctionArgument): Promise<MyContext> => {
  const headers = res.req?.headers || {};
  logger.warn('Creating context with headers:', { headers });
  return {
    database,
    logger,
    user: null,
  };
};

export { createContext, type MyContext };
