import type { QueryResolvers } from "./../../../../../generated/types.generated";
// Usando o tipo QueryResolver diretamente
export const userGet: NonNullable<QueryResolvers["userGet"]> = async (
  _parent,
  { id },
  { database },
) => {
  const user = await database("users").where("id", id).first();

  if (!user) return null;

  return {
    ...user,
    id: String(user.id),
    createdAt: user.created_at.toISOString(),
    updatedAt: user.updated_at.toISOString(),
  };
};
