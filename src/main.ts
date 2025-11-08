import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Conciergerie Marrakech API')
    .setDescription('API de la plateforme de réservation de conciergerie à Marrakech')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('properties', 'Gestion des propriétés')
    .addTag('bookings', 'Gestion des réservations')
    .addTag('users', 'Gestion des utilisateurs')
    .addTag('auth', 'Authentification')
    .addTag('payments', 'Gestion des paiements')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`\n🚀 Server is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs\n`);
}

bootstrap();
