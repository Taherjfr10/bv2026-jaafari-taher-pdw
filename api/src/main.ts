import { EnvService } from '@common/config/env.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@root/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { AppLogger } from '@common/logging/app-logger.service';
import { configureApplication } from '@root/bootstrap/application-bootstrap';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule.register());
  const envService: EnvService = app.get(EnvService);
  await app.listen('3000');
};

bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
