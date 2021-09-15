import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../entities/page.entity';
import { Repository } from 'typeorm';
import { CreatePageDto } from '../dto/create-page.dto';
import { CategoriesService } from './categories.service';

@Injectable()
export class PagesService {
  private readonly logger: Logger = new Logger(PagesService.name);

  constructor(
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
    @InjectRepository(Page)
    private readonly pagesRepository: Repository<Page>,
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

  async remove(pageId: string) {
    const page = await this.pagesRepository.findOne(pageId);
    if (!page) {
      throw new HttpException(
        'Page with this identifier does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    }
    this.logger.warn(`Remove page with id ${page.id}.`);
    await this.pagesRepository.remove(page);
    return page;
  }
}
