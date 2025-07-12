/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { _empty as Query__empty } from './../graphql/modules/resolvers/Query/_empty';
import    { me as Query_me } from './../graphql/modules/users/resolvers/Query/me';
import    { ping as Query_ping } from './../graphql/modules/resolvers/Query/ping';
import    { userGet as Query_userGet } from './../graphql/modules/users/resolvers/Query/userGet';
import    { usersLoad as Query_usersLoad } from './../graphql/modules/users/resolvers/Query/usersLoad';
import    { _empty as Mutation__empty } from './../graphql/modules/resolvers/Mutation/_empty';
import    { login as Mutation_login } from './../graphql/modules/auth/resolvers/Mutation/login';
import    { User } from './../graphql/modules/users/resolvers/User';
    export const resolvers: Resolvers = {
      Query: { _empty: Query__empty,me: Query_me,ping: Query_ping,userGet: Query_userGet,usersLoad: Query_usersLoad },
      Mutation: { _empty: Mutation__empty,login: Mutation_login },
      
      User: User
    }