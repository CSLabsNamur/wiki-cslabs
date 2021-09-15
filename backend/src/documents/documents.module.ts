import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/categories.controller';
import { Page } from './entities/page.entity';
import { PagesService } from './services/pages.service';
import { PagesController } from './controllers/pages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Page])],
  controllers: [CategoriesController, PagesController],
  providers: [CategoriesService, PagesService],
  exports: [CategoriesService, PagesService],
})
export class DocumentsModule {}
