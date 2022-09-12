import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor{
    new (...args:any[]): {}
}

export function Serialize(dto: ClassConstructor){
  return UseInterceptors(new SerializerInterceptor(dto));
}

export class SerializerInterceptor implements NestInterceptor {
  constructor(private dto: any){}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    //Run something before request is handled
    //by the request handler
    //console.log("this runs before the handler:", context)

    return handler.handle().pipe(
      map((data: any)=>{
        //console.log("this runs before sending response", data)
        return plainToInstance(this.dto, data, {
            excludeExtraneousValues: true
        })
      })
    )
  }
}