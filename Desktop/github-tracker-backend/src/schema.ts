import { gql } from 'apollo-server';

export const typeDefs = gql`
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
