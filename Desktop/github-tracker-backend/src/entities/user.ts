import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import Repository from './repository';
import Release from './release';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  username!: string;

  // @OneToMany(() => Release, (Release) => Release.user)
  // Release!: Release[];
}

export default User;
