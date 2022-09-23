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
  me: async (_: any, __: any, { prisma, userInfo }: Context) => {
    if (!userInfo?.user) return null;
    return prisma.user.findUnique({
      where:{
        id:userInfo.user
      }
    })
  },
};

export default Query;
