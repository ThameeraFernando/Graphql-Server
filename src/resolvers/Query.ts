import { Context } from "..";

const Query = {
  hello: () => {
    return "Hello World";
  },
  posts: async (
    _: any,
    { take, skip }: { take: number; skip: number },
    { prisma }: Context
  ) => {
    return await prisma.post.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          title: "asc",
        },
      ],
      skip: skip,
      take: take,
    });
  },
  me: async (_: any, __: any, { prisma, userInfo }: Context) => {
    if (!userInfo?.user) return null;
    return prisma.user.findUnique({
      where: {
        id: userInfo.user,
      },
    });
  },
  profile: async (
    _: any,
    { userId }: { userId: string },
    { prisma }: Context
  ) => {
    console.log(userId);

    return prisma.profile.findUnique({
      where: {
        userId: Number(userId),
      },
    });
  },
};

export default Query;
