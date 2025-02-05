import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErrorExceptionFilter } from './common/filters/error.exception';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { FinancialModule } from './financial/financial.module';
import { AuthModule } from './auth/auth.module';
import { User } from './model/user.model';
import { RefreshToken } from './model/refresh-token.model';
import { FinancialPaymentSource } from './model/financial-payment-source.model';
import { FinancialRecord } from './model/financial-record.model';
import { FinancialTag } from './model/financial-tag.model';
import { JwtModule } from './common/jwt/jwt.module';

@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.json(),
      level: 'info',
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({
      envFilePath: ['config/.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<number>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, RefreshToken, FinancialTag, FinancialRecord, FinancialPaymentSource],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    FinancialModule,
    AuthModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter,
    },
  ],
})
export class AppModule {}
