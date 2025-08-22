import { StandaloneServerContextFunctionArgument } from "@apollo/server/dist/esm/standalone";
import type { IncomingMessage } from "http";
import { verify } from "jsonwebtoken";
import type { Knex } from "knex";
import { Logger } from "pino";

import database from "@/infra/database/connection";
import { User } from "@/infra/database/types";
import { logger } from "@/infra/logger";
import env from "@/support/constants";

interface MyContext {
  database: Knex;
  user?: User | null;
  logger: Logger;
}

const createContext = async (
  serverCtx: StandaloneServerContextFunctionArgument
): Promise<MyContext> => {
  logger.info("Starting context creation...");
  let user: User | null = null;

  try {
    const token = getToken(serverCtx, logger);
    if (token) {
      user = await getUserFromToken(token, logger);
    }
  } catch (error: any | { message: string; name: string }) {
    logger.error(
      `Error during user authentication in context creation: ${error.message}`
    );
  }

  logger.info(`Context created. User authenticated: ${user ? user.id : "No"}`);
  return {
    database,
    logger,
    user,
  };
};

const getToken = (
  { req }: { req: IncomingMessage },
  logger: Logger
): string => {
  const { headers } = req;
  const authorization = (headers?.authorization || headers?.Authorization || "")
    .toString()
    .trim();
  logger.debug(`Raw Authorization header: "${authorization}"`);

  if (!authorization) {
    logger.warn("No authorization header found in request");
    return "";
  }

  const [prefix, token] = authorization.split(" ");
  if (prefix.toLowerCase() !== "bearer") {
    logger.warn(
      `Invalid authorization header format. Expected "Bearer <token>", got "${authorization}"`
    );
    return "";
  }

  if (!token || token === "undefined" || token.length === 0) {
    logger.warn('No token provided after "Bearer" in request headers');
    return "";
  }

  logger.debug("Token successfully extracted from headers.");
  return token;
};

async function getUserFromToken(
  token: string,
  logger: Logger
): Promise<User | null> {
  try {
    const decoded = verify(token, env.JWT_SECRET);
    const userId = (decoded as { userId: string }).userId;
    logger.debug(`Token decoded. User ID: ${userId}`);

    const user = await database("users").where("id", userId).first();

    if (!user) {
      logger.warn(`User with ID ${userId} not found in database for token.`);
      return null;
    }

    logger.info(`User ${user.id} successfully authenticated.`);
    return user;
  } catch (error: any | { message: string; name: string }) {
    const jwtError = {
      TokenExpiredError: (_: any | { message: string }): string =>
        "Authentication token expired.",
      JsonWebTokenError: (e: any | { message: string }): string =>
        `Invalid authentication token: ${e.message}`,
    };

    const message: string =
      jwtError[error.name as keyof typeof jwtError](error) ??
      `Unexpected error during user authentication: ${error.message}`;

    logger.warn(message);
    return null;
  }
}

export { createContext, type MyContext };
