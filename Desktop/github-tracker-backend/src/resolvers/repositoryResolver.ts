import { AppDataSource } from '../db';
import Repository from '../entities/repository';
import User from '../entities/user';
import Release from '../entities/release';
import { Octokit } from '@octokit/rest';

const token = process.env.GITHUB_TOKEN
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const repositoryResolver = {
  Query: {
    async getSavedRepositories(_: any, { userId }: { userId: string }) {
      const releaseRepo = AppDataSource.getRepository(Release);
  
      const allRepositories = await releaseRepo
      .createQueryBuilder('release')
      .leftJoinAndSelect('release.repository', 'repository')
      .where('release.userId = :userId', { userId })
      .select([
        'repository.id',
        'repository.name',
        'repository.owner',
        'repository.url',
        'repository.latestRelease',
        'repository.releaseDate',
        'release.seen', 
      ])
      .getMany();
    
      return allRepositories.map((entry) => ({
        id: entry.repository.id,
        name: entry.repository.name,
        owner: entry.repository.owner,
        url: entry.repository.url,
        latestRelease: entry.repository.latestRelease,
        releaseDate: entry.repository.releaseDate,
        seen: entry.seen, // Map the seen property
      }));
    },
    async searchRepositories(_: any, { query }: { query: string }) {
      try {
        const response = await octokit.search.repos({
          q: query, // Query string
          sort: 'stars', 
          order: 'desc', 
          per_page: 10, 
        });

        // console.log(response.data.items?.[0]);
  
        return response.data.items.map((repo) => ({
          id: repo.id,
          name: repo.name,
          owner: repo.owner?.login,
          url: repo.html_url,
          description: repo.description,
          latestRelease: repo?.updated_at,
          releaseDate: repo?.created_at
          // stars: repo.stargazers_count,
          // forks: repo.forks_count,
        }));
      } catch (error) {
        console.error('Error searching repositories:', error);
        throw new Error('Failed to search repositories');
      }
    }
  },

  Mutation: {
    async markReleaseAsSeen(_: any, { userId, repositoryId }: { userId: string; repositoryId: string }) {
    try{
      const releaseRepo = AppDataSource.getRepository(Release);

      const release = await releaseRepo.findOne({
        where: { userId:  userId , repository: { id: repositoryId } },
        relations: ['repository'],
      });
  
      if (!release) {
        throw new Error('Release not found for the given user and repository');
      }
  
      release.seen = true;
      await releaseRepo.save(release);
  
      return {
        message: 'Release record added successfully',
      };

    }catch(e){
      console.error('Error marking release as seen:', e);
    }
   
  },

  async saveRepository(_: any, { userId, repositoryInput }: { userId: string; repositoryInput: any }) {
    const repoTable = AppDataSource.getRepository(Repository);
    const releaseRepo = AppDataSource.getRepository(Release);
    // const userRepo = AppDataSource.getRepository(User);
    
    try {
      let existingRepository = await repoTable.findOne({ where: { id: repositoryInput.id } });
  
      if (!existingRepository) {
        existingRepository = repoTable.create({
          id: repositoryInput.id,
          name: repositoryInput?.name,
          owner: repositoryInput?.owner,
          url: repositoryInput?.url,
          latestRelease: repositoryInput?.latestRelease,
          description: repositoryInput?.description,
          releaseDate: repositoryInput?.releaseDate
        });
        await repoTable.save(existingRepository);
      }

  
  
      const existingRelease = await releaseRepo.findOne({
        where: {
          userId:  userId ,
          repository: { id: repositoryInput.id },
        },
        relations: ['repository'],
      });
  
      if (existingRelease) {
        throw new Error('Release record already exists for this user and repository');
      }
  
      // Create a new release record
      const newRelease = releaseRepo.create({
        userId:userId,
        repository: existingRepository,
        seen: false, // Initialize with "not seen"
      });
      await releaseRepo.save(newRelease);
  
      return {
        message: 'Repository and release record added successfully',
        repository: existingRepository,
        release: newRelease,
      };
    } catch (error) {
      console.error('Error saving repository:', error);
      throw new Error('Failed to save repository');
    }
  
  },
}
}
