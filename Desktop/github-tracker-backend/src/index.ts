import express from 'express';
import cron from 'node-cron';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import { typeDefs } from './schema';
import { userResolver } from './resolvers/userResolver';
import { repositoryResolver } from './resolvers/repositoryResolver';
import { releaseResolver } from './resolvers/releaseResolver';
import { AppDataSource } from './db';
import { updateLatestReleases } from './cronJobs';
require('dotenv').config();

// Combine all resolvers
const resolvers = {
  Query: {
    ...repositoryResolver.Query,
    // Add any user-specific queries here
  },
  Mutation: {
    ...userResolver.Mutation,
    ...repositoryResolver.Mutation,
    ...releaseResolver.Mutation,
  },
};

(async () => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    const app = express();

    app.use(cors({
      origin: 'http://localhost:3000',
      credentials: true,              
    }));

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    cron.schedule('6 * * * *', async () => {
      console.log('Executing CRON job for updateLatestReleases.');
      await updateLatestReleases();
    });

    // Apply Apollo middleware to Express app
    server.applyMiddleware({ app, path: '/graphql' });

    // Start the server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
})();
