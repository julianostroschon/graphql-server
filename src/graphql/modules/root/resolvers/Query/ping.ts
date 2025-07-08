import type { QueryResolvers } from "./../../../../../generated/types.generated";

import { QueryResolver, createResolver } from "../../../../../types/resolvers";

// Usando o tipo QueryResolver diretamente
export const ping: NonNullable<QueryResolvers["ping"]> = async (
  _parent,
  _arg,
  _ctx,
) => {
  return "pong";
};

// Alternativa usando a função createResolver
// export const ping = createResolver('ping', () => {
//   return 'pong';
// });
