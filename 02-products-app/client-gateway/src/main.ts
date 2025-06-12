import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';

async function bootstrap() {
  const logger = new Logger('main-gateway');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(envs.PORT);

  logger.log(`Client Gateway is running on port ${envs.PORT}`);
}
bootstrap();
