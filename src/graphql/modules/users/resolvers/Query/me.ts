import type { QueryResolvers } from "./../../../../../generated/types.generated";

export const me: NonNullable<QueryResolvers["me"]> = async (
  _parent,
  _arg,
  { database, user },
) => {
  if (!user) return null;

  const userData = await database("users").where({ id: user.id }).first();

  if (!userData) return null;

  return {
    ...userData,
    createdAt: userData.created_at.toISOString(),
    updatedAt: userData.updated_at.toISOString(),
  };
};
