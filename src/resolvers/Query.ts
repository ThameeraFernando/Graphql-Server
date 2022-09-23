import { Context } from "..";

const Query = {
  hello: () => {
    return "Hello World";
  },
  posts: async (_: any, __: any, { prisma }: Context) => {
    return await prisma.post.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          title: "asc",
        },
      ],
    });
  },
};

export default Query;
