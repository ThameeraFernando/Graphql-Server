import { Context } from "..";
interface UserParentType {
  id: number;
}
const User = {
  posts: async (
    parent: UserParentType,
    { take, skip }: { take: number; skip: number },
    { prisma, userInfo }: Context
  ) => {
    const ownProfile = parent.id === userInfo?.user;
    if (ownProfile) {
      return prisma.post.findMany({
        where: {
          autherId: parent.id,
        },
        skip: skip,
        take: take,
      });
    } else {
      return prisma.post.findMany({
        where: {
          autherId: parent.id,
          publish: true,
        },
        skip: skip,
        take: take,
      });
    }
  },
};

export default User;
