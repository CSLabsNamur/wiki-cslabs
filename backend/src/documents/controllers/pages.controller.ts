import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreatePageDto } from '../dto/create-page.dto';
import { PagesService } from '../services/pages.service';
import { JwtAuthenticationGuard } from '../../authentication/guards/jwt-authentication.guard';
import { AdminGuard } from '../../authentication/guards/admin-guard.service';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post('new')
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthenticationGuard)
  async create(@Body() pageCreationData: CreatePageDto) {
    return await this.pagesService.create(pageCreationData);
  }

  @Get(':pageId')
  async get(@Param() params: { pageId: string }) {
    return await this.pagesService.get(params.pageId);
  }
}
