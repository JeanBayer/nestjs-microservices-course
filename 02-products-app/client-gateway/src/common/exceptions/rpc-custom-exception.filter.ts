/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ExceptionBodyDto {
  @IsNumber()
  @Type(() => Number)
  status: number = 500;

  @IsString()
  message: string = 'Internal Server Error';

  constructor(data: unknown) {
    Object.assign(this, data);
  }
}

export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{
      status: (code: number) => { json: (body: any) => any };
    }>();

    const error = exception.getError() as unknown;
    try {
      const rpcError = new ExceptionBodyDto(error);

      response.status(rpcError.status).json({
        status: rpcError.status,
        message: rpcError.message,
      });
    } catch (_) {
      response.status(500).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }
}
