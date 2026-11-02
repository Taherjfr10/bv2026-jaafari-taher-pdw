import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from '@common/config/app-config.module';
import { LoggingModule } from '@common/logging/logging.module';
import { ApiInterceptor } from '@common/api/interceptor';
import { HealthModule } from '@core/health/health.module';
import { AccountModule } from '@core/account/account.module';
import { DatabaseModule } from '@common/database/database.module';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  static register(): DynamicModule {
    return {
      module: AppModule,
      imports: [AppConfigModule.register(),
        LoggingModule,
        DatabaseModule,
        HealthModule,
        AccountModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    };
  }
}
