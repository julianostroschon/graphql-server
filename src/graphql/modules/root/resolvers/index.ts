import { Resolvers } from '../../../../generated/graphql';
import { ping } from './Query/ping';

export const resolvers: Resolvers = {
  Query: {
    ping,
  },
};