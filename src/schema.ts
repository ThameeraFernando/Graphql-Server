import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    hello: String!
    posts: [Post!]!
    me: User
  }
  type Mutation {
    postCreate(input: postInput): PostPayLoad!
    postUpdate(postId: ID!, input: postInput): PostPayLoad!
    postDelete(postId: ID!): PostPayLoad!
    signUp(
      credentials: CredentialsInput
      name: String!
      bio: String!
    ): AuthPayload
    signIn(credentials: CredentialsInput): AuthPayload
    postPublish(postId: ID!): PostPayLoad!
    postUnPublish(postId: ID!): PostPayLoad!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    profile: Profile!
    posts: [Post!]!
  }
  type Profile {
    id: ID!
    bio: String!
    user: User!
  }
  type UserError {
    message: String!
  }
  type PostPayLoad {
    userErrors: [UserError!]!
    post: Post
  }

  input postInput {
    title: String
    content: String
  }
  type AuthPayload {
    userErrors: [UserError!]!
    token: String
  }
  input CredentialsInput {
    email: String!
    password: String!
  }
`;

export default typeDefs;
