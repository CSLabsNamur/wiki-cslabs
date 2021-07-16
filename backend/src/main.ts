import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from "@nestjs/common";

const PORT = 3000;

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  logger.log(`Server is listening to http://127.0.0.1:${PORT}`);
}

bootstrap().then();
