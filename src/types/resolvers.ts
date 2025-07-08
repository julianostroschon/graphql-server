import { QueryResolvers } from '../generated/types.generated';
import { Context } from '../context';

// Tipos para os resolvers de Query
export type QueryResolver<T extends keyof QueryResolvers> = NonNullable<QueryResolvers[T]>;

// Tipo para os parâmetros dos resolvers
export type ResolverParams<T> = {
  parent: any;
  args: T;
  ctx: Context;
  info: any;
};

// Função auxiliar para criar resolvers com tipagem simplificada
export function createResolver<T extends keyof QueryResolvers, A = any>(
  name: T,
  resolver: (params: ResolverParams<A>) => ReturnType<QueryResolver<T>>
): QueryResolver<T> {
  return async (parent, args, ctx, info) => {
    return resolver({ parent, args, ctx, info });
  };
}