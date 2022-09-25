import { Context } from "..";
interface ProfileParentType {
  id: number;
  bio: string;
  userId: number;
}
const Profile = {
  user: async (parent: ProfileParentType, __: any, { prisma }: Context) => {
    return prisma.user.findUnique({
      where: {
        id: Number(parent.userId),
      },
    });
  },
};

export default Profile;
