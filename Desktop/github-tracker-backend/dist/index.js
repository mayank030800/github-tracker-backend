"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_cron_1 = __importDefault(require("node-cron"));
const apollo_server_express_1 = require("apollo-server-express");
const cors_1 = __importDefault(require("cors"));
const schema_1 = require("./schema");
const userResolver_1 = require("./resolvers/userResolver");
const repositoryResolver_1 = require("./resolvers/repositoryResolver");
const releaseResolver_1 = require("./resolvers/releaseResolver");
const db_1 = require("./db");
const cronJobs_1 = require("./cronJobs");
require('dotenv').config();
// Combine all resolvers
const resolvers = {
    Query: {
        ...repositoryResolver_1.repositoryResolver.Query,
        // Add any user-specific queries here
    },
    Mutation: {
        ...userResolver_1.userResolver.Mutation,
        ...repositoryResolver_1.repositoryResolver.Mutation,
        ...releaseResolver_1.releaseResolver.Mutation,
    },
};
(async () => {
    try {
        // Initialize database connection
        await db_1.AppDataSource.initialize();
        console.log('Database connected successfully');
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)({
            origin: 'http://localhost:3000',
            credentials: true,
        }));
        const server = new apollo_server_express_1.ApolloServer({ typeDefs: schema_1.typeDefs, resolvers });
        await server.start();
        node_cron_1.default.schedule('6 * * * *', async () => {
            console.log('Executing CRON job for updateLatestReleases...');
            await (0, cronJobs_1.updateLatestReleases)();
        });
        // Apply Apollo middleware to Express app
        server.applyMiddleware({ app, path: '/graphql' });
        // Start the server
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
        });
    }
    catch (error) {
        console.error('Error starting the server:', error);
    }
})();
