import { ObjectId } from 'mongodb';
import { pick } from 'lodash';
import { FileDto } from 'src/modules/file';

export interface IUserResponse {
  _id?: ObjectId;
  name?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  roles?: string[];
  avatar?: string;
  status?: string;
  gender?: string;
  country?: string;
  verifiedEmail?: boolean;
  isOnline?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserDto {
  _id: ObjectId;

  name?: string;

  firstName?: string;

  lastName?: string;

  email?: string;

  phone?: string;

  roles: string[] = ['user'];

  avatarId?: string | ObjectId;

  avatarPath?: string;

  avatar?: string;

  status?: string;

  username?: string;

  gender?: string;

  country?: string; // iso code

  verifiedEmail?: boolean;

  isOnline?: boolean;

  createdAt?: Date;

  updatedAt?: Date;

  constructor(data?: Partial<UserDto>) {
    data
      && Object.assign(
        this,
        pick(data, [
          '_id',
          'name',
          'firstName',
          'lastName',
          'email',
          'phone',
          'roles',
          'avatarId',
          'avatarPath',
          'avatar',
          'status',
          'username',
          'gender',
          'country',
          'verifiedEmail',
          'isOnline',
          'createdAt',
          'updatedAt'
        ])
      );
  }

  getName() {
    if (this.name) return this.name;
    return [this.firstName || '', this.lastName || ''].join(' ');
  }

  toResponse(includePrivateInfo = false, isAdmin?: boolean): IUserResponse {
    const publicInfo = {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      name: this.getName(),
      avatar: FileDto.getPublicUrl(this.avatarPath),
      username: this.username,
      isOnline: this.isOnline,
      gender: this.gender,
      country: this.country,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    const privateInfo = {
      email: this.email,
      phone: this.phone,
      status: this.status,
      roles: this.roles,
      verifiedEmail: this.verifiedEmail
    };

    if (isAdmin) {
      return {
        ...publicInfo,
        ...privateInfo
      };
    }

    if (!includePrivateInfo) {
      return publicInfo;
    }

    return {
      ...publicInfo,
      ...privateInfo
    };
  }
}
