import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import User from './user';
import Repository from './repository';

@Entity()
class Release {
    @PrimaryGeneratedColumn()
    id!: string;
  
    @Column()
    userId!: string; 
    
    @ManyToOne(() => Repository, (repository) => repository.id)
    repository!: Repository; // Links to the repository
  
    @Column({ default: false })
    seen!: boolean; // Tracks whether the user has seen the latest release
  }

export default Release;
