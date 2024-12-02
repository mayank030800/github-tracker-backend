import { AppDataSource } from '../db';
import Release from '../entities/release';

export const releaseResolver = {
  Mutation: {
    // markReleaseAsSeen: async (_: any, { releaseId }: { releaseId: number }) => {
    //   const releaseRepo = AppDataSource.getRepository(Release);
    //   const release = await releaseRepo.findOne({ where: { id: releaseId } });

    //   if (!release) throw new Error('Release not found');
    //   release.seen = true;
    //   return releaseRepo.save(release);
    // },
  },
};
