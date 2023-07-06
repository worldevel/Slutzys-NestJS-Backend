/* eslint-disable no-param-reassign */
import {
  Injectable,
  Inject,
  forwardRef,
  ForbiddenException
} from '@nestjs/common';
import { PerformerService } from 'src/modules/performer/services';
import {
  ProductService, VideoService
} from 'src/modules/performer-assets/services';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerDto } from 'src/modules/performer/dtos';
import {
  EntityNotFoundException, StringHelper
} from 'src/kernel';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import * as moment from 'moment';
import { UserService } from 'src/modules/user/services';
import { MailerService } from 'src/modules/mailer';
import { CouponService } from 'src/modules/coupon/services';
import { SUBSCRIPTION_TYPE } from 'src/modules/subscription/constants';
import { toObjectId } from 'src/kernel/helpers/string.helper';
import { ORDER_DETAIL_MODEL_PROVIDER, ORDER_MODEL_PROVIDER } from '../providers';
import { OrderDetailsModel, OrderModel } from '../models';
import {
  OrderSearchPayload, OrderUpdatePayload, PurchaseProductsPayload, PurchaseVideoPayload, SubscribePerformerPayload
} from '../payloads';
import {
  DELIVERY_STATUS,
  ORDER_STATUS,
  PAYMENT_TYPE,
  PRODUCT_TYPE
} from '../constants';
import { OrderDetailsDto, OrderDto } from '../dtos';
import { DifferentPerformerException } from '../exceptions';

@Injectable()
export class OrderService {
  constructor(
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    @Inject(forwardRef(() => VideoService))
    private readonly videoService: VideoService,
    @Inject(forwardRef(() => CouponService))
    private readonly couponService: CouponService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(ORDER_MODEL_PROVIDER)
    private readonly orderModel: Model<OrderModel>,
    @Inject(ORDER_DETAIL_MODEL_PROVIDER)
    private readonly orderDetailModel: Model<OrderDetailsModel>,
    private readonly mailService: MailerService
  ) { }

  public async findById(id: string | ObjectId) {
    return this.orderModel.findById(id);
  }

  public async findByIds(ids: string[] | ObjectId[]) {
    return this.orderModel.find({ _id: { $in: ids } });
  }

  public async findByQuery(payload: any) {
    const data = await this.orderModel.find(payload);
    return data;
  }

  public async findDetailsByQuery(payload: any) {
    const data = await this.orderDetailModel.find(payload);
    return data;
  }

  /**
   * search in order collections
   * @param req
   * @param user
   */
  public async search(req: OrderSearchPayload) {
    const query = {
      status: {
        $ne: ORDER_STATUS.CREATED
      }
    } as any;
    if (req.sellerId) query.sellerId = req.sellerId;
    if (req.buyerId) query.buyerId = req.buyerId;
    if (req.userId) query.buyerId = req.userId;
    if (req.status) query.status = req.status;
    if (req.deliveryStatus) query.deliveryStatus = req.deliveryStatus;
    if (req.fromDate && req.toDate) {
      query.createdAt = {
        $gt: moment(req.fromDate),
        $lt: moment(req.toDate)
      };
    }
    const sort = {
      [req.sortBy || 'updatedAt']: req.sort || -1
    };
    const [orders, total] = await Promise.all([
      this.orderModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(req.limit ? parseInt(req.limit as string, 10) : 10)
        .skip(parseInt(req.offset as string, 10)),
      this.orderModel.countDocuments(query)
    ]);
    const data = orders.map((o) => new OrderDto(o));
    const orderIds = orders.map((o) => o._id);
    const performerIds = [
      ...orders.filter((o) => o.buyerSource === 'performer').map((o) => o.buyerId),
      ...orders.filter((o) => o.sellerSource === 'performer').map((o) => o.sellerId)
    ];
    const userIds = orders.filter((o) => o.buyerSource === 'user').map((o) => o.buyerId);
    const sellers = [];
    const buyers = [];
    const orderDetails = [];
    if (performerIds.length) {
      const performers = await this.performerService.findByIds(performerIds);
      sellers.push(
        ...performers.map((p) => (new PerformerDto(p)).toResponse())
      );
    }
    if (userIds.length) {
      const users = await this.userService.findByIds(userIds);
      buyers.push(
        ...users.map((u) => (new UserDto(u)).toResponse())
      );
    }

    if (orderIds.length) {
      const orderDetailsList = await this.orderDetailModel.find({
        orderId: {
          $in: orderIds
        }
      });
      orderDetails.push(...orderDetailsList);
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const order of data) {
      if (order.sellerId) {
        order.seller = sellers.find((s) => s._id.toString() === order.sellerId.toString());
      }
      if (order.buyerId) {
        order.buyer = buyers.find((b) => b._id.toString() === order.buyerId.toString());
        if (!order.buyer) {
          order.buyer = sellers.find((b) => b._id.toString() === order.buyerId.toString());
        }
      }
      order.details = orderDetails.filter((d) => d.orderId.toString() === order._id.toString());
    }

    return {
      data,
      total
    };
  }

  public async orderDetailsSearch(req: OrderSearchPayload) {
    const query = {
      status: {
        $ne: ORDER_STATUS.CREATED
      }
    } as any;
    if (req.q) {
      const regexp = new RegExp(
        req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
        'i'
      );
      query.$or = [
        {
          orderNumber: { $regex: regexp }
        },
        {
          name: { $regex: regexp }
        },
        {
          description: { $regex: regexp }
        }
      ];
    }
    if (req.sellerId) query.sellerId = req.sellerId;
    if (req.buyerId) query.buyerId = req.buyerId;
    if (req.userId) query.buyerId = req.userId;
    if (req.status) query.status = req.status;
    if (req.deliveryStatus) query.deliveryStatus = req.deliveryStatus;
    if (req.fromDate && req.toDate) {
      query.createdAt = {
        $gt: moment(req.fromDate),
        $lt: moment(req.toDate)
      };
    }
    const sort = {
      [req.sortBy || 'updatedAt']: req.sort || -1
    };
    const [orders, total] = await Promise.all([
      this.orderDetailModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(req.limit ? parseInt(req.limit as string, 10) : 10)
        .skip(parseInt(req.offset as string, 10)),
      this.orderDetailModel.countDocuments(query)
    ]);

    const sellers = [];
    const buyers = [];
    const performerIds = orders.filter((o) => o.sellerSource === 'performer').map((o) => o.sellerId);
    const userIds = orders.filter((o) => o.buyerSource === 'user').map((o) => o.buyerId);
    if (performerIds.length) {
      const performers = await this.performerService.findByIds(performerIds);
      sellers.push(
        ...performers.map((p) => (new PerformerDto(p)).toResponse())
      );
    }
    if (userIds.length) {
      const users = await this.userService.findByIds(userIds);
      buyers.push(
        ...users.map((u) => (new UserDto(u)).toResponse())
      );
    }

    const data = orders.map((o) => new OrderDetailsDto(o).toResponse());

    // eslint-disable-next-line no-restricted-syntax
    for (const order of data) {
      if (order.sellerId) {
        order.seller = sellers.find((s) => s._id.toString() === order.sellerId.toString());
      }
      if (order.buyerId) {
        order.buyer = buyers.find((b) => b._id.toString() === order.buyerId.toString());
      }
    }

    return {
      data,
      total
    };
  }

  public async getOrderDetails(id: string | ObjectId) {
    const details = await this.orderDetailModel.findById(id);
    if (!details) {
      throw new EntityNotFoundException();
    }

    const dto = new OrderDetailsDto(details.toObject()).toResponse();
    if (details.buyerSource === 'user') {
      const user = await this.userService.findById(details.buyerId);
      dto.buyer = (new UserDto(user)).toResponse();
    }

    if (details.sellerSource === 'performer') {
      const performer = await this.performerService.findById(details.sellerId);
      dto.seller = (new PerformerDto(performer)).toResponse();
    }

    return dto;
  }

  public async updateDetails(id: string, payload: OrderUpdatePayload, currentUser: UserDto) {
    const details = await this.orderDetailModel.findById(id);
    if (!details) {
      throw new EntityNotFoundException();
    }
    if (!currentUser.roles?.includes('admin') && currentUser._id.toString() !== details.sellerId.toString()) {
      throw new ForbiddenException();
    }
    const oldStatus = details.deliveryStatus;
    await this.orderDetailModel.updateOne({ _id: id }, payload);
    const newUpdate = await this.orderDetailModel.findById(id);
    if (newUpdate.deliveryStatus !== oldStatus) {
      if (details.buyerSource === 'user') {
        const user = await this.userService.findById(details.buyerId);
        if (user) {
          await this.mailService.send({
            subject: 'Order Status Changed',
            to: user.email,
            data: {
              user,
              order: newUpdate,
              deliveryStatus: newUpdate.deliveryStatus,
              oldDeliveryStatus: oldStatus
            },
            template: 'update-order-status'
          });
        }
      }
    }
  }

  public generateOrderNumber() {
    return `${StringHelper.randomString(8)}`.toUpperCase();
  }

  /**
   * get list of sub orders
   * @param orderId order id
   */
  public async getDetails(orderId: string | ObjectId): Promise<any> {
    // TODO - should convert to oder details DTO?
    return this.orderDetailModel.find({
      orderId
    });
  }

  /**
   * create order with created status, means just place cart to order and waiting to process
   * @param payload
   * @param user
   * @param orderStatus
   */
  public async createFromPerformerProducts(payload: PurchaseProductsPayload, user: UserDto, buyerSource = 'user', orderStatus = ORDER_STATUS.CREATED) {
    const {
      products, deliveryAddress, postalCode, phoneNumber, paymentGateway = 'ccbill'
    } = payload;
    const productIds = payload.products.map((p) => p._id);
    const prods = await this.productService.findByIds(productIds);
    if (!products.length || !prods.length) {
      throw new EntityNotFoundException();
    }
    const checkSamePerformerProducts = prods.filter((p) => p.performerId.toString() === prods[0].performerId.toString());
    if (checkSamePerformerProducts.length !== prods.length) {
      throw new DifferentPerformerException();
    }
    const { performerId } = prods[0];
    const performer = await this.performerService.findById(performerId);
    if (!performer) {
      throw new EntityNotFoundException();
    }

    let totalQuantity = 0;
    let originalPrice = 0;
    let coupon = null;
    if (payload.couponCode) {
      coupon = await this.couponService.applyCoupon(
        payload.couponCode,
        user._id
      );
    }

    const orderDetails = [];
    prods.forEach((p) => {
      const groupProducts = products.filter((op) => op._id.toString() === p._id.toString());
      let productQuantity = 0;
      groupProducts.forEach((op) => {
        productQuantity += op.quantity;
      });
      const originalProductPrice = productQuantity * p.price;
      const productPrice = coupon
        ? parseFloat((originalProductPrice - (originalProductPrice * coupon.value) as any)).toFixed(2)
        : originalProductPrice;
      totalQuantity += productQuantity;
      originalPrice += originalProductPrice;
      orderDetails.push({
        buyerId: user._id,
        buyerSource: 'user',
        sellerId: performerId,
        sellerSource: 'performer',
        name: p.name,
        description: p.description,
        unitPrice: p.price,
        originalPrice: originalProductPrice,
        totalPrice: productPrice,
        productType: p.type,
        productId: p._id,
        quantity: productQuantity,
        payBy: 'money', // default!!
        deliveryStatus: DELIVERY_STATUS.CREATED,
        deliveryAddress,
        postalCode,
        phoneNumber,
        paymentGateway,
        couponInfo: coupon
      });
    });

    const totalPrice = coupon
      ? parseFloat((originalPrice - (originalPrice * coupon.value)).toFixed(2))
      : originalPrice;

    const order = await this.orderModel.create({
      buyerId: user._id,
      buyerSource,
      sellerId: performerId,
      sellerSource: 'performer',
      type: PAYMENT_TYPE.PERFORMER_PRODUCT,
      orderNumber: this.generateOrderNumber(),
      quantity: totalQuantity,
      originalPrice,
      totalPrice,
      couponInfo: coupon,
      status: orderStatus,
      deliveryAddress,
      postalCode,
      phoneNumber,
      paymentGateway,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await Promise.all(orderDetails.map((detail, index) => {
      detail.orderId = order._id;
      detail.orderNumber = `${order.orderNumber}-S${index + 1}`;
      return this.orderDetailModel.create(detail);
    }));

    return order;
  }

  public async createFromPerformerVOD(payload: PurchaseVideoPayload, user: UserDto, buyerSource = 'user', orderStatus = ORDER_STATUS.CREATED) {
    const { paymentGateway = 'ccbill', videoId, couponCode } = payload;
    const video = await this.videoService.findById(videoId);
    if (!video?.isSaleVideo || !video?.price) {
      throw new EntityNotFoundException();
    }
    const { performerId } = video;
    const performer = await this.performerService.findById(performerId);
    if (!performer) {
      throw new EntityNotFoundException();
    }

    const totalQuantity = 1;
    const originalPrice = video.price;
    let coupon = null;
    if (couponCode) {
      coupon = await this.couponService.applyCoupon(
        couponCode,
        user._id
      );
    }
    const productPrice = coupon
      ? parseFloat((originalPrice - (originalPrice * coupon.value)).toFixed(2))
      : originalPrice;

    const order = await this.orderModel.create({
      buyerId: user._id,
      buyerSource,
      sellerId: performerId,
      sellerSource: 'performer',
      type: PAYMENT_TYPE.SALE_VIDEO,
      orderNumber: this.generateOrderNumber(),
      postalCode: '',
      quantity: totalQuantity,
      originalPrice,
      totalPrice: productPrice,
      couponInfo: coupon,
      status: orderStatus,
      deliveryAddress: null,
      paymentGateway,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.orderDetailModel.create({
      orderId: order._id,
      orderNumber: `${order.orderNumber}-S1`,
      buyerId: user._id,
      buyerSource: 'user',
      sellerId: performerId,
      sellerSource: 'performer',
      name: video.title,
      description: video.title || video.description,
      unitPrice: video.price,
      originalPrice,
      totalPrice: productPrice,
      productType: PRODUCT_TYPE.SALE_VIDEO,
      productId: video._id,
      quantity: 1,
      payBy: 'money', // default!!
      deliveryStatus: DELIVERY_STATUS.CREATED,
      couponInfo: coupon,
      paymentGateway
    });

    return order;
  }

  public async createForPerformerSubscription(payload: SubscribePerformerPayload, user: UserDto, buyerSource = 'user', orderStatus = ORDER_STATUS.CREATED) {
    const { type, performerId, paymentGateway = 'ccbill' } = payload;
    const performer = await this.performerService.findById(performerId);
    if (!performer) {
      throw new EntityNotFoundException();
    }
    const price = type === SUBSCRIPTION_TYPE.MONTHLY
      ? performer.monthlyPrice : performer.yearlyPrice;
    const order = await this.orderModel.create({
      buyerId: user._id,
      buyerSource,
      sellerId: toObjectId(performerId),
      sellerSource: 'performer',
      type: type === SUBSCRIPTION_TYPE.MONTHLY ? PAYMENT_TYPE.MONTHLY_SUBSCRIPTION : PAYMENT_TYPE.YEARLY_SUBSCRIPTION,
      orderNumber: this.generateOrderNumber(),
      postalCode: '',
      quantity: 1,
      totalPrice: price,
      couponInfo: null,
      status: orderStatus,
      deliveryAddress: null,
      paymentGateway,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const name = type === SUBSCRIPTION_TYPE.MONTHLY ? `Monthly subscription for ${performer.username}` : `Yearly subscription for ${performer.username}`;
    const description = name;
    await this.orderDetailModel.create({
      orderId: order._id,
      orderNumber: `${order.orderNumber}-S1`,
      buyerId: user._id,
      buyerSource: 'user',
      sellerId: toObjectId(performerId),
      sellerSource: 'performer',
      name,
      description,
      unitPrice: price,
      originalPrice: price,
      totalPrice: price,
      productType: type === SUBSCRIPTION_TYPE.MONTHLY ? PAYMENT_TYPE.MONTHLY_SUBSCRIPTION : PAYMENT_TYPE.YEARLY_SUBSCRIPTION,
      productId: performer._id,
      quantity: 1,
      paymentGateway,
      payBy: 'money', // default!!
      deliveryStatus: DELIVERY_STATUS.CREATED,
      couponInfo: null
    });

    return order;
  }

  public async createForPerformerSubscriptionRenewal({
    userId, performerId, type, price, paymentGateway = 'ccbill'
  }, buyerSource = 'user', orderStatus = ORDER_STATUS.CREATED) {
    const performer = await this.performerService.findById(performerId);
    if (!performer) {
      throw new EntityNotFoundException();
    }
    const user = await this.userService.findById(userId);
    const order = await this.orderModel.create({
      buyerId: userId,
      buyerSource,
      sellerId: performerId,
      sellerSource: 'performer',
      type: type === SUBSCRIPTION_TYPE.MONTHLY ? PAYMENT_TYPE.MONTHLY_SUBSCRIPTION : PAYMENT_TYPE.YEARLY_SUBSCRIPTION,
      orderNumber: this.generateOrderNumber(),
      postalCode: '',
      quantity: 1,
      totalPrice: price,
      couponInfo: null,
      status: orderStatus,
      deliveryAddress: null,
      paymentGateway,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const name = `Renewal subscription for ${performer.username}`;
    const description = name;
    await this.orderDetailModel.create({
      orderId: order._id,
      orderNumber: `${order.orderNumber}-S1`,
      buyerId: user._id,
      buyerSource: 'user',
      sellerId: performerId,
      sellerSource: 'performer',
      name,
      description,
      unitPrice: price,
      originalPrice: price,
      totalPrice: price,
      productType: type === SUBSCRIPTION_TYPE.MONTHLY ? PAYMENT_TYPE.MONTHLY_SUBSCRIPTION : PAYMENT_TYPE.YEARLY_SUBSCRIPTION,
      productId: performer._id,
      quantity: 1,
      paymentGateway,
      payBy: 'money', // default!!
      deliveryStatus: DELIVERY_STATUS.CREATED,
      couponInfo: null
    });

    return order;
  }
}
