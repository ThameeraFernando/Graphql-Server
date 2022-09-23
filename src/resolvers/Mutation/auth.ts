import { Context } from "../../index";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JWT_SIGNATURE } from "./Keys";
interface SignupArgs {
  credentials: {
    email: string;
    password: string;
  };
  name: string;
  bio: string;
}
interface SignInArgs {
  credentials: {
    email: string;
    password: string;
  };
}
interface UserPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}
export const authResolvers = {
  signUp: async (
    _: any,
    { bio, name, credentials }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;
    //validate the email
    const isEmail = validator.isEmail(email);
    if (!isEmail) {
      return {
        userErrors: [
          {
            message: "invalid email",
          },
        ],
        token: null,
      };
    }
    const isValidPassword = validator.isLength(password, {
      min: 5,
    });
    if (!isValidPassword) {
      return {
        userErrors: [
          {
            message: "invalid password",
          },
        ],
        token: null,
      };
    }
    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: "invalid name and bio",
          },
        ],
        token: null,
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    const token = await JWT.sign(
      {
        user: user.id,
      },
      JWT_SIGNATURE,
      { expiresIn: 360000 }
    );
    await prisma.profile.create({
      data: {
        bio,
        userId: user.id,
      },
    });
    return {
      userErrors: [],
      token: token,
    };
  },
  signIn: async (
    _: any,
    { credentials }: SignInArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return {
        userErrors: [
          {
            message: "In valid credentials",
          },
        ],
        token: null,
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        userErrors: [
          {
            message: "In valid credentials",
          },
        ],
        token: null,
      };
    }
    return {
      userErrors: [],
      token: JWT.sign({ userId: user.id }, JWT_SIGNATURE, {
        expiresIn: 36000000,
      }),
    };
  },
};
