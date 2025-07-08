import { Resolvers } from '../generated/graphql';
import { resolvers as userResolvers } from './modules/users/resolvers';
import { resolvers as rootResolvers } from './modules/root/resolvers';

export const resolvers: Resolvers = {
  Query: {
    ...rootResolvers.Query,
    ...userResolvers.Query,
  },
};