import { Global, Module } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';
import { HttpExceptionLoggingFilter } from './http-exception-logging.filter';
import { LoggingInterceptor } from './logging.interceptor';
import { RequestIdMiddleware } from './request-id.middleware';

@Global()
@Module({
  providers: [
    AppLoggerService,
    LoggingInterceptor,
    HttpExceptionLoggingFilter,
    RequestIdMiddleware,
  ],
  exports: [
    AppLoggerService,
    LoggingInterceptor,
    HttpExceptionLoggingFilter,
    RequestIdMiddleware,
  ],
})
export class LoggerModule {}
