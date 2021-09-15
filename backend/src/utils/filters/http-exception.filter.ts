import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Logger } from '@nestjs/common';

/** NestJS global filter logging the internal server errors */
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /** Called when an exception occurred in a route
   * @param exception - The exception that occurred
   * @param host - Information about the host that triggered the exception
   */
  catch(exception: any, host: ArgumentsHost) {
    if (exception.status === 501) {
      this.logger.error(`Unknown exception occurred.`, exception);
    }
    super.catch(exception, host);
  }
}
