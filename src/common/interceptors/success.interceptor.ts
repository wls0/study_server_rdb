import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const code = response.statusCode;

    if (response.req.url === '/withdrawal') {
      return next.handle();
    }

    if (response.req.url == '/app-ads.txt' || response.req.url == '/ads.txt') {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        code,
        message: 'success',
        status: true,
        body: data,
      })),
    );
  }
}
