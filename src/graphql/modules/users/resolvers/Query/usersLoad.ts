import type { QueryResolvers } from "./../../../../../generated/types.generated";

export const usersLoad: NonNullable<QueryResolvers["usersLoad"]> = async (
  _parent,
  _arg,
  { database },
) => {
  return await database("users");
};
