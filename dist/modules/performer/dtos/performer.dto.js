"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerDto = void 0;
const lodash_1 = require("lodash");
const file_1 = require("../../file");
const dtos_1 = require("../../user/dtos");
class PerformerDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'name',
            'firstName',
            'lastName',
            'name',
            'username',
            'email',
            'phone',
            'phoneCode',
            'status',
            'avatarId',
            'avatarPath',
            'coverId',
            'coverPath',
            'idVerificationId',
            'documentVerificationId',
            'idVerification',
            'documentVerification',
            'gender',
            'country',
            'city',
            'state',
            'zipcode',
            'address',
            'languages',
            'categoryIds',
            'height',
            'weight',
            'bio',
            'eyes',
            'sexualPreference',
            'monthlyPrice',
            'yearlyPrice',
            'stats',
            'score',
            'isPerformer',
            'bankingInformation',
            'ccbillSetting',
            'paypalSetting',
            'commissionSetting',
            'blockCountries',
            'createdBy',
            'createdAt',
            'updatedAt',
            'verifiedEmail',
            'verifiedAccount',
            'verifiedDocument',
            'isOnline',
            'welcomeVideoId',
            'welcomeVideoPath',
            'activateWelcomeVideo',
            'isSubscribed',
            'pubicHair',
            'bodyType',
            'ethnicity',
            'dateOfBirth',
            'butt',
            'hair'
        ]));
    }
    toResponse(includePrivateInfo = false, isAdmin) {
        const publicInfo = {
            _id: this._id,
            name: this.getName(),
            avatar: file_1.FileDto.getPublicUrl(this.avatarPath),
            cover: file_1.FileDto.getPublicUrl(this.coverPath),
            username: this.username,
            gender: this.gender,
            country: this.country,
            stats: this.stats,
            score: this.score,
            isPerformer: true,
            isOnline: this.isOnline,
            isSubscribed: this.isSubscribed,
            verifiedAccount: this.verifiedAccount
        };
        const privateInfo = {
            verifiedEmail: this.verifiedEmail,
            verifiedDocument: this.verifiedDocument,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            phone: this.phone,
            phoneCode: this.phoneCode,
            status: this.status,
            city: this.city,
            state: this.state,
            zipcode: this.zipcode,
            address: this.address,
            languages: this.languages,
            categoryIds: this.categoryIds,
            idVerificationId: this.idVerificationId,
            documentVerificationId: this.documentVerificationId,
            documentVerification: this.documentVerification,
            idVerification: this.idVerification,
            welcomeVideoId: this.welcomeVideoId,
            welcomeVideoPath: file_1.FileDto.getPublicUrl(this.welcomeVideoPath),
            activateWelcomeVideo: this.activateWelcomeVideo,
            height: this.height,
            weight: this.weight,
            bio: this.bio,
            eyes: this.eyes,
            hair: this.hair,
            pubicHair: this.pubicHair,
            ethnicity: this.ethnicity,
            bodyType: this.bodyType,
            dateOfBirth: this.dateOfBirth,
            butt: this.butt,
            sexualPreference: this.sexualPreference,
            monthlyPrice: this.monthlyPrice,
            yearlyPrice: this.yearlyPrice,
            bankingInformation: this.bankingInformation,
            blockCountries: this.blockCountries,
            paypalSetting: this.paypalSetting,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
        if (isAdmin) {
            return Object.assign(Object.assign(Object.assign({}, publicInfo), privateInfo), { ccbillSetting: this.ccbillSetting, commissionSetting: this.commissionSetting });
        }
        if (!includePrivateInfo) {
            return publicInfo;
        }
        return Object.assign(Object.assign({}, publicInfo), privateInfo);
    }
    getName() {
        if (this.name)
            return this.name;
        return [this.firstName || '', this.lastName || ''].join(' ');
    }
    toSearchResponse() {
        return {
            _id: this._id,
            name: this.getName(),
            avatar: file_1.FileDto.getPublicUrl(this.avatarPath),
            username: this.username,
            gender: this.gender,
            country: this.country,
            stats: this.stats,
            score: this.score,
            isPerformer: true,
            verifiedAccount: this.verifiedAccount,
            isOnline: this.isOnline
        };
    }
    toPublicDetailsResponse() {
        return {
            _id: this._id,
            name: this.getName(),
            avatar: file_1.FileDto.getPublicUrl(this.avatarPath),
            cover: file_1.FileDto.getPublicUrl(this.coverPath),
            username: this.username,
            status: this.status,
            gender: this.gender,
            country: this.country,
            city: this.city,
            state: this.state,
            zipcode: this.zipcode,
            address: this.address,
            languages: this.languages,
            categoryIds: this.categoryIds,
            height: this.height,
            weight: this.weight,
            bio: this.bio,
            eyes: this.eyes,
            hair: this.hair,
            pubicHair: this.pubicHair,
            ethnicity: this.ethnicity,
            bodyType: this.bodyType,
            dateOfBirth: this.dateOfBirth,
            butt: this.butt,
            sexualPreference: this.sexualPreference,
            monthlyPrice: this.monthlyPrice,
            yearlyPrice: this.yearlyPrice,
            stats: this.stats,
            isPerformer: true,
            score: this.score,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            isOnline: this.isOnline,
            welcomeVideoId: this.welcomeVideoId,
            welcomeVideoPath: file_1.FileDto.getPublicUrl(this.welcomeVideoPath),
            activateWelcomeVideo: this.activateWelcomeVideo,
            isSubscribed: this.isSubscribed,
            verifiedAccount: this.verifiedAccount
        };
    }
}
exports.PerformerDto = PerformerDto;
//# sourceMappingURL=performer.dto.js.map