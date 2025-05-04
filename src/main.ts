import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { getEndpoints } from './utils/app.util';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { Endpoint, HttpEndpoint } from './endpoint/entities/endpoint.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const dataSource = app.get(DataSource);
  const reflector = app.get(Reflector);
  const discoveryService = app.get(DiscoveryService);
  const metadataScanner = app.get(MetadataScanner);

  // Lấy tất cả các endpoint sau khi ứng dụng được khởi tạo
  const routes = getEndpoints(discoveryService, metadataScanner, reflector);

  try {
    await dataSource.query('TRUNCATE endpoint RESTART IDENTITY CASCADE');
    console.log('truncate successfully!');

    for (const route of routes) {
      const [method, url] = route?.split(' ') ?? [];
      if (!method || !url) continue;

      dataSource
        .createQueryBuilder()
        .insert()
        .into(Endpoint)
        .values({ url, method: method as HttpEndpoint })
        .execute();
    }
    console.log('Insert all routes into DB successfully!');
  } catch (error) {
    console.log('Failed to truncate table ', error);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
