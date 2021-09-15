import { Document } from './document.entity';
import {
  Column,
  Entity,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Page } from './page.entity';

@Entity()
@Tree('nested-set')
export class Category extends Document {
  @Column({ type: 'boolean' })
  root: boolean;

  @TreeParent()
  parent: Category;

  @TreeChildren()
  children: Category[];

  @OneToMany(() => Page, (page) => page.category)
  pages: Page[];
}
