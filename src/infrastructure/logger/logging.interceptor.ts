import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppLoggerService } from './app-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.log('HTTP request completed', {
          method: request.method,
          url: request.originalUrl ?? request.url,
          statusCode: response.statusCode,
          responseTimeMs: Date.now() - startedAt,
          userId: request.user?.id,
          requestId: request.requestId,
        });
      }),
    );
  }
}
