
import { Knex } from 'knex';
import database from './infra/database/connection';
import { User } from './infra/database/types';

// Renomeando para MyContext para compatibilidade direta com o codegen
interface MyContext {
  database: Knex;
  user?: User | null; // Usuário autenticado (opcional)
}

const createContext = async (): Promise<MyContext> => {
  return {
    database,
    // O usuário será adicionado pelo middleware de autenticação quando implementado
    user: null,
  };
};

export { createContext, type MyContext };
