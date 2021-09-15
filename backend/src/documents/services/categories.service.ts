import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { NoRootException } from '../exceptions/no-root.exception';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

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

  // Helpers

  private async getRoot() {
    const root = await this.categoriesRepository.findOne({ root: true });
    if (!root) {
      throw new NoRootException();
    }
    return root;
  }
}
