import type { QueryResolvers } from "./../../../../../generated/types.generated";
import {
  QueryResolver,
  createResolver,
} from "../../../../../../types/resolvers";

// Usando o tipo QueryResolver diretamente
export const usersLoad: NonNullable<QueryResolvers["usersLoad"]> = async (
  _parent,
  _arg,
  { database },
) => {
  return database("users");
};

// Alternativa usando a função createResolver
// export const usersLoad = createResolver('usersLoad', ({ ctx }) => {
//   return ctx.database('users');
// });
