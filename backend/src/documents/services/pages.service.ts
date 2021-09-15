import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../entities/page.entity';
import { Repository } from 'typeorm';
import { CreatePageDto } from '../dto/create-page.dto';
import { CategoriesService } from './categories.service';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private readonly pagesRepository: Repository<Page>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async get(pageId: string) {
    const page = await this.pagesRepository.findOne(pageId, {
      select: ['id', 'order', 'name', 'content'],
      relations: ['category'],
    });
    if (!page) {
      throw new HttpException(
        'Page with this identifier does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return page;
  }

  async create(pageCreationData: CreatePageDto) {
    const category = await this.categoriesService.get(
      pageCreationData.parentCategoryId,
    );
    const page = await this.pagesRepository.create({
      ...pageCreationData,
      category,
    });
    await this.pagesRepository.save(page);
    return page;
  }
}
