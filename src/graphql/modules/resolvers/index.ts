
import { Resolvers } from '../../../generated';
import { _empty as MutationEmpty } from './Mutation/_empty';
import { _empty as queryEmpty } from './Query/_empty';
import { ping } from './Query/ping';

export const resolvers: Resolvers = {
  Query: {
    ping,
    _empty: queryEmpty
  },
  Mutation: {
    _empty: MutationEmpty
  }
};