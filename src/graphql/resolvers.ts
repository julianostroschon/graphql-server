import { readdirSync } from 'fs';
import { join } from 'path';
import { Resolvers } from '../generated/graphql';

const loadResolvers = () => {
  const modulesPath = join(__dirname, 'modules');
  const modules = readdirSync(modulesPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const resolversMap: Record<string, any> = {
    Query: {},
    Mutation: {},
  };

  // Carrega os resolvers de cada módulo
  modules.forEach(moduleName => {
    try {
      const moduleResolvers = moduleName === 'resolvers' ? require(`./modules/${moduleName}`).resolvers:  require(`./modules/${moduleName}/resolvers`).resolvers;
      
      // Adiciona Query resolvers
      if (moduleResolvers.Query) {
        Object.assign(resolversMap.Query, moduleResolvers.Query);
      }

      // Adiciona Mutation resolvers
      if (moduleResolvers.Mutation) {
        Object.assign(resolversMap.Mutation, moduleResolvers.Mutation);
      }

      // Adiciona Type resolvers (como User, Post, etc)
      Object.keys(moduleResolvers).forEach(key => {
        if (key !== 'Query' && key !== 'Mutation') {
          resolversMap[key] = moduleResolvers[key];
        }
      });
    } catch (error) {
      console.warn(`Failed to load resolvers for module ${moduleName}:`, error);
    }
  });

  return resolversMap as Resolvers;
};

export const resolvers: Resolvers = loadResolvers();