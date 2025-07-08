import { Resolvers } from '../generated/graphql';

export const resolvers: Resolvers = {
  Query: {
    ping: () => 'pong',
  },
};