import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { NoRootException } from '../exceptions/no-root.exception';
import { PagesService } from './pages.service';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @Inject(forwardRef(() => PagesService))
    private readonly pagesService: PagesService,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async get(categoryId: string) {
    const category = await this.categoriesRepository.findOne(categoryId);
    if (!category) {
      throw new HttpException(
        'Category with this identifier does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return category;
  }

  async getHierarchy() {
    const root = await this.getRoot();
    const treeRepository = this.entityManager.getTreeRepository(Category);
    return await treeRepository.findDescendantsTree(root, {
      relations: ['pages'],
    });
  }

  async create(categoryCreationData: CreateCategoryDto) {
    const parentCategory = await this.categoriesRepository.findOne(
      categoryCreationData.parentCategoryId,
    );
    if (!parentCategory) {
      throw new HttpException(
        'Parent category with this identifier does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newCategory = await this.categoriesRepository.create({
      order: categoryCreationData.order,
      name: categoryCreationData.name,
      root: false,
      parent: parentCategory,
    });
    await this.categoriesRepository.save(newCategory);
    return newCategory;
  }

  async remove(categoryId: string) {
    const category = await this.categoriesRepository.findOne(categoryId, {
      relations: ['children', 'pages'],
    });
    const root = await this.getRoot();
    if (category.id === root.id) {
      throw new HttpException(
        'You cannot remove the root.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!category) {
      throw new HttpException(
        'Page with this identifier does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const childrenDeletionTasks = category.children.map((c) =>
      this.remove(c.id),
    );
    const pagesDeletionTasks = category.pages.map((p) =>
      this.pagesService.remove(p.id),
    );
    await Promise.all(childrenDeletionTasks);
    await Promise.all(pagesDeletionTasks);
    this.logger.warn(`Remove category with id ${category.id}.`);
    await this.categoriesRepository.remove(category);
    return category;
  }

  // Helpers

  private async getRoot() {
    const root = await this.categoriesRepository.findOne({ root: true });
    if (!root) {
      throw new NoRootException();
    }
    return root;
  }
}
