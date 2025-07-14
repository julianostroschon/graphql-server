import { Knex } from 'knex';
import { hash } from 'node:crypto';
import { UserRole } from '../types';

export async function seed(knex: Knex): Promise<void> {
  // Limpa a tabela de usuários antes de inserir novos dados
  await knex('users').del();

  const password = hash('sha512', 'admin123');
  
  // Insere usuários iniciais
  await knex('users').insert([
    {
      username: 'admin',
      email: 'admin@example.com',
      // Em produção, use uma senha hash gerada com bcrypt ou similar
      // Aqui estamos usando uma senha simples para fins de demonstração
      password,
      role: UserRole.ADMIN,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      username: 'user',
      email: 'user@example.com',
      password: '7fcf4ba391c48784edde599889d6e3f1e47a27db36ecc050cc92f259bfac38afad2c68a1ae804d77075e8fb722503f3eca2b2c1006ee6f6c7b7628cb45fffd1d', // Em produção, NUNCA use senhas em texto puro
      role: UserRole.USER,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}