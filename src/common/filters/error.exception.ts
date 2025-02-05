import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Injectable } from '@nestjs/common';
import { Response } from 'express';

@Catch()
@Injectable()
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const code = exception instanceof HttpException ? exception.getStatus() : 500;
    const error =
      exception instanceof HttpException
        ? (exception.getResponse() as string | { error: string; message: string | string[] })
        : 'Internal server error';
    console.log(exception);
    if (typeof error === 'string') {
      response.status(code).json({
        code: code,
        error: error,
        message: error,
        status: false,
        body: null,
      });
    } else {
      response.status(code).json({
        code: code,
        error: error.error,
        message: error.message,
        status: false,
        body: null,
      });
    }
  }
}
