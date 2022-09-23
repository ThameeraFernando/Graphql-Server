import { Context } from "../../index";
import { Post } from ".prisma/client";
import { canUserMutatePost } from "../../utils/canUserMutatePost";
interface PostArgs {
  input: {
    title?: string;
    content?: string;
  };
}

interface PostPayLoadType {
  userErrors: {
    message: string;
  }[];
  post: Post | null;
}

export const postResolvers = {
  //create a post
  postCreate: async (
    _: any,
    { input }: PostArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }
    const { title, content } = input;
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: "You must provide title and content",
          },
        ],
        post: null,
      };
    }
    const post = await prisma.post.create({
      data: {
        title,
        content,
        autherId: userInfo.user,
      },
    });
    return {
      userErrors: [],
      post,
    };
  },
  //update a post
  postUpdate: async (
    _: any,
    { postId, input }: { postId: String; input: PostArgs["input"] },
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo?.user) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }
    console.log(userInfo);

    const error = await canUserMutatePost({
      userId: userInfo.user,
      postId: Number(postId),
      prisma,
    });
    if (error) return error;

    const { content, title } = input;
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: "Need to have at least one feaild to update",
          },
        ],
        post: null,
      };
    }
    // prisma.post.update({data:{}});
    console.log(postId);

    const ifPostExist = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!ifPostExist) {
      return {
        userErrors: [
          {
            message: "Post does not exist",
          },
        ],
        post: null,
      };
    }
    interface payloadType {
      content?: string;
      title?: string;
    }
    let payloadToUpdate: payloadType = {};
    if (content) {
      payloadToUpdate.content = content;
    }
    if (title) {
      payloadToUpdate.title = title;
    }

    return {
      userErrors: [],
      post: await prisma.post.update({
        data: { ...payloadToUpdate },
        where: {
          id: Number(postId),
        },
      }),
    };
  },
  //delete a post
  postDelete: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    if (!userInfo?.user) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }
    console.log(userInfo.user);

    const error = await canUserMutatePost({
      userId: userInfo.user,
      postId: Number(postId),
      prisma,
    });
    if (error) return error;
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!post) {
      return {
        userErrors: [
          {
            message: "Post does not exist",
          },
        ],
        post: null,
      };
    }
    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });
    return {
      userErrors: [],
      post,
    };
  },
  postPublish: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayLoadType> => {
    console.log(postId, userInfo?.user);

    if (!userInfo?.user) {
      console.log("error");

      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }
    const error = await canUserMutatePost({
      userId: userInfo.user,
      postId: Number(postId),
      prisma,
    });
    if (error) {
      console.log("error");
      return error;
    }
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!post) {
      console.log("error");

      return {
        userErrors: [
          {
            message: "Post does not exist",
          },
        ],
        post: null,
      };
    }

    return {
      userErrors: [],
      post: await prisma.post.update({
        data: { publish: true },
        where: {
          id: Number(postId),
        },
      }),
    };
  },
  postUnPublish: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ) => {
    if (!userInfo?.user) {
      console.log("error");

      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }
    const error = await canUserMutatePost({
      userId: userInfo.user,
      postId: Number(postId),
      prisma,
    });
    if (error) {
      console.log("error");
      return error;
    }
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!post) {
      console.log("error");

      return {
        userErrors: [
          {
            message: "Post does not exist",
          },
        ],
        post: null,
      };
    }
    return {
      userErrors: [],
      post: await prisma.post.update({
        data: { publish: false },
        where: {
          id: Number(postId),
        },
      }),
    };
  },
};
