import { Document } from './document.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Page extends Document {
  @Column({ type: 'text', select: false })
  content: string;

  @ManyToOne(() => Category, (category) => category.pages)
  category: Category;
}
