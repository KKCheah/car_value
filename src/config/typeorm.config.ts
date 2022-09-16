import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    console.log("what is directory name", __dirname)
    switch (process.env.NODE_ENV) {
      case 'development':
        return {
          type: 'sqlite',
          synchronize: false,
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          // entities: ['**/*.entity.js'],
          migrations: [__dirname + '/migrations/*.ts'],
          migrationsRun: true
        };
      case 'test':
        return {
          type: 'sqlite',
          synchronize: false,
          migrationsRun: true,
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          // entities: ['**/*.entity.ts'],
          migrations: [__dirname + '/migrations/*.ts'],
        };
      case 'production':
        return {
          type: 'postgres',
          synchronize: false,
          migrationsRun: true,
          // database: this.configService.get<string>('DB_NAME'),
          // autoLoadEntities: true,
          entities: ['**/*.entity.js'],
          migrations: [__dirname + '/migrations/*.ts'],
          ssl: {
            rejectUnauthorized: false
          }
        };
    }
  }
}
