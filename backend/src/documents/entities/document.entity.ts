import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  order: number;

  @Column()
  name: string;
}
