import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ExceptionResponse, getMessageValidationError } from './utils/utils.error';
import cookieParser from 'cookie-parser';
import { NotFoundExceptionFilter } from './utils/util.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(process.env.PREFIX);

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('NestJS Social API')
    .setDescription('The Social API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return new ExceptionResponse(HttpStatus.BAD_REQUEST, getMessageValidationError(errors));
      },
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new NotFoundExceptionFilter());

  app.use(cookieParser());

  const PORT = Number(process.env.PORT) || 3000;
  await app.listen(PORT);
}

bootstrap().then(() => console.log(`Server started on port ${process.env.PORT}`));
