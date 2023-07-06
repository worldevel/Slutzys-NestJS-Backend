"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../file/services");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const subscription_service_1 = require("../../subscription/services/subscription.service");
const file_1 = require("../../file");
const dtos_1 = require("../../user/dtos");
const services_2 = require("../../auth/services");
const constants_2 = require("../../../kernel/constants");
const constants_3 = require("../../file/constants");
const exceptions_1 = require("../../user/exceptions");
const mailer_1 = require("../../mailer");
const services_3 = require("../../user/services");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const services_4 = require("../../block/services");
const constants_4 = require("../constants");
const dtos_2 = require("../dtos");
const exceptions_2 = require("../exceptions");
const providers_1 = require("../providers");
let PerformerService = class PerformerService {
    constructor(performerBlockService, authService, userService, fileService, subscriptionService, performerModel, queueEventService, mailService, paymentGatewaySettingModel, bankingSettingModel, commissionSettingModel) {
        this.performerBlockService = performerBlockService;
        this.authService = authService;
        this.userService = userService;
        this.fileService = fileService;
        this.subscriptionService = subscriptionService;
        this.performerModel = performerModel;
        this.queueEventService = queueEventService;
        this.mailService = mailService;
        this.paymentGatewaySettingModel = paymentGatewaySettingModel;
        this.bankingSettingModel = bankingSettingModel;
        this.commissionSettingModel = commissionSettingModel;
    }
    async findById(id) {
        const model = await this.performerModel.findById(id);
        if (!model)
            return null;
        return model;
    }
    async findOne(query) {
        const data = await this.performerModel.findOne(query).lean();
        return data;
    }
    async getBankingSettings(performerId) {
        return this.bankingSettingModel.findOne({
            performerId
        });
    }
    async checkExistedEmailorUsername(payload) {
        const data = payload.username ? await this.performerModel.countDocuments({ username: payload.username.trim().toLowerCase() })
            : await this.performerModel.countDocuments({ email: payload.email.toLowerCase() });
        return data;
    }
    async findByUsername(username, countryCode, currentUser) {
        const query = string_helper_1.isObjectId(username) ? { _id: username } : { username: username.trim() };
        const model = await this.performerModel.findOne(query);
        if (!model)
            throw new kernel_1.EntityNotFoundException();
        const dto = new dtos_2.PerformerDto(model);
        if (countryCode && `${currentUser === null || currentUser === void 0 ? void 0 : currentUser._id}` !== `${model._id}`) {
            const isBlockedCountry = await this.performerBlockService.checkBlockedCountryByIp(model._id, countryCode);
            if (isBlockedCountry)
                throw new common_1.HttpException('Your country has been blocked by this model', 403);
        }
        if (currentUser && `${currentUser._id}` !== `${model._id}`) {
            const isBlocked = await this.performerBlockService.checkBlockedByPerformer(model._id, currentUser._id);
            if (isBlocked)
                throw new common_1.HttpException('You have been blocked by this model', 403);
        }
        if (currentUser === null || currentUser === void 0 ? void 0 : currentUser._id) {
            const checkSubscribe = await this.subscriptionService.checkSubscribed(model._id, currentUser._id);
            dto.isSubscribed = !!checkSubscribe;
        }
        if (model.avatarId) {
            const avatar = await this.fileService.findById(model.avatarId);
            dto.avatarPath = avatar ? avatar.path : null;
        }
        if (model.welcomeVideoId) {
            const welcomeVideo = await this.fileService.findById(model.welcomeVideoId);
            dto.welcomeVideoPath = welcomeVideo ? welcomeVideo.getUrl() : null;
        }
        await this.viewProfile(model._id);
        return dto;
    }
    async findByEmail(email) {
        if (!email) {
            return null;
        }
        const model = await this.performerModel.findOne({
            email: email.toLowerCase()
        });
        if (!model)
            return null;
        return new dtos_2.PerformerDto(model);
    }
    async findByIds(ids) {
        return this.performerModel
            .find({
            _id: {
                $in: ids
            }
        });
    }
    async getDetails(id, jwtToken) {
        const performer = await this.performerModel.findById(id);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        const [avatar, documentVerification, idVerification, cover, welcomeVideo] = await Promise.all([
            performer.avatarId ? this.fileService.findById(performer.avatarId) : null,
            performer.documentVerificationId
                ? this.fileService.findById(performer.documentVerificationId)
                : null,
            performer.idVerificationId
                ? this.fileService.findById(performer.idVerificationId)
                : null,
            performer.coverId ? this.fileService.findById(performer.coverId) : null,
            performer.welcomeVideoId
                ? this.fileService.findById(performer.welcomeVideoId)
                : null
        ]);
        const dto = new dtos_2.PerformerDto(performer);
        dto.avatar = avatar ? file_1.FileDto.getPublicUrl(avatar.path) : null;
        dto.cover = cover ? file_1.FileDto.getPublicUrl(cover.path) : null;
        dto.welcomeVideoPath = welcomeVideo && welcomeVideo.getUrl();
        dto.idVerification = idVerification
            ? {
                _id: idVerification._id,
                url: jwtToken ? `${file_1.FileDto.getPublicUrl(idVerification.path)}?documentId=${idVerification._id}&token=${jwtToken}` : file_1.FileDto.getPublicUrl(idVerification.path),
                mimeType: idVerification.mimeType
            }
            : null;
        dto.documentVerification = documentVerification
            ? {
                _id: documentVerification._id,
                url: jwtToken ? `${file_1.FileDto.getPublicUrl(documentVerification.path)}?documentId=${documentVerification._id}&token=${jwtToken}` : file_1.FileDto.getPublicUrl(documentVerification.path),
                mimeType: documentVerification.mimeType
            }
            : null;
        dto.ccbillSetting = await this.paymentGatewaySettingModel.findOne({
            performerId: id,
            key: 'ccbill'
        });
        dto.paypalSetting = await this.paymentGatewaySettingModel.findOne({
            performerId: id,
            key: 'paypal'
        });
        dto.commissionSetting = await this.commissionSettingModel.findOne({
            performerId: id
        });
        dto.bankingInformation = await this.bankingSettingModel.findOne({
            performerId: id
        });
        dto.blockCountries = await this.performerBlockService.findOneBlockCountriesByQuery({
            sourceId: id
        });
        return dto;
    }
    async userGetDetails(id, jwtToken) {
        const performer = await this.performerModel.findById(id);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        const [avatar, documentVerification, idVerification, cover, welcomeVideo] = await Promise.all([
            performer.avatarId ? this.fileService.findById(performer.avatarId) : null,
            performer.documentVerificationId
                ? this.fileService.findById(performer.documentVerificationId)
                : null,
            performer.idVerificationId
                ? this.fileService.findById(performer.idVerificationId)
                : null,
            performer.coverId ? this.fileService.findById(performer.coverId) : null,
            performer.welcomeVideoId
                ? this.fileService.findById(performer.welcomeVideoId)
                : null
        ]);
        const dto = new dtos_2.PerformerDto(performer);
        dto.avatar = avatar ? file_1.FileDto.getPublicUrl(avatar.path) : null;
        dto.cover = cover ? file_1.FileDto.getPublicUrl(cover.path) : null;
        dto.welcomeVideoPath = welcomeVideo && welcomeVideo.getUrl();
        dto.idVerification = idVerification
            ? {
                _id: idVerification._id,
                url: jwtToken ? `${file_1.FileDto.getPublicUrl(idVerification.path)}?documentId=${idVerification._id}&token=${jwtToken}` : file_1.FileDto.getPublicUrl(idVerification.path),
                mimeType: idVerification.mimeType
            }
            : null;
        dto.documentVerification = documentVerification
            ? {
                _id: documentVerification._id,
                url: jwtToken ? `${file_1.FileDto.getPublicUrl(documentVerification.path)}?documentId=${documentVerification._id}&token=${jwtToken}` : file_1.FileDto.getPublicUrl(documentVerification.path),
                mimeType: documentVerification.mimeType
            }
            : null;
        dto.paypalSetting = await this.paymentGatewaySettingModel.findOne({
            performerId: id,
            key: 'paypal'
        });
        dto.bankingInformation = await this.bankingSettingModel.findOne({
            performerId: id
        });
        dto.blockCountries = await this.performerBlockService.findOneBlockCountriesByQuery({
            sourceId: id
        });
        return dto;
    }
    async delete(id) {
        if (!kernel_1.StringHelper.isObjectId(id))
            throw new kernel_1.ForbiddenException();
        const performer = await this.performerModel.findById(id);
        if (!performer)
            throw new kernel_1.EntityNotFoundException();
        await this.performerModel.deleteOne({ _id: id });
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_4.DELETE_PERFORMER_CHANNEL,
            eventName: constants_2.EVENT.DELETED,
            data: new dtos_2.PerformerDto(performer).toResponse()
        }));
        return { deleted: true };
    }
    async create(payload, user) {
        const data = Object.assign(Object.assign({}, payload), { updatedAt: new Date(), createdAt: new Date() });
        const countPerformerUsername = await this.performerModel.countDocuments({
            username: payload.username.trim().toLowerCase()
        });
        const countUserUsername = await this.userService.checkExistedEmailorUsername({ username: payload.username });
        if (countPerformerUsername || countUserUsername) {
            throw new exceptions_2.UsernameExistedException();
        }
        const countPerformerEmail = await this.performerModel.countDocuments({
            email: payload.email.toLowerCase()
        });
        const countUserEmail = await this.userService.checkExistedEmailorUsername({ email: payload.email });
        if (countPerformerEmail || countUserEmail) {
            throw new exceptions_2.EmailExistedException();
        }
        if (payload.avatarId) {
            const avatar = await this.fileService.findById(payload.avatarId);
            if (!avatar) {
                throw new kernel_1.EntityNotFoundException('Avatar not found!');
            }
            data.avatarPath = avatar.path;
        }
        if (payload.coverId) {
            const cover = await this.fileService.findById(payload.coverId);
            if (!cover) {
                throw new kernel_1.EntityNotFoundException('Cover not found!');
            }
            data.coverPath = cover.path;
        }
        if (user) {
            data.createdBy = user._id;
        }
        data.username = data.username.trim().toLowerCase();
        data.email = data.email.toLowerCase();
        if (data.dateOfBirth) {
            data.dateOfBirth = new Date(data.dateOfBirth);
        }
        if (!data.name) {
            data.name = data.firstName && data.lastName ? [data.firstName, data.lastName].join(' ') : 'No_display_name';
        }
        const performer = await this.performerModel.create(data);
        await Promise.all([
            payload.idVerificationId
                && this.fileService.addRef(payload.idVerificationId, {
                    itemId: performer._id,
                    itemType: constants_3.REF_TYPE.PERFORMER
                }),
            payload.documentVerificationId
                && this.fileService.addRef(payload.documentVerificationId, {
                    itemId: performer._id,
                    itemType: constants_3.REF_TYPE.PERFORMER
                }),
            payload.avatarId
                && this.fileService.addRef(payload.avatarId, {
                    itemId: performer._id,
                    itemType: constants_3.REF_TYPE.PERFORMER
                })
        ]);
        return new dtos_2.PerformerDto(performer);
    }
    async register(payload) {
        const data = Object.assign(Object.assign({}, payload), { updatedAt: new Date(), createdAt: new Date() });
        const countPerformerUsername = await this.performerModel.countDocuments({
            username: payload.username.trim().toLowerCase()
        });
        const countUserUsername = await this.userService.checkExistedEmailorUsername({ username: payload.username });
        if (countPerformerUsername || countUserUsername) {
            throw new exceptions_2.UsernameExistedException();
        }
        const countPerformerEmail = await this.performerModel.countDocuments({
            email: payload.email.toLowerCase()
        });
        const countUserEmail = await this.userService.checkExistedEmailorUsername({ email: payload.email });
        if (countPerformerEmail || countUserEmail) {
            throw new exceptions_2.EmailExistedException();
        }
        if (payload.avatarId) {
            const avatar = await this.fileService.findById(payload.avatarId);
            if (!avatar) {
                throw new kernel_1.EntityNotFoundException('Avatar not found!');
            }
            data.avatarPath = avatar.path;
        }
        data.username = data.username.trim().toLowerCase();
        data.email = data.email.toLowerCase();
        if (!data.name) {
            data.name = data.firstName && data.lastName ? [data.firstName, data.lastName].join(' ') : 'No_display_name';
        }
        if (data.dateOfBirth) {
            data.dateOfBirth = new Date(data.dateOfBirth);
        }
        const performer = await this.performerModel.create(data);
        await Promise.all([
            payload.idVerificationId
                && this.fileService.addRef(payload.idVerificationId, {
                    itemId: performer._id,
                    itemType: constants_3.REF_TYPE.PERFORMER
                }),
            payload.documentVerificationId
                && this.fileService.addRef(payload.documentVerificationId, {
                    itemId: performer._id,
                    itemType: constants_3.REF_TYPE.PERFORMER
                }),
            payload.avatarId && this.fileService.addRef(payload.avatarId, {
                itemId: performer._id,
                itemType: constants_3.REF_TYPE.PERFORMER
            })
        ]);
        const adminEmail = await settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.ADMIN_EMAIL);
        adminEmail && await this.mailService.send({
            subject: 'New model sign up',
            to: adminEmail,
            data: performer,
            template: 'new-performer-notify-admin'
        });
        return new dtos_2.PerformerDto(performer);
    }
    async adminUpdate(id, payload) {
        const performer = await this.performerModel.findById(id);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        const data = Object.assign({}, payload);
        if (!data.name) {
            data.name = [data.firstName || '', data.lastName || ''].join(' ');
        }
        if (data.email && data.email.toLowerCase() !== performer.email) {
            const emailCheck = await this.performerModel.countDocuments({
                email: data.email.toLowerCase(),
                _id: { $ne: performer._id }
            });
            const countUserEmail = await this.userService.checkExistedEmailorUsername({ email: data.email });
            if (emailCheck || countUserEmail) {
                throw new exceptions_2.EmailExistedException();
            }
            data.email = data.email.toLowerCase();
        }
        if (data.username && data.username.trim() !== performer.username) {
            const usernameCheck = await this.performerModel.countDocuments({
                username: data.username.trim().toLowerCase(),
                _id: { $ne: performer._id }
            });
            const countUserUsername = await this.userService.checkExistedEmailorUsername({ username: data.username });
            if (usernameCheck || countUserUsername) {
                throw new exceptions_2.UsernameExistedException();
            }
            data.username = data.username.trim().toLowerCase();
        }
        if ((payload.avatarId && !performer.avatarId)
            || (performer.avatarId
                && payload.avatarId
                && payload.avatarId !== performer.avatarId.toString())) {
            const avatar = await this.fileService.findById(payload.avatarId);
            if (!avatar) {
                throw new kernel_1.EntityNotFoundException('Avatar not found!');
            }
            data.avatarPath = avatar.path;
        }
        if ((payload.coverId && !performer.coverId)
            || (performer.coverId
                && payload.coverId
                && payload.coverId !== performer.coverId.toString())) {
            const cover = await this.fileService.findById(payload.coverId);
            if (!cover) {
                throw new kernel_1.EntityNotFoundException('Cover not found!');
            }
            data.coverPath = cover.path;
        }
        if (data.dateOfBirth) {
            data.dateOfBirth = new Date(data.dateOfBirth);
        }
        await this.performerModel.updateOne({ _id: id }, data);
        const newPerformer = await this.performerModel.findById(performer._id);
        const oldStatus = performer.status;
        if (data.status !== performer.status) {
            await this.queueEventService.publish(new kernel_1.QueueEvent({
                channel: constants_4.PERFORMER_UPDATE_STATUS_CHANNEL,
                eventName: constants_2.EVENT.UPDATED,
                data: Object.assign(Object.assign({}, new dtos_2.PerformerDto(newPerformer)), { oldStatus })
            }));
        }
        if (data.email && data.email.toLowerCase() !== performer.email) {
            await this.authService.sendVerificationEmail({ email: newPerformer.email, _id: newPerformer._id });
            await this.authService.updateKey({
                source: 'performer',
                sourceId: newPerformer._id,
                type: 'email'
            });
        }
        if ((data.username && data.username.trim() !== performer.username)) {
            await this.authService.updateKey({
                source: 'performer',
                sourceId: newPerformer._id,
                type: 'username'
            });
        }
        return true;
    }
    async selfUpdate(id, payload) {
        const performer = await this.performerModel.findById(id);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        const data = Object.assign({}, payload);
        if (!data.name) {
            data.name = [data.firstName || '', data.lastName || ''].join(' ');
        }
        if (data.email && data.email.toLowerCase() !== performer.email) {
            const emailCheck = await this.performerModel.countDocuments({
                email: data.email.toLowerCase(),
                _id: { $ne: performer._id }
            });
            const countUserEmail = await this.userService.checkExistedEmailorUsername({ email: data.email });
            if (emailCheck || countUserEmail) {
                throw new exceptions_1.EmailHasBeenTakenException();
            }
            data.email = data.email.toLowerCase();
        }
        if (data.username && data.username.trim() !== performer.username) {
            const usernameCheck = await this.performerModel.countDocuments({
                username: data.username.trim().toLowerCase(),
                _id: { $ne: performer._id }
            });
            const countUserUsername = await this.userService.checkExistedEmailorUsername({ username: data.username });
            if (usernameCheck || countUserUsername) {
                throw new exceptions_2.UsernameExistedException();
            }
            data.username = data.username.trim().toLowerCase();
        }
        if (data.dateOfBirth) {
            data.dateOfBirth = new Date(data.dateOfBirth);
        }
        await this.performerModel.updateOne({ _id: id }, data);
        const newPerformer = await this.performerModel.findById(id);
        if (data.email && data.email.toLowerCase() !== performer.email) {
            await this.authService.sendVerificationEmail({ email: newPerformer.email, _id: newPerformer._id });
            await this.authService.updateKey({
                source: 'performer',
                sourceId: newPerformer._id,
                type: 'email'
            });
        }
        if (data.username && data.username.trim() !== performer.username) {
            await this.authService.updateKey({
                source: 'performer',
                sourceId: newPerformer._id,
                type: 'username'
            });
        }
        return true;
    }
    async userSwitchAccount(data) {
        return this.performerModel.create(data);
    }
    async updateAvatar(user, file) {
        await this.performerModel.updateOne({ _id: user._id }, {
            avatarId: file._id,
            avatarPath: file.path
        });
        await this.fileService.addRef(file._id, {
            itemId: user._id,
            itemType: constants_3.REF_TYPE.PERFORMER
        });
        return file;
    }
    async updateCover(user, file) {
        await this.performerModel.updateOne({ _id: user._id }, {
            coverId: file._id,
            coverPath: file.path
        });
        await this.fileService.addRef(file._id, {
            itemId: user._id,
            itemType: constants_3.REF_TYPE.PERFORMER
        });
        return file;
    }
    async updateWelcomeVideo(user, file) {
        await this.performerModel.updateOne({ _id: user._id }, {
            $set: {
                welcomeVideoId: file._id,
                welcomeVideoPath: file.path
            }
        });
        await this.fileService.addRef(file._id, {
            itemId: user._id,
            itemType: constants_3.REF_TYPE.PERFORMER
        });
        await this.fileService.queueProcessVideo(file._id);
        if (user.welcomeVideoId) {
            await this.fileService.remove(user.welcomeVideoId);
        }
        return file;
    }
    async checkSubscribed(performerId, user) {
        const count = performerId && user ? await this.subscriptionService.checkSubscribed(performerId, user._id) : 0;
        return { subscribed: count > 0 };
    }
    async viewProfile(id) {
        return this.performerModel.updateOne({ _id: id }, {
            $inc: { 'stats.views': 1 }
        });
    }
    async updateStats(id, payload) {
        return this.performerModel.updateOne({ _id: id }, { $inc: payload });
    }
    async updatePaymentGateway(payload) {
        let item = await this.paymentGatewaySettingModel.findOne({
            key: payload.key,
            performerId: payload.performerId
        });
        if (!item) {
            item = new this.paymentGatewaySettingModel();
        }
        item.key = payload.key;
        item.performerId = payload.performerId;
        item.status = 'active';
        item.value = payload.value;
        return item.save();
    }
    async getPaymentSetting(performerId, service = 'ccbill') {
        return this.paymentGatewaySettingModel.findOne({
            key: service,
            performerId
        });
    }
    async updateSubscriptionStat(performerId, num = 1) {
        const performer = await this.performerModel.findById(performerId);
        if (!performer)
            return false;
        return this.performerModel.updateOne({ _id: performerId }, {
            $inc: { 'stats.subscribers': num }
        });
    }
    async updateLikeStat(performerId, num = 1) {
        return this.performerModel.updateOne({ _id: performerId }, {
            $inc: { 'stats.likes': num }
        });
    }
    async updateCommissionSetting(performerId, payload) {
        let item = await this.commissionSettingModel.findOne({
            performerId
        });
        if (!item) {
            item = new this.commissionSettingModel();
        }
        item.performerId = performerId;
        item.monthlySubscriptionCommission = payload.monthlySubscriptionCommission;
        item.yearlySubscriptionCommission = payload.yearlySubscriptionCommission;
        item.videoSaleCommission = payload.videoSaleCommission;
        item.productSaleCommission = payload.productSaleCommission;
        return item.save();
    }
    async updateBankingSetting(performerId, payload, currentUser) {
        if ((currentUser.roles
            && currentUser.roles.indexOf('admin') === -1
            && currentUser._id.toString() !== performerId)
            || (!currentUser.roles
                && currentUser
                && currentUser._id.toString() !== performerId)) {
            throw new common_1.NotAcceptableException('Permission denied');
        }
        let item = await this.bankingSettingModel.findOne({
            performerId
        });
        if (!item) {
            item = new this.bankingSettingModel(payload);
        }
        item.performerId = performerId;
        item.firstName = payload.firstName;
        item.lastName = payload.lastName;
        item.SSN = payload.SSN;
        item.bankName = payload.bankName;
        item.bankAccount = payload.bankAccount;
        item.bankRouting = payload.bankRouting;
        item.bankSwiftCode = payload.bankSwiftCode;
        item.address = payload.address;
        item.city = payload.city;
        item.state = payload.state;
        item.country = payload.country;
        return item.save();
    }
    async updateVerificationStatus(userId) {
        const user = await this.performerModel.findById(userId);
        if (!user)
            return true;
        return this.performerModel.updateOne({
            _id: userId
        }, { verifiedEmail: true });
    }
    async getCommissions(performerId) {
        return this.commissionSettingModel.findOne({ performerId });
    }
    async checkAuthDocument(req, user) {
        const { query } = req;
        if (!query.documentId) {
            throw new kernel_1.ForbiddenException();
        }
        if (user.roles && user.roles.indexOf('admin') > -1) {
            return true;
        }
        const file = await this.fileService.findById(query.documentId);
        if (!file || !file.refItems || (file.refItems[0] && file.refItems[0].itemType !== constants_3.REF_TYPE.PERFORMER))
            return false;
        if (file.refItems && file.refItems[0].itemId && user._id.toString() === file.refItems[0].itemId.toString()) {
            return true;
        }
        throw new kernel_1.ForbiddenException();
    }
    async updatePreApprovalCode(performerId, data) {
        return this.performerModel.updateOne({ _id: performerId }, { $set: data });
    }
    async findByPreApprovalCode(performerId, data) {
        return this.performerModel.findOne(Object.assign({ _id: performerId }, data));
    }
};
PerformerService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_4.PerformerBlockService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_2.AuthService))),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_3.UserService))),
    __param(3, common_1.Inject(common_1.forwardRef(() => services_1.FileService))),
    __param(4, common_1.Inject(common_1.forwardRef(() => subscription_service_1.SubscriptionService))),
    __param(5, common_1.Inject(providers_1.PERFORMER_MODEL_PROVIDER)),
    __param(8, common_1.Inject(providers_1.PERFORMER_PAYMENT_GATEWAY_SETTING_MODEL_PROVIDER)),
    __param(9, common_1.Inject(providers_1.PERFORMER_BANKING_SETTING_MODEL_PROVIDER)),
    __param(10, common_1.Inject(providers_1.PERFORMER_COMMISSION_SETTING_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_4.PerformerBlockService,
        services_2.AuthService,
        services_3.UserService,
        services_1.FileService,
        subscription_service_1.SubscriptionService,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        mailer_1.MailerService,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], PerformerService);
exports.PerformerService = PerformerService;
//# sourceMappingURL=performer.service.js.map