import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { AdminGuard } from '../../authentication/guards/admin-guard.service';
import { JwtAuthenticationGuard } from '../../authentication/guards/jwt-authentication.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('hierarchy')
  async getHierarchy() {
    return await this.categoriesService.getHierarchy();
  }

  @Post('new')
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthenticationGuard)
  async create(
    @Body() categoryCreationData: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.create(categoryCreationData);
  }

  @Delete(':categoryId')
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthenticationGuard)
  async remove(@Param() params: { categoryId: string }): Promise<Category> {
    return await this.categoriesService.remove(params.categoryId);
  }
}
