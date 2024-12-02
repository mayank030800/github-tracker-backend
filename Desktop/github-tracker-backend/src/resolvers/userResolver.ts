import { AppDataSource } from '../db';
import User from '../entities/user';

export const userResolver = {
  Query: {
  },
  Mutation: {
     addUser: async (_: any, { username }: { username: string }) => {
      const userRepo = AppDataSource.getRepository(User);

      const existingUser = await userRepo.findOne({ where: { username } });
      if (existingUser) {
        throw new Error('Username already exists');
      }

      // let userId = uuidv4();
      // console.log(userId);
      // userIdString = userId.stringify();
      const user = userRepo.create({ username:username });
      return userRepo.save(user);
    },
  },
};
