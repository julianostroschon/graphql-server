import { ApolloError } from "apollo-server-errors";

import { sign } from "jsonwebtoken";
import type { MutationResolvers } from "./../../../../../generated/types.generated";
export const login: NonNullable<MutationResolvers["login"]> = async (
  _parent,
  { credentials },
  { database, logger },
) => {
  const { username, password: passwordRaw } = credentials;
  const userDb = await database("users")
    .where({ username })
    .first(["id", "username", "email", "created_at", "updated_at", "role", "password"]);

  if (!userDb) {
    logger.warn(`User not found: ${username}`);
    throw new ApolloError("invalidParameter");
  }
  const { password, ...userRaw } = userDb || {};
  const hashedPassword = passwordRaw;

  const isValidPassword = password === hashedPassword;

  if (!isValidPassword) {
    logger.warn(`Password not match: ${username}`);
    throw new ApolloError("invalidPassword");
  }
  const user = {
    ...userRaw,
    role: userRaw.role, // Ensure role is wrapped as expected
    createdAt: userRaw.created_at.toISOString(),
    updatedAt: userRaw.updated_at.toISOString(),
  }

  const token = sign({ userId: user.id }, "your_jwt_secret", {
    expiresIn: "1h",
  });

  // Ensure all required fields are present and role is wrapped as expected
  return {
    user,
    token,
  };
};
