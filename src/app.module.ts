import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtService } from './jwt.service';
import { AuthController } from './auth.controller';


@Module({
  imports: [],
  controllers: [AppController,AuthController],
  providers: [AppService,JwtService],
})
export class AppModule {}
