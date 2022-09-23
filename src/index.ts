import { ApolloServer, gql } from "apollo-server";
import typeDefs from "./schema";
import { Query,Mutation } from "./resolvers";
import { PrismaClient, Prisma } from "@prisma/client";

//create prisma instance
const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: { Query,Mutation  },
  context: { prisma },
});
server.listen().then(({ url }) => {
  console.log(`server is started at ${url}`);
});
