import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppLoggerService } from './app-logger.service';

@Catch()
@Injectable()
export class HttpExceptionLoggingFilter implements ExceptionFilter {
  constructor(
    private readonly logger: AppLoggerService,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
    const message =
      exception instanceof Error ? exception.message : 'Unexpected error';
    const stack = exception instanceof Error ? exception.stack : undefined;

    this.logger.error(message, stack, {
      method: request.method,
      url: request.originalUrl ?? request.url,
      statusCode: status,
      userId: request.user?.id,
      requestId: request.requestId,
    });

    response.status(status).json({
      statusCode: status,
      message,
      requestId: request.requestId,
      ...(isProduction ? {} : { stack }),
    });
  }
}
