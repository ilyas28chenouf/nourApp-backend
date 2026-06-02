import { Injectable, Logger, LogLevel } from '@nestjs/common';

@Injectable()
export class AppLoggerService {
  private readonly logger = new Logger('NourBackend');

  debug(message: string, context?: Record<string, unknown>) {
    this.logger.debug(this.serialize(message, context));
  }

  log(message: string, context?: Record<string, unknown>) {
    this.logger.log(this.serialize(message, context));
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.logger.warn(this.serialize(message, context));
  }

  error(message: string, stack?: string, context?: Record<string, unknown>) {
    this.logger.error(this.serialize(message, context), stack);
  }

  setLogLevels(levels: LogLevel[]) {
    Logger.overrideLogger(levels);
  }

  private serialize(message: string, context?: Record<string, unknown>) {
    return context
      ? `${message} ${JSON.stringify(this.sanitize(context))}`
      : message;
  }

  private sanitize(value: unknown): unknown {
    if (!value || typeof value !== 'object') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.sanitize(item));
    }

    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(
          ([key]) =>
            !['authorization', 'cookie', 'firebaseToken', 'token'].includes(
              key.toLowerCase(),
            ),
        )
        .map(([key, nestedValue]) => [key, this.sanitize(nestedValue)]),
    );
  }
}
