import JWT from "jsonwebtoken";
import { JWT_SIGNATURE } from "../resolvers/Mutation/Keys";
export const getUserFromToken =async (token: string) => {
  try {
    return await JWT.verify(token, JWT_SIGNATURE) as {
      user: number;
    };
  } catch (error) {
    return null;
  }
};
