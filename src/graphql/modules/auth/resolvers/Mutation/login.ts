import { ApolloError } from 'apollo-server-errors';

import { hash, verify } from 'crypto';
import type { MutationResolvers } from "./../../../../../generated/types.generated";
export const login: NonNullable<MutationResolvers["login"]> = async (
  _parent,
  { credentials },
  { database, logger },
) => {
  const { username, password: passwordRaw } = credentials;
  const user = await database("users").where({ username }).first();
  const hashedPassword = hash('sha512', passwordRaw);
  console.log({ hashedPassword, passwordRaw });

  if (!user) {
    logger.warn(`User not found: ${username}`);
    return new ApolloError("invalidParameter");
  }

  const isValidPassword = await verify(passwordRaw, hashedPassword);

  if (!isValidPassword) {
    logger.warn(`Password not match: ${username}`);
    
    return new ApolloError("invalidPassword");
  }

  // if (user.alteraSenha) {
  //   logger.warn(`User must be redirect to alter password ${username}`);
  //   return Promise.reject("redirectActionChangePassword");
  // }

  // await updateLastLogin(database, user)

  return user;
};
