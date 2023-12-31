import { ObjectId } from 'mongodb';
import { pick } from 'lodash';

export class ReactionDto {
  source?: string;

  action?: string;

  objectId?: ObjectId;

  objectType?: string;

  createdBy?: string | ObjectId;

  createdAt?: Date;

  updatedAt?: Date;

  creator?: any;

  objectInfo?: any;

  isSubscribed?: boolean;

  isBought?: boolean;

  constructor(data?: Partial<ReactionDto>) {
    Object.assign(
      this,
      pick(data, [
        'source',
        'action',
        'objectId',
        'objectType',
        'createdBy',
        'creator',
        'createdAt',
        'updatedAt',
        'objectInfo',
        'isSubscribed',
        'isBought'
      ])
    );
  }
}
