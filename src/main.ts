import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Authorization, Content-Type',
  });

  // se estiver em dev usa 3001, senão usa 4001
  const port = process.env.PORT || 4001;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
