import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = Number(configService.get('PORT') || 3000);

  app.useGlobalPipes(
    new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }),
  );

  if (configService.get('NODE_ENV') !== 'prod') {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    const version = packageJson.version;

    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('honey-money')
      .setDescription('허니머니 API')
      .setVersion(version)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document);
  }

  await app.listen(port);
}
bootstrap();
