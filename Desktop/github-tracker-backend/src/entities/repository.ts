import { Entity, PrimaryGeneratedColumn, Column, OneToMany,PrimaryColumn } from 'typeorm';

@Entity()
class Repository {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({nullable:true})
  owner!: string;

  @Column()
  url!: string;

  @Column()
  description!: string;

  @Column({type: 'timestamp', nullable: true })
  latestRelease?: Date; 

  @Column({ type: 'timestamp', nullable: true })
  releaseDate?: Date; 
}

export default Repository;
