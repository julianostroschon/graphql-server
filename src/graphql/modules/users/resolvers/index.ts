import { Resolvers } from '~types';
import { me } from './Query/me';
import { userGet } from './Query/userGet';
import { usersLoad } from './Query/usersLoad';

export const resolvers: Resolvers = {
  Query: {
    usersLoad,
    userGet,
    me,
  },
};