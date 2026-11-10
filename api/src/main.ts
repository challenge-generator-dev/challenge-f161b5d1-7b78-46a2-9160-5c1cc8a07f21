import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Aplicación iniciada en http://localhost:${port}`);
  logger.log(`Endpoints disponibles:`);
  logger.log(`  GET /orders - Listar todas las órdenes`);
  logger.log(`  GET /orders/:id - Obtener orden por ID`);
  logger.log(`  GET /orders/stream - Streaming de eventos de órdenes`);
}

bootstrap();