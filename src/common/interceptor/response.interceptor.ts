import {
  CallHandler,
  ExecutionContext,
  HttpCode,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();

    if (request.method === 'POST') {
      response.status(200);
      response.statusCode = 200;
    }

    return next.handle().pipe(
      map((data: any) => {
        if (
          data &&
          typeof data === 'object' &&
          'result' in data &&
          'statusCode' in data &&
          'message' in data &&
          'payload' in data
        ) {
          return data; // return as-is
        }

        const { message, messageLBL, payload } = this.extractData(data);

        return {
          requestId: randomUUID(),
          result: true,
          code: response.statusCode,
          message: message ?? 'Request successful',
          messageLBL: messageLBL ?? 'SUCCESS',
          payload: this.normalizePayload(payload),
        };
      }),
    );
  }

  private extractData(data: any) {
    // if data is array -> return as array
    if (Array.isArray(data)) {
      return {
        message: undefined,
        messageLBL: undefined,
        payload: data,
      };
    }

    // if not array -> treat as object
    if (data && typeof data === 'object') {
      const { message, messageLBL, success, payload, ...rest } = data;

      // priority payload property if provided
      if (payload !== undefined) {
        return { message, messageLBL, payload };
      }

      return {
        message,
        messageLBL,
        payload: Object.keys(rest).length ? rest : null,
      };
    }

    // primitives
    return {
      message: undefined,
      messageLBL: undefined,
      payload: data,
    };
  }

  private normalizePayload(payload: any) {
    if (payload === undefined || payload === null) return null;

    if (typeof payload === 'object' && !Array.isArray(payload)) {
      if (Object.keys(payload).length === 0) return null;
    }

    return payload;
  }
}
