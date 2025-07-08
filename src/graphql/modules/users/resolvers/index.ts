import { Resolvers } from '../../../../generated/graphql';
import { usersLoad } from './Query/usersLoad';
import { userGet } from './Query/userGet';
import { me } from './Query/me';

export const resolvers: Resolvers = {
  Query: {
    usersLoad,
    userGet,
    me,
  },
};