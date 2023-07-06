import { NestMiddleware } from '@nestjs/common';
export declare class RequestLoggerMiddleware implements NestMiddleware {
    use(req: any, res: any, next: Function): Promise<void>;
}
