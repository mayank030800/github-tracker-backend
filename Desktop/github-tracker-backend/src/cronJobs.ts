import axios from 'axios';
import { AppDataSource } from './db';
import Repository from './entities/repository';
import Release from './entities/release';

export const updateLatestReleases = async () => {
  try {
    const repoRepo = AppDataSource.getRepository(Repository);

    // Fetch all repositories from the database
    const repositories = await repoRepo.find();


    for (const repo of repositories) {
      try {
        // Fetch the latest release info from the GitHub API
        const response = await axios.get(
          `https://api.github.com/repos/${repo.owner}/${repo.name}/releases/latest`,
          {
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            },
          }
        );

        const { published_at } = response.data;

        // Update the repository's latest release info
        if(!repo.latestRelease || new Date(published_at) > repo.latestRelease){
            repo.latestRelease= new Date(published_at);
            try {
              const releaseRepo = AppDataSource.getRepository(Release);
              const newValue = {seen:false}
              await releaseRepo
              .createQueryBuilder()
              .update(Release)
              .set(newValue)
              .where('repositoryId = :repositoryId', {repositoryId: repo.id })
              .execute();
          
              console.log(`Updated releases for repositories: ${repo.name}`);
          } catch (error) {
          console.error('Error updating releases:', error);
          }
            await repoRepo.save(repo);
        }
      

        console.log(`Updated repository: ${repo.name} With Latest Release`);
      } catch (error) {
        console.error(`Failed to fetch release for ${repo.name}:`, error);
      }
    }

  } catch (error) {
    console.error('Error updating repository with latest releases:', error);
  }
};


