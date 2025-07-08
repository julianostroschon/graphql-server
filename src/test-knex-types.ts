import type { Knex } from 'knex';
import { UserRole } from './generated/knex-types';

// Função para testar a tipagem do Knex com os tipos gerados
export async function testKnexTypes(knex: Knex) {
  // Teste de SELECT
  const users = await knex('users').select('*');
  console.log('Primeiro usuário:', users[0].username);
  
  // Teste de INSERT
  const newUser = await knex('users').insert({
    username: 'novo_usuario',
    email: 'novo@exemplo.com',
    role: UserRole.USER
  }).returning('*');
  
  // Teste de UPDATE
  await knex('users')
    .where({ id: 1 })
    .update({
      username: 'usuario_atualizado',
      updated_at: new Date()
    });
  
  // Teste de DELETE
  await knex('users').where({ id: 2 }).delete();
  
  return users;
}