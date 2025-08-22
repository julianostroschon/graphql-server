import type { QueryResolvers } from "~types";

export const usersLoad: NonNullable<QueryResolvers["usersLoad"]> = async (
  _parent,
  _arg,
  { database },
) => {
  const users = await database("users")

  return users
};
