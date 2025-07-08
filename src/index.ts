import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { createContext, MyContext } from './context';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/typedefs';

async function startApolloServer() {

  // Configuração do Apollo Server
  const server = new ApolloServer<MyContext>({
    resolvers,
    typeDefs,
  });

  // Inicia o servidor Apollo
  const { url } = await startStandaloneServer(server, {
    context: createContext,
    listen: { port: 4000 },
  });

  console.log(`🚀 Servidor pronto em ${url}`);
}

startApolloServer().catch((err) => {
  console.error('Erro ao iniciar o servidor:', err);
});