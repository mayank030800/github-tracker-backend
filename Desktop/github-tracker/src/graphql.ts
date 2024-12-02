import { gql } from '@apollo/client';

export interface SearchRepositoriesQuery {
  searchRepositories: any;
}

export interface GetSavedRepositoriesQuery {
    getSavedRepositories: any;
}


export interface SaveRepositoryVariables {
    userId: string;
    repositoryInput: RepositoryInput;
}

export interface RepositoryInput {
    id: string;
    name: string;
    owner: string;
    url: string;
    latestRelease: string | null;
    description: string;
    releaseDate: string;
}


// GraphQL Queries
export const SEARCH_REPOSITORIES = gql`
  query SearchRepositories($query: String!) {
    searchRepositories(query: $query)
  }
`;

export const GET_SAVED_REPOSITORIES = gql`
  query GetSavedRepositories($userId: ID!) {
    getSavedRepositories(userId: $userId) 
  }
`;

// GraphQL Mutations
export const SAVE_REPOSITORY = gql`
  mutation SaveRepository($userId: ID!, $repository: RepositoryInput!) {
    saveRepository(userId: $userId, repositoryInput: $repository) 
  }
`;

export const MARK_RELEASE_SEEN = gql`
  mutation MarkReleaseAsSeen($userId: ID!, $repositoryId: ID!) {
    markReleaseAsSeen(userId: $userId, repositoryId: $repositoryId) 
  }
`;
