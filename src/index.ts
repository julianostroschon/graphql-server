import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { type MyContext, createContext } from './context';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/typedefs';
import { logger } from './infra/logger';

async function startApolloServer() {

  // Configuração do Apollo Server
  const server = new ApolloServer<MyContext>({
    resolvers,
    typeDefs,
  });

  // Inicia o servidor Apollo
  const { url } = await startStandaloneServer(server, {
    context: async (req) => createContext(req),
    listen: { port: 4000 },
  });

  logger.info(`🚀 Servidor pronto em ${url}`);
}

startApolloServer().catch((err) => {
  logger.error('Erro ao iniciar o servidor:', err);
});