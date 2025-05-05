import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { getEndpoints } from './utils/app.util';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { Endpoint, HttpEndpoint } from './endpoint/entities/endpoint.entity';
import { Role } from './role/entities/role.entity';
import { Permission } from './permissions/entities/permission.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const dataSource = app.get(DataSource);
  const queryRunner = dataSource.createQueryRunner();

  const reflector = app.get(Reflector);
  const discoveryService = app.get(DiscoveryService);
  const metadataScanner = app.get(MetadataScanner);

  // Lấy tất cả các endpoint sau khi ứng dụng được khởi tạo
  const routes = getEndpoints(discoveryService, metadataScanner, reflector);

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // DELETE ALL ROUTES
    await queryRunner.query('TRUNCATE endpoint RESTART IDENTITY CASCADE');
    await queryRunner.query('TRUNCATE permission RESTART IDENTITY CASCADE');
    console.log('truncate successfully!');

    // ADD ROUTES
    for (const route of routes) {
      const [method, url] = route?.split(' ') ?? [];
      if (!method || !url) continue;

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Endpoint)
        .values({ url, method: method as HttpEndpoint })
        .execute();
    }

    const roles = await queryRunner.manager
      .getRepository(Role)
      .createQueryBuilder('role')
      .where('role.isActive = :isActive', { isActive: true })
      .getMany();

    const endpoints = await queryRunner.manager
      .getRepository(Endpoint)
      .createQueryBuilder('endpoint')
      .getMany();

    // console.log(endpoints);

    for (const role of roles) {
      // Loop get all endpoints
      for (const endpoint of endpoints) {
        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(Permission)
          .values({
            endpointId: endpoint.id,
            roleName: role.name,
            isAllowed: role.name === 'admin' ? true : false,
          })
          .execute();
      }
    }

    await queryRunner.commitTransaction();
    console.log('Insert all routes into DB successfully!');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.log('Failed to truncate table ', error);
  } finally {
    await queryRunner.release();
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
