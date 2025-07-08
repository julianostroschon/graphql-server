export interface MyContext {
  // Aqui você pode adicionar propriedades que estarão disponíveis em todos os resolvers
  // Por exemplo: dataSources, autenticação, etc.
}

export const createContext = async (): Promise<MyContext> => {
  return {};
};