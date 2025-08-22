import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "~resolvers";
import { typeDefs } from "~typeDefs";
import { type MyContext, createContext } from "./context";
import { logger } from "./infra/logger";
import env from "./support/constants";

async function startApolloServer(): Promise<void> {
  const config = {
    resolvers,
    typeDefs,
  }
  // Configuração do Apollo Server
  const server = new ApolloServer<MyContext>(config);

  // Inicia o servidor Apollo
  const { url } = await startStandaloneServer(server, {
    context: async (req) => createContext(req),
    listen: { port: env.PORT },
  });

  logger.info(`🚀 Servidor pronto em ${url}`);
}

startApolloServer().catch((err: Error | unknown): void => {
  logger.error(err, "Erro ao iniciar o servidor:");
});
