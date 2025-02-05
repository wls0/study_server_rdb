import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Observable, tap } from 'rxjs';
import { Logger } from 'winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.info({
            type: 'request',
            id: request.id,
            method: request.method,
            url: request.url,
            ip: request.ip,
            headers: request.headers,
            body: request.body,
            query: request.query,
            params: request.params,
          });
        },
      }),
      tap({
        error: (err: Error): void => {
          console.error(err);
          this.logger.error({
            id: request.id,
            method: request.method,
            url: request.url,
            ip: request.ip,
            headers: request.headers,
            body: request.body,
            query: request.query,
            params: request.params,
            error: err,
          });
        },
      }),
    );
  }
}
