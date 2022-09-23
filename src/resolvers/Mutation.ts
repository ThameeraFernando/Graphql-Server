import { Context } from "../index";
import { Post } from ".prisma/client";
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

const Mutation = {
  //create a post
  postCreate: async (
    _: any,
    { input }: PostArgs,
    { prisma }: Context
  ): Promise<PostPayLoadType> => {
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
        autherId: 1,
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
    { prisma }: Context
  ): Promise<PostPayLoadType> => {
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
    { prisma }: Context
  ): Promise<PostPayLoadType> => {
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
        userErrors:[],
        post
    }
  },
};

export default Mutation;
