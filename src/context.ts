import { StandaloneServerContextFunctionArgument } from '@apollo/server/dist/esm/standalone';
import type { IncomingMessage } from 'http';
import { verify } from 'jsonwebtoken';
import type { Knex } from 'knex';
import { Logger } from 'pino';
import database from './infra/database/connection';
import { User } from './infra/database/types';
import { logger } from './infra/logger';
import env from './support/constants';

// Make sure your JWT secret is loaded from an environment variable
// For development, you can have a fallback, but never use a hardcoded secret in production.

interface MyContext {
  database: Knex;
  user?: User | null; // Authenticated user (optional)
  logger: Logger;
}

const createContext = async (serverCtx: StandaloneServerContextFunctionArgument): Promise<MyContext> => {
  logger.info('Starting context creation...');
  let user: User | null = null;

  try {
    const token = getToken(serverCtx, logger);
    if (token) {
      user = await getUserFromToken(token, logger);
    }
  } catch (error: any | { message: string; name: string }) {
    // Catch any unexpected errors during token processing or user fetching
    logger.error(`Error during user authentication in context creation: ${error.message}`);
    // Do not re-throw here, allow context to be created with a null user
  }

  logger.info(`Context created. User authenticated: ${user ? user.id : 'No'}`);
  return {
    database,
    logger,
    user,
  };
};

const getToken = ({ req }: { req: IncomingMessage }, logger: Logger): string => {
  const { headers } = req;
  // Case-insensitive check for Authorization header
  const authorization = (headers?.authorization || headers?.Authorization || '').toString().trim();
  logger.debug(`Raw Authorization header: "${authorization}"`);

  if (!authorization) {
    logger.warn('No authorization header found in request');
    return '';
  }

  // Expecting "Bearer <token>"
  const [prefix, token] = authorization.split(' ');
  if (prefix.toLowerCase() !== 'bearer') {
    logger.warn(`Invalid authorization header format. Expected "Bearer <token>", got "${authorization}"`);
    return '';
  }

  // const token = parts[1];
  if (!token || token === 'undefined' || token.length === 0) {
    logger.warn('No token provided after "Bearer" in request headers');
    return '';
  }

  logger.debug('Token successfully extracted from headers.');
  return token;
};

async function getUserFromToken(token: string, logger: Logger): Promise<User | null> {
  try {
    // Verify the token
    const decoded = verify(token, env.JWT_SECRET);
    const userId = (decoded as { userId: string }).userId;
    logger.debug(`Token decoded. User ID: ${userId}`);
    
      console.log({ userId })
    // Fetch user from database
    const user = await database('users')
      .where('id', userId)
      .first();

    if (!user) {
      logger.warn(`User with ID ${userId} not found in database for token.`);
      return null;
    }

    logger.info(`User ${user.id} successfully authenticated.`);
    return user;
  } catch (error: any | { message: string; name: string }) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Authentication token expired.');
    } else if (error.name === 'JsonWebTokenError') {
      console.log({ error })
      logger.warn(`Invalid authentication token: ${error.message}`);
    } else {
      logger.error(`Unexpected error during user authentication: ${error.message}`);
    }
    return null;
  }
}

export { createContext, type MyContext };
