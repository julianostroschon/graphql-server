import type { Knex } from 'knex';

// Enum para os tipos de roles de usuário
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// Interface para a tabela de usuários
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

// Declaração de módulo para estender os tipos do Knex
declare module 'knex/types/tables' {
  interface Tables {
    users: User;
    users_composite: Knex.CompositeTableType<
      User,
      // Tipo para INSERT
      Pick<User, 'username' | 'email' | 'password' | 'role'> & 
        Partial<Pick<User, 'created_at' | 'updated_at'>>,
      // Tipo para UPDATE
      Partial<Omit<User, 'id'>>
    >;
  }
}