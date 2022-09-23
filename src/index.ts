import { ApolloServer, gql } from "apollo-server";
import typeDefs from "./schema";
import { Query, Mutation } from "./resolvers";
import { PrismaClient, Prisma } from "@prisma/client";
import dotenv from "dotenv";
import { getUserFromToken } from "./utils/getUserFromToken";
//create prisma instance
const prisma = new PrismaClient();
dotenv.config();
export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  userInfo: {
    user: number;
  } | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: { Query, Mutation },
  context: async ({ req }: any): Promise<Context> => {
    const userInfo = await getUserFromToken(req.headers.authorization);
    return {
      prisma,
      userInfo,
    };
  },
});
server.listen().then(({ url }) => {
  console.log(`server is started at ${url}`);
});
