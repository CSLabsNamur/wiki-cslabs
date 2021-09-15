import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreatePageDto } from '../dto/create-page.dto';
import { PagesService } from '../services/pages.service';
import { JwtAuthenticationGuard } from '../../authentication/guards/jwt-authentication.guard';
import { AdminGuard } from '../../authentication/guards/admin-guard.service';
import { Page } from '../entities/page.entity';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get(':pageId')
  async get(@Param() params: { pageId: string }) {
    return await this.pagesService.get(params.pageId);
  }

  @Post('new')
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthenticationGuard)
  async create(@Body() pageCreationData: CreatePageDto): Promise<Page> {
    return await this.pagesService.create(pageCreationData);
  }

  @Delete(':pageId')
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthenticationGuard)
  async remove(@Param() params: { pageId: string }): Promise<Page> {
    return await this.pagesService.remove(params.pageId);
  }
}
