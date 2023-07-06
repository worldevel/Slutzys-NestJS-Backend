import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import { PageableData } from 'src/kernel/common';
import * as moment from 'moment';
import { PerformerBlockService } from 'src/modules/block/services';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerModel } from '../models';
import { PERFORMER_MODEL_PROVIDER } from '../providers';
import { IPerformerResponse, PerformerDto } from '../dtos';
import { PerformerSearchPayload } from '../payloads';
import { PERFORMER_STATUSES } from '../constants';

@Injectable()
export class PerformerSearchService {
  constructor(
    @Inject(forwardRef(() => PerformerBlockService))
    private readonly performerBlockService: PerformerBlockService,
    @Inject(PERFORMER_MODEL_PROVIDER)
    private readonly performerModel: Model<PerformerModel>
  ) { }

  // TODO - should create new search service?
  public async adminSearch(
    req: PerformerSearchPayload
  ): Promise<PageableData<PerformerDto>> {
    const query = {} as any;
    if (req.q) {
      const regexp = new RegExp(
        req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
        'i'
      );
      query.$or = [
        {
          firstName: { $regex: regexp }
        },
        {
          lastName: { $regex: regexp }
        },
        {
          name: { $regex: regexp }
        },
        {
          email: { $regex: regexp }
        },
        {
          username: { $regex: regexp }
        }
      ];
    }
    if (req.performerIds) {
      query._id = Array.isArray(req.performerIds) ? { $in: req.performerIds } : { $in: [req.performerIds] };
    }
    if (req.status) {
      query.status = req.status;
    }
    if (req.gender) {
      query.gender = req.gender;
    }
    let sort = {
      createdAt: -1
    } as any;
    if (req.sort && req.sortBy) {
      sort = {
        [req.sortBy]: req.sort
      };
    }
    const [data, total] = await Promise.all([
      this.performerModel
        .find(query)
        .sort(sort)
        .limit(req.limit ? parseInt(req.limit as string, 10) : 10)
        .skip(parseInt(req.offset as string, 10)),
      this.performerModel.countDocuments(query)
    ]);
    return {
      data: data.map((item) => new PerformerDto(item)),
      total
    };
  }

  public async search(
    req: PerformerSearchPayload, user: UserDto, countryCode: string
  ): Promise<PageableData<IPerformerResponse>> {
    const query = {
      status: PERFORMER_STATUSES.ACTIVE
    } as any;
    if (req.q) {
      const regexp = new RegExp(
        req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
        'i'
      );
      query.$or = [
        {
          name: { $regex: regexp }
        },
        {
          username: { $regex: regexp }
        }
      ];
    }
    [
      'hair',
      'pubicHair',
      'ethnicity',
      'country',
      'bodyType',
      'gender',
      'height',
      'weight',
      'eyes',
      'butt',
      'agentId',
      'sexualPreference'
    ].forEach((f) => {
      if (req[f]) {
        query[f] = req[f];
      }
    });
    if (user) {
      query._id = { $ne: user._id };
    }
    if (req.performerIds) {
      query._id = Array.isArray(req.performerIds) ? { $in: req.performerIds } : { $in: [req.performerIds] };
    }
    if (req.age) {
      const fromAge = req.age.split('_')[0];
      const toAge = req.age.split('_')[1];
      const fromDate = moment().subtract(toAge, 'years').startOf('day').toDate();
      const toDate = moment().subtract(fromAge, 'years').startOf('day').toDate();
      query.dateOfBirth = {
        $gte: fromDate,
        $lte: toDate
      };
    }
    if (req.gender) {
      query.gender = req.gender;
    }
    if (countryCode) {
      const blockCountries = await this.performerBlockService.findBlockCountriesByQuery({ countryCodes: { $in: [countryCode] } });
      const performerIds = blockCountries.map((b) => b.sourceId);
      if (performerIds.length > 0) {
        query._id = { $nin: performerIds };
      }
    }
    let sort = {
      createdAt: -1
    } as any;
    if (req.sortBy === 'latest') {
      sort = '-createdAt';
    }
    if (req.sortBy === 'oldest') {
      sort = 'createdAt';
    }
    if (req.sortBy === 'popular') {
      sort = '-score';
    }
    if (req.sortBy === 'subscriber') {
      sort = '-stats.subscribers';
    }
    const [data, total] = await Promise.all([
      this.performerModel
        .find(query)
        .sort(sort)
        .limit(req.limit ? parseInt(req.limit as string, 10) : 10)
        .skip(parseInt(req.offset as string, 10)),
      this.performerModel.countDocuments(query)
    ]);

    return {
      data: data.map((item) => new PerformerDto(item).toResponse()),
      total
    };
  }

  public async searchByKeyword(
    req: PerformerSearchPayload
  ): Promise<any> {
    const query = {} as any;
    if (req.q) {
      const regexp = new RegExp(
        req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
        'i'
      );
      query.$or = [
        {
          name: { $regex: regexp }
        },
        {
          email: { $regex: regexp }
        },
        {
          username: { $regex: regexp }
        }
      ];
    }

    const [data] = await Promise.all([
      this.performerModel
        .find(query)
    ]);
    return data;
  }
}
