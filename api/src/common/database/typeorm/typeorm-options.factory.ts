import { join } from 'node:path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { AppMode, EnvService, ValidatedEnvironment } from '@common/config';

export const createNestTypeOrmOptions = (
  envService: EnvService,
): TypeOrmModuleOptions => {
  return {
    ...createTypeOrmDataSourceOptions({
      NODE_ENV: envService.appMode(),
      DB_TYPE: envService.databaseType,
      DB_HOST: envService.databaseHost,
      DB_PORT: envService.databasePort,
      DB_USER: envService.databaseUser,
      DB_PASSWORD: envService.databasePassword,
      DB_DATABASE: envService.databaseName,
      DB_SYNC: envService.databaseSynchronize,
      DB_MIGRATION: envService.databaseMigrationsRun,
      DB_SCHEMA: envService.databaseSchema,
      DB_LOG: envService.databaseLogging,

    }),
    autoLoadEntities: true,
    manualInitialization: envService.isTest,
    retryAttempts: envService.isTest ? 0 : 3,
    retryDelay: 1000,
  };
};

export const createTypeOrmDataSourceOptions = (
  environment: Pick<
    ValidatedEnvironment,
    | 'NODE_ENV'
    | 'DB_TYPE'
    | 'DB_HOST'
    | 'DB_PORT'
    | 'DB_USER'
    | 'DB_PASSWORD'
    | 'DB_DATABASE'
    | 'DB_SYNC'
    | 'DB_MIGRATION'
    | 'DB_SCHEMA'
    | 'DB_LOG'

  >,
): DataSourceOptions => {
  return {
    type: environment.DB_TYPE,
    host: environment.DB_HOST,
    port: environment.DB_PORT,
    username: environment.DB_USER,
    password: environment.DB_PASSWORD,
    database: environment.DB_DATABASE,
    synchronize:
      environment.NODE_ENV === AppMode.Prod ? false : environment.DB_SYNC,
    migrationsRun: environment.DB_MIGRATION,
    schema: environment.DB_SCHEMA,
    logging: environment.DB_LOG,
    extra:
      environment.DB_SCHEMA === 'public'
        ? undefined
        : { options: `-c search_path="${environment.DB_SCHEMA}",public` },
    entities: [join(__dirname, '..', '..', '..', '**', '*.entity.{ts,js}')],
    migrations: [
      join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'database',
        'migrations',
        '*.{ts,js}',
      ),
    ],
  };
};
