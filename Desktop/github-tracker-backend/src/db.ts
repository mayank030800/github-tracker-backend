import 'reflect-metadata';
import { DataSource } from 'typeorm';
import User from './entities/user';
import Repository from './entities/repository';
import Release from './entities/release';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'myuser', // Replace with your DB username
  password: 'mypassword', // Replace with your DB password
  database: 'mydb', // Ensure this DB exists
  synchronize: true, // Auto-create tables in development
  logging: true,
  entities: [User, Repository,Release],
});
