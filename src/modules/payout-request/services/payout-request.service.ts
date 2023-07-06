import {
  Injectable, Inject, ForbiddenException, forwardRef, HttpException
} from '@nestjs/common';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PerformerDto } from 'src/modules/performer/dtos';
import { PerformerService } from 'src/modules/performer/services';
import { MailerService } from 'src/modules/mailer';
import { SettingService } from 'src/modules/settings';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import {
  EntityNotFoundException,
  QueueEventService,
  QueueEvent
} from 'src/kernel';
import { merge, uniq } from 'lodash';
import { toObjectId } from 'src/kernel/helpers/string.helper';
import * as moment from 'moment';
import { EARNING_MODEL_PROVIDER } from 'src/modules/earning/providers/earning.provider';
import { EarningModel } from 'src/modules/earning/models/earning.model';
import { UserDto } from 'src/modules/user/dtos';
import { EVENT } from 'src/kernel/constants';
import {
  PAYMENT_ACCOUNT_TYPE,
  PAYOUT_REQUEST_CHANEL, SOURCE_TYPE, STATUSES
} from '../constants';
import { DuplicateRequestException } from '../exceptions';
import { PayoutRequestDto } from '../dtos/payout-request.dto';
import {
  PayoutRequestCreatePayload,
  PayoutRequestSearchPayload,
  PayoutRequestUpdatePayload,
  PayoutRequestPerformerUpdatePayload
} from '../payloads/payout-request.payload';
import { PayoutRequestModel } from '../models/payout-request.model';
import { PAYOUT_REQUEST_MODEL_PROVIDER } from '../providers/payout-request.provider';

@Injectable()
export class PayoutRequestService {
  constructor(
    @Inject(EARNING_MODEL_PROVIDER)
    private readonly earningModel: Model<EarningModel>,
    @Inject(PAYOUT_REQUEST_MODEL_PROVIDER)
    private readonly payoutRequestModel: Model<PayoutRequestModel>,
    @Inject(forwardRef(() => QueueEventService))
    private readonly queueEventService: QueueEventService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => MailerService))
    private readonly mailService: MailerService,
    @Inject(forwardRef(() => SettingService))
    private readonly settingService: SettingService
  ) { }

  public async search(
    req: PayoutRequestSearchPayload,
    user?: UserDto
  ): Promise<any> {
    const query = {} as any;
    if (req.sourceId) {
      query.sourceId = toObjectId(req.sourceId);
    }

    if (req.source) {
      query.source = req.source;
    }

    if (req.status) {
      query.status = req.status;
    }

    let sort = {
      updatedAt: -1
    } as any;

    if (req.sort && req.sortBy) {
      sort = {
        [req.sortBy]: req.sort
      };
    }

    if (req.fromDate && req.toDate) {
      query.createdAt = {
        $gte: moment(req.fromDate).startOf('day').toDate(),
        $lte: moment(req.toDate).endOf('day').toDate()
      };
    }

    const [data, total] = await Promise.all([
      this.payoutRequestModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(parseInt(req.limit as string, 10))
        .skip(parseInt(req.offset as string, 10)),
      this.payoutRequestModel.countDocuments(query)
    ]);
    const requests = data.map((d) => new PayoutRequestDto(d));
    if (user?.roles?.includes('admin')) {
      const sourceIds = uniq(requests.map((r) => r.sourceId));
      const sources = await this.performerService.findByIds(sourceIds);
      requests.forEach((request: PayoutRequestDto) => {
        const sourceInfo = sources.find((s) => s && s._id.toString() === request.sourceId.toString());
        request.sourceInfo = sourceInfo && new PerformerDto(sourceInfo).toResponse();
      });
    }
    return {
      total,
      data: requests
    };
  }

  public async findById(id: string | object): Promise<any> {
    const request = await this.payoutRequestModel.findById(id);
    return request;
  }

  public async performerCreate(
    payload: PayoutRequestCreatePayload,
    user: UserDto
  ): Promise<PayoutRequestDto> {
    const data = {
      ...payload,
      fromDate: moment(payload.fromDate).startOf('day').toDate(),
      toDate: moment(payload.toDate).endOf('day').toDate(),
      sourceId: user._id,
      updatedAt: new Date(),
      createdAt: new Date()
    } as PayoutRequestModel;
    const query = {
      sourceId: user._id,
      fromDate: moment(payload.fromDate).startOf('day').toDate(),
      toDate: moment(payload.toDate).endOf('day').toDate(),
      status: STATUSES.PENDING,
      createdAt: { $gte: moment().subtract(1, 'day').toDate() }
    };
    const request = await this.payoutRequestModel.findOne(query);
    if (request) {
      throw new DuplicateRequestException();
    }
    const { unpaidPrice } = await this.calculateByDate(user, {
      fromDate: payload.fromDate,
      toDate: payload.toDate
    } as any);
    data.requestedPrice = unpaidPrice;
    if (data.paymentAccountType === PAYMENT_ACCOUNT_TYPE.BANKING) {
      data.paymentAccountInfo = await this.performerService.getBankingSettings(user._id);
      if (!data.paymentAccountInfo || !data.paymentAccountInfo.firstName || !data.paymentAccountInfo.lastName || !data.paymentAccountInfo.bankAccount) {
        throw new HttpException('Missing banking informations', 404);
      }
    }
    if (data.paymentAccountType === PAYMENT_ACCOUNT_TYPE.PAYPAL) {
      const paymentAccountInfo = await this.performerService.getPaymentSetting(user._id, 'paypal');
      if (!paymentAccountInfo || !paymentAccountInfo.value || !paymentAccountInfo.value.email) {
        throw new HttpException('Missing paypal account information', 404);
      }
      data.paymentAccountInfo = paymentAccountInfo?.value || null;
    }
    const resp = await this.payoutRequestModel.create(data);
    const adminEmail = (await this.settingService.getKeyValue(SETTING_KEYS.ADMIN_EMAIL)) || process.env.ADMIN_EMAIL;
    adminEmail && await this.mailService.send({
      subject: 'New payout request',
      to: adminEmail,
      data: {
        request: resp,
        requestName: user?.name || user?.username || 'N/A'
      },
      template: 'admin-payout-request'
    });
    return new PayoutRequestDto(resp);
  }

  public async calculateByDate(
    user: UserDto,
    req: any
  ): Promise<any> {
    const [unpaidPrice] = await Promise.all([
      this.earningModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: moment(req.fromDate).startOf('day').toDate(),
              $lte: moment(req.toDate).endOf('day').toDate()
            },
            isPaid: false,
            performerId: toObjectId(user._id)
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$netPrice'
            }
          }
        }
      ])
    ]);

    return {
      unpaidPrice: (unpaidPrice[0] && unpaidPrice[0]?.total) || 0
    };
  }

  public async calculateStats(
    user: UserDto,
    req: PayoutRequestSearchPayload
  ): Promise<any> {
    let performerId = user._id;
    if (user.roles && user.roles.includes('admin') && req.sourceId) {
      performerId = req.sourceId;
    }
    const [unpaidPrice, totalPrice] = await Promise.all([
      this.earningModel.aggregate([
        {
          $match: {
            isPaid: false,
            performerId: toObjectId(performerId)
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$netPrice'
            }
          }
        }
      ]),
      this.earningModel.aggregate([
        {
          $match: {
            performerId: toObjectId(performerId)
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$netPrice'
            }
          }
        }
      ])
    ]);

    return {
      unpaidPrice: unpaidPrice[0]?.total || 0,
      paidPrice: (totalPrice[0]?.total - unpaidPrice[0]?.total) || 0,
      totalPrice: totalPrice[0]?.total || 0
    };
  }

  public async performerUpdate(
    id: string,
    payload: PayoutRequestPerformerUpdatePayload,
    user: UserDto
  ): Promise<PayoutRequestDto> {
    const payout = await this.payoutRequestModel.findOne({ _id: id });
    if (!payout) {
      throw new EntityNotFoundException();
    }
    if (user._id.toString() !== payout.sourceId.toString() || payout.status !== STATUSES.PENDING) {
      throw new ForbiddenException();
    }
    const data = { ...payload } as any;
    const { unpaidPrice } = await this.calculateByDate(user, {
      fromDate: payload.fromDate,
      toDate: payload.toDate
    } as any);
    data.fromDate = moment(payload.fromDate).startOf('day').toDate();
    data.toDate = moment(payload.toDate).endOf('day').toDate();
    data.requestedPrice = unpaidPrice;
    if (data.paymentAccountType === PAYMENT_ACCOUNT_TYPE.BANKING) {
      data.paymentAccountInfo = await this.performerService.getBankingSettings(payout.sourceId);
      if (!data.paymentAccountInfo || !data.paymentAccountInfo.firstName || !data.paymentAccountInfo.lastName || !data.paymentAccountInfo.bankAccount) {
        throw new HttpException('Missing banking informations', 404);
      }
    }
    if (data.paymentAccountType === PAYMENT_ACCOUNT_TYPE.PAYPAL) {
      const paymentAccountInfo = await this.performerService.getPaymentSetting(payout.sourceId, 'paypal');
      if (!paymentAccountInfo || !paymentAccountInfo.value || !paymentAccountInfo.value.email) {
        throw new HttpException('Missing paypal account information', 404);
      }
      data.paymentAccountInfo = paymentAccountInfo?.value || null;
    }
    merge(payout, data);
    await payout.save();
    return new PayoutRequestDto(payout);
  }

  public async details(id: string, user: UserDto) {
    const payout = await this.payoutRequestModel.findById(id);
    if (!payout) {
      throw new EntityNotFoundException();
    }

    if (user._id.toString() !== payout.sourceId.toString()) {
      throw new ForbiddenException();
    }

    const data = new PayoutRequestDto(payout);
    data.sourceInfo = new PerformerDto(user).toSearchResponse() || null;
    return data;
  }

  public async adminDetails(id: string) {
    const payout = await this.payoutRequestModel.findById(id);
    if (!payout) {
      throw new EntityNotFoundException();
    }
    const data = new PayoutRequestDto(payout);
    const { sourceId, source } = data;
    if (source === SOURCE_TYPE.PERFORMER) {
      const sourceInfo = await this.performerService.findById(sourceId);
      if (sourceInfo) {
        data.sourceInfo = new PerformerDto(sourceInfo).toResponse();
      }
    }
    return data;
  }

  public async adminDelete(id: string) {
    const payout = await this.payoutRequestModel.findById(id);
    if (!payout) {
      throw new EntityNotFoundException();
    }
    if ([STATUSES.DONE, STATUSES.REJECTED].includes(payout.status)) {
      throw new ForbiddenException();
    }
    await payout.remove();
    return { deleted: true };
  }

  public async adminUpdateStatus(
    id: string | ObjectId,
    payload: PayoutRequestUpdatePayload
  ): Promise<any> {
    const request = await this.payoutRequestModel.findById(id);
    if (!request) {
      throw new EntityNotFoundException();
    }

    const oldStatus = request.status;
    merge(request, payload);
    request.updatedAt = new Date();
    await request.save();

    const event: QueueEvent = {
      channel: PAYOUT_REQUEST_CHANEL,
      eventName: EVENT.UPDATED,
      data: {
        request,
        oldStatus
      }
    };
    await this.queueEventService.publish(event);
    return request;
  }
}
