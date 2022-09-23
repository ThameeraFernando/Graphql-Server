import { Context } from "../index";
interface canUserMutatePostParams {
  userId: number;
  postId: number;
  prisma: Context["prisma"];
}
export const canUserMutatePost = async ({
  userId,
  postId,
  prisma,
}: canUserMutatePostParams) => {
  console.log(userId);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return {
      userErrors: [
        {
          message: "User not found",
        },
      ],
      post: null,
    };
  }
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (post?.autherId !== user.id) {
    return {
      userErrors: [
        {
          message: "Post not own by user",
        },
      ],
      post: null,
    };
  }
};
