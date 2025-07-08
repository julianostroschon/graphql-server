import type { QueryResolvers } from "./../../../../generated/types.generated";

export const ping: NonNullable<QueryResolvers["ping"]> = async (
  _parent,
  _arg,
  _ctx,
) => {
  return "pong";
};
