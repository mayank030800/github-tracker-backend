"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_1 = require("apollo-server");
exports.typeDefs = (0, apollo_server_1.gql) `
 scalar JSON

 type User {
  id: ID!
  username: String!
}

type Repository {
  id: ID!
  name: String!
  owner: String!
  url: String!
  description: String!
  latestRelease: String
  releaseDate: String
}


type Release {
  id: ID!
  user: User!
  repository: Repository!
  seen: Boolean!
}

input RepositoryInput{
  id: ID!
  name: String!
  owner: String!
  url: String!
  description: String!
  latestRelease: String
  releaseDate: String
}

type Query {
  getSavedRepositories(userId: ID!): JSON
  unseenRepositories(userId: ID!): [Repository!]!
  searchRepositories(query: String!): JSON
}

type Mutation {
  saveRepository(userId:ID!,repositoryInput: RepositoryInput!):JSON
  markReleaseAsSeen(userId: ID!, repositoryId: ID!): JSON
  addUser(username: String!): User!
}
`;
