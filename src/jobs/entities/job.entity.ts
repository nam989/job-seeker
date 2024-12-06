import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  country: string;

  @Column('decimal', { precision: 10, scale: 2 })
  salary: number;

  @Column('simple-array')
  skills: string[];
}
