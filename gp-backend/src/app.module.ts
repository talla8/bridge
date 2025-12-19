import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PlansModule } from './plans/plans.module';

@Module({
  imports: [AuthModule, PlansModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
