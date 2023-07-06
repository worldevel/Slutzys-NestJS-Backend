import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Post,
  Body
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import {
  SubscribePerformerPayload,
  PurchaseProductsPayload,
  PurchaseVideoPayload
} from '../payloads';
import { UserDto } from '../../user/dtos';
import { PaymentService } from '../services/payment.service';
import { OrderService } from '../services';

@Injectable()
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService
  ) {}

  @Post('/subscribe/performers')
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @CurrentUser() user: UserDto,
    @Body() payload: SubscribePerformerPayload
  ): Promise<DataResponse<any>> {
    const order = await this.orderService.createForPerformerSubscription(payload, user);
    const info = await this.paymentService.subscribePerformer(order, payload.paymentGateway || 'ccbill');
    return DataResponse.ok(info);
  }

  /**
   * purchase a performer video
   * @param user current login user
   * @param videoId performer video
   * @param payload
   */
  @Post('/purchase-video')
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async purchaseVideo(
    @CurrentUser() user: UserDto,
    @Body() payload: PurchaseVideoPayload
  ): Promise<DataResponse<any>> {
    const order = await this.orderService.createFromPerformerVOD(payload, user);
    const info = await this.paymentService.purchasePerformerVOD(order, payload.paymentGateway || 'ccbill');
    return DataResponse.ok(info);
  }

  @Post('/purchase-products')
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async purchaseProducts(
    @CurrentUser() user: UserDto,
    @Body() payload: PurchaseProductsPayload
  ): Promise<DataResponse<any>> {
    const order = await this.orderService.createFromPerformerProducts(payload, user);
    const info = await this.paymentService.purchasePerformerProducts(order, payload.paymentGateway || 'ccbill');
    return DataResponse.ok(info);
  }
}
