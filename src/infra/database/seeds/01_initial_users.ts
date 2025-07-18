import { Knex } from "knex";
import { hash } from "node:crypto";
import env from "../../../support/constants";
import { UserRole } from "../types";

export async function seed(knex: Knex): Promise<void> {
  // Limpa a tabela de usuários antes de inserir novos dados
  await knex("users").del();

  const password = hash(env.ALGORITHM_ENCRYPT, "admin123");

  // Insere usuários iniciais
  await knex("users").insert([
    {
      username: "admin",
      email: "admin@example.com",
      // Em produção, use uma senha hash gerada com bcrypt ou similar
      // Aqui estamos usando uma senha simples para fins de demonstração
      password,
      role: UserRole.ADMIN,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      username: "user",
      email: "user@example.com",
      password,
      role: UserRole.USER,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
