import type { QueryResolvers } from "~types";
// Usando o tipo QueryResolver diretamente
export const userGet: NonNullable<QueryResolvers["userGet"]> = async (
  _parent,
  { id },
  { database },
) => {
  const user = await database("users").where("id", id).first();

  if (!user) return null;

  return user;
};
