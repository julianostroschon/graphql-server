import { Knex } from 'knex';
import { UserRole } from '../types';

export async function up(knex: Knex): Promise<void> {
  // Criar o tipo enum para roles de usuário
  await knex.raw(`CREATE TYPE user_role AS ENUM ('${UserRole.ADMIN}', '${UserRole.USER}')`);

  // Criar a tabela de usuários
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username', 50).notNullable().unique();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.specificType('role', 'user_role').notNullable().defaultTo(UserRole.USER);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Índices para melhorar a performance
    table.index('email');
    table.index('username');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Remover a tabela de usuários
  await knex.schema.dropTableIfExists('users');
  
  // Remover o tipo enum
  return knex.raw('DROP TYPE IF EXISTS user_role');
}