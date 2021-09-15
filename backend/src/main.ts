import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

/**
 * Bootstrap function. It instantiates the NestJS application and setup global providers
 * After calling the function, the server is listening on the specified port
 * Check the App module for needed environment variables
 * @see AppModule
 * @throws {Error} if the port is already taken or if an environment variable is missing
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port ? port : 3000);
}
bootstrap().then(); // Starts the server
