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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const file_1 = require("../../file");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const services_1 = require("../../auth/services");
const services_2 = require("../../performer/services");
const dtos_1 = require("../../performer/dtos");
const providers_1 = require("../providers");
const dtos_2 = require("../dtos");
const constants_2 = require("../constants");
const exceptions_1 = require("../exceptions");
const username_existed_exception_1 = require("../exceptions/username-existed.exception");
let UserService = class UserService {
    constructor(authService, performerService, userModel, queueEventService) {
        this.authService = authService;
        this.performerService = performerService;
        this.userModel = userModel;
        this.queueEventService = queueEventService;
    }
    async find(params) {
        return this.userModel.find(params);
    }
    async findOne(params) {
        return this.userModel.findOne(params);
    }
    async findByEmail(email) {
        if (!email) {
            return null;
        }
        return this.userModel.findOne({ email: email.toLowerCase() });
    }
    async findById(id) {
        return this.userModel.findById(id);
    }
    async getMe(id, jwToken) {
        const user = await this.userModel.findById(id);
        if (user) {
            return new dtos_2.UserDto(user).toResponse(true);
        }
        const performer = await this.performerService.userGetDetails(id, jwToken);
        if (!performer && !user) {
            throw new kernel_1.EntityNotFoundException();
        }
        return new dtos_1.PerformerDto(performer).toResponse(true);
    }
    async findByUsername(username) {
        const newUsername = username.trim().toLowerCase();
        const user = await this.userModel.findOne({ username: newUsername });
        return user ? new dtos_2.UserDto(user) : null;
    }
    async findByIds(ids) {
        return this.userModel.find({ _id: { $in: ids } });
    }
    async checkExistedEmailorUsername(payload) {
        const data = payload.username ? await this.userModel.countDocuments({ username: payload.username.trim().toLowerCase() })
            : await this.userModel.countDocuments({ email: payload.email.toLowerCase() });
        return data;
    }
    async create(data, options = {}) {
        if (!data || !data.email) {
            throw new kernel_1.EntityNotFoundException();
        }
        const countUserEmail = await this.userModel.countDocuments({
            email: data.email.toLowerCase()
        });
        const countPerformerEmail = await this.performerService.checkExistedEmailorUsername({ email: data.email });
        if (countUserEmail || countPerformerEmail) {
            throw new exceptions_1.EmailHasBeenTakenException();
        }
        const countUserUsername = data.username && await this.findByUsername(data.username);
        const countPerformerUsername = data.username && await this.performerService.checkExistedEmailorUsername({ username: data.username });
        if (countUserUsername || countPerformerUsername) {
            throw new username_existed_exception_1.UsernameExistedException();
        }
        const user = Object.assign({}, data);
        user.email = data.email.toLowerCase();
        user.username = data.username && data.username.trim().toLowerCase();
        user.createdAt = new Date();
        user.updatedAt = new Date();
        user.roles = options.roles || [constants_2.ROLE_USER];
        user.status = options.status || constants_2.STATUS_ACTIVE;
        if (!user.name) {
            user.name = [user.firstName || '', user.lastName || ''].join(' ');
        }
        const resp = await this.userModel.create(user);
        return resp;
    }
    async socialCreate(data) {
        if (!data.name) {
            data.name = [data.firstName || '', data.lastName || ''].join(' ');
        }
        return this.userModel.create(data);
    }
    async update(id, payload, user) {
        const data = Object.assign(Object.assign({}, payload), { updatedAt: new Date() });
        const eUser = await this.userModel.findById(id);
        if (!eUser) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user && !user.roles.includes('admin') && `${user._id}` !== `${id}`) {
            throw new common_1.ForbiddenException();
        }
        if (!data.name) {
            data.name = [data.firstName || '', data.lastName || ''].join(' ');
        }
        if (data.username && data.username !== eUser.username) {
            const countUserUsername = await this.userModel.countDocuments({
                username: data.username.trim().toLowerCase(),
                _id: { $ne: eUser._id }
            });
            const countPerformerUsername = await this.performerService.checkExistedEmailorUsername({ username: data.username });
            if (countUserUsername || countPerformerUsername) {
                throw new username_existed_exception_1.UsernameExistedException();
            }
            data.username = data.username.trim().toLowerCase();
        }
        if (data.email && data.email !== eUser.email) {
            const countUserEmail = await this.userModel.countDocuments({
                email: data.email.toLowerCase(),
                _id: { $ne: eUser._id }
            });
            const countPerformerEmail = await this.performerService.checkExistedEmailorUsername({ email: data.email });
            if (countUserEmail || countPerformerEmail) {
                throw new exceptions_1.EmailHasBeenTakenException();
            }
            data.email = data.email.toLowerCase();
            data.verifiedEmail = false;
        }
        await this.userModel.updateOne({ _id: id }, data);
        const newUser = await this.userModel.findById(id);
        if (data.email && data.email !== eUser.email) {
            await this.authService.sendVerificationEmail({ email: newUser.email, _id: newUser._id });
            await this.authService.updateKey({
                source: 'user',
                sourceId: newUser._id,
                type: 'email'
            });
        }
        if (data.username && data.username !== eUser.username) {
            await this.authService.updateKey({
                source: 'user',
                sourceId: newUser._id,
                type: 'username'
            });
        }
        return newUser;
    }
    async updateAvatar(user, file) {
        await this.userModel.updateOne({ _id: user._id }, {
            avatarId: file._id,
            avatarPath: file.path
        });
        return file;
    }
    async adminUpdate(id, payload) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new kernel_1.EntityNotFoundException();
        }
        const data = Object.assign(Object.assign({}, payload), { updatedAt: new Date() });
        if (!data.name) {
            data.name = [data.firstName || '', data.lastName || ''].join(' ');
        }
        if (data.username && data.username !== user.username) {
            const countUserUsername = await this.userModel.countDocuments({
                username: data.username.trim().toLowerCase(),
                _id: { $ne: user._id }
            });
            const countPerformerUsername = await this.performerService.checkExistedEmailorUsername({ username: data.username });
            if (countUserUsername || countPerformerUsername) {
                throw new username_existed_exception_1.UsernameExistedException();
            }
            data.username = data.username.trim().toLowerCase();
        }
        if (data.email && data.email !== user.email) {
            const countUserEmail = await this.userModel.countDocuments({
                email: data.email.toLowerCase(),
                _id: { $ne: user._id }
            });
            const countPerformerEmail = await this.performerService.checkExistedEmailorUsername({ email: data.email });
            if (countUserEmail || countPerformerEmail) {
                throw new exceptions_1.EmailHasBeenTakenException();
            }
            data.email = data.email.toLowerCase();
            data.verifiedEmail = false;
        }
        await this.userModel.updateOne({ _id: id }, data);
        const newUser = await this.userModel.findById(id);
        if (data.email && data.email.toLowerCase() !== user.email) {
            await this.authService.sendVerificationEmail({ email: newUser.email, _id: newUser._id });
            await this.authService.updateKey({
                source: 'user',
                sourceId: newUser._id,
                type: 'email'
            });
        }
        if (data.username && data.username.trim() !== user.username) {
            await this.authService.updateKey({
                source: 'user',
                sourceId: newUser._id,
                type: 'username'
            });
        }
        return true;
    }
    async updateVerificationStatus(userId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            return true;
        return this.userModel.updateOne({
            _id: userId
        }, { verifiedEmail: true, status: constants_2.STATUS_ACTIVE });
    }
    async updateStats(id, payload) {
        return this.userModel.updateOne({ _id: id }, { $inc: payload });
    }
    async delete(id) {
        if (!kernel_1.StringHelper.isObjectId(id))
            throw new common_1.ForbiddenException();
        const user = await this.userModel.findById(id);
        if (!user)
            throw new kernel_1.EntityNotFoundException();
        await this.userModel.deleteOne({ _id: id });
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_2.DELETE_USER_CHANNEL,
            eventName: constants_1.EVENT.DELETED,
            data: new dtos_2.UserDto(user)
        }));
        return { deleted: true };
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.AuthService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_2.PerformerService))),
    __param(2, common_1.Inject(providers_1.USER_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.AuthService,
        services_2.PerformerService,
        mongoose_1.Model,
        kernel_1.QueueEventService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map