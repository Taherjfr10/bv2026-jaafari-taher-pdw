import { HealthModule } from '@core/health/health.module.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [HealthModule],
})
export class AppModule {}
