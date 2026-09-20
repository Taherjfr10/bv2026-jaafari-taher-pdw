import { EnvService } from '@common/config/environment/env.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@root/app.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule.register()); 
  const envService: EnvService = app.get(EnvService);
  await app.listen('3000');
};

bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
  process.exit(1);
});