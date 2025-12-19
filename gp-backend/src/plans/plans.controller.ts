import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadExcel(@UploadedFile() file: any) {
    return this.plansService.handleExcelUpload(file);
  }
  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generatePlan(@Body() body: any) {
    return this.plansService.generateMockPlan(body);
  }
}
