import { Resolvers } from "../../../../generated";
import { login } from "./Mutation/login";

export const resolvers: Resolvers = {
  Mutation: {
    login,
  },
};
