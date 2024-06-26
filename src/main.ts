import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
// import * as passport from 'passport';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'production'
      ? '.production.env'
      : process.env.NODE_ENV === 'stage'
        ? '.stage.env'
        : '.development.env',
  ),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://egoing-front-3ketjwcx9-rladudgh321s-projects.vercel.app',
    credentials: true,
  });

  // app.use(passport.initialize());

  const config = new DocumentBuilder()
    .setTitle('egoing API board')
    .setDescription('CRUD example')
    .setVersion('0.0.1')
    .addTag('BOARD addtag')
    .addBearerAuth()

    .build();
  const document = SwaggerModule.createDocument(app, config);
  const swaggerCustomoptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  SwaggerModule.setup('api', app, document, swaggerCustomoptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const stage = configService.get('STAGE');
  const port = 3065;
  console.info(`서버모드는 ${stage}이고 port는 ${port}`);

  await app.listen(port);
}
bootstrap();
