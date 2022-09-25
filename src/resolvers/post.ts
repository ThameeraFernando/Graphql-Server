import { Context } from "..";
import { userLoader } from "../dataLoaders/userLoder";

interface PostParentType {
  autherId: number;
}
const Post = {
  user: async (parent: PostParentType, __: any, { prisma }: Context) => {
    return userLoader.load(parent.autherId);
  },
};

export default Post;
