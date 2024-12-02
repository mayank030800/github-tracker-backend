"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const axios_1 = __importDefault(require("axios"));
const db_1 = require("./db");
const repository_1 = __importDefault(require("./entities/repository"));
const release_1 = __importDefault(require("./entities/release"));
// Define the CRON job
const updateLatestReleases = async () => {
    try {
        const repoRepo = db_1.AppDataSource.getRepository(repository_1.default);
        // Fetch all repositories from the database
        const repositories = await repoRepo.find();
        let repositoryArray = [];
        for (const repo of repositories) {
            try {
                // Fetch the latest release info from the GitHub API
                const response = await axios_1.default.get(`https://api.github.com/repos/${repo.owner}/${repo.name}/releases/latest`, {
                    headers: {
                        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    },
                });
                const { published_at } = response.data;
                // Update the repository's latest release info
                if (!repo.latestRelease || new Date(published_at) > repo.latestRelease) {
                    repo.latestRelease = new Date(published_at);
                    repositoryArray.push(repo.id);
                    await repoRepo.save(repo);
                }
                console.log(`Updated repository: ${repo.name} With Latest Release`);
            }
            catch (error) {
                console.error(`Failed to fetch release for ${repo.name}:`, error);
            }
        }
        try {
            const releaseRepo = db_1.AppDataSource.getRepository(release_1.default);
            const newValue = { seen: false };
            await releaseRepo
                .createQueryBuilder()
                .update(release_1.default)
                .set(newValue)
                .where('repositoryId IN (:...repositoryIds)', { repositoryIds: repositoryArray })
                .execute();
            console.log(`Updated releases for repositories: ${repositoryArray}`);
        }
        catch (error) {
            console.error('Error updating releases:', error);
        }
    }
    catch (error) {
        console.error('Error updating repository with latest releases:', error);
    }
};
node_cron_1.default.schedule('* * * * *', updateLatestReleases);
