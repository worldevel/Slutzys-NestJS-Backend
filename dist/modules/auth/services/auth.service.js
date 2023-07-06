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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mongoose_1 = require("mongoose");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const settings_1 = require("../../settings");
const kernel_1 = require("../../../kernel");
const mailer_1 = require("../../mailer");
const constants_1 = require("../../settings/constants");
const auth_provider_1 = require("../providers/auth.provider");
let AuthService = class AuthService {
    constructor(performerService, userService, authModel, verificationModel, forgotModel, mailService) {
        this.performerService = performerService;
        this.userService = userService;
        this.authModel = authModel;
        this.verificationModel = verificationModel;
        this.forgotModel = forgotModel;
        this.mailService = mailService;
    }
    generateSalt(byteSize = 16) {
        return crypto.randomBytes(byteSize).toString('base64');
    }
    encryptPassword(pw, salt) {
        const defaultIterations = 10000;
        const defaultKeyLength = 64;
        return crypto.pbkdf2Sync(pw, salt, defaultIterations, defaultKeyLength, 'sha1').toString('base64');
    }
    async findOne(query) {
        const data = await this.authModel.findOne(query);
        return data;
    }
    async find(query) {
        const data = await this.authModel.find(query);
        return data;
    }
    async create(data) {
        const salt = this.generateSalt();
        let newVal = data.value;
        if (['email', 'username'].includes(data.type) && newVal) {
            newVal = this.encryptPassword(newVal, salt);
        }
        let auth = await this.authModel.findOne({
            type: data.type,
            source: data.source,
            sourceId: data.sourceId
        });
        if (!auth) {
            auth = new this.authModel({
                type: data.type,
                source: data.source,
                sourceId: data.sourceId
            });
        }
        auth.salt = salt;
        auth.value = newVal;
        auth.key = data.key;
        return auth.save();
    }
    async update(data) {
        const user = data.source === 'user'
            ? await this.userService.findById(data.sourceId)
            : await this.performerService.findById(data.sourceId);
        if (!user) {
            throw new kernel_1.EntityNotFoundException();
        }
        await Promise.all([
            user.email && this.create({
                source: data.source,
                sourceId: data.sourceId,
                type: 'email',
                key: user.email,
                value: data.value
            }),
            user.username && this.create({
                source: data.source,
                sourceId: user._id,
                type: 'username',
                key: user.username,
                value: data.value
            })
        ]);
    }
    async updateKey(data) {
        const auths = await this.authModel.find({
            source: data.source,
            sourceId: data.sourceId
        });
        const user = data.source === 'user'
            ? await this.userService.findById(data.sourceId)
            : await this.performerService.findById(data.sourceId);
        if (!user)
            return;
        await Promise.all(auths.map((auth) => {
            auth.key = auth.type === 'email' ? user.email : user.username;
            return auth.save();
        }));
    }
    async findBySource(options) {
        return this.authModel.findOne(options);
    }
    verifyPassword(pw, auth) {
        if (!pw || !auth || !auth.salt) {
            return false;
        }
        return this.encryptPassword(pw, auth.salt) === auth.value;
    }
    generateJWT(auth, options = {}) {
        const newOptions = Object.assign({ expiresIn: 60 * 60 * 24 * 7 }, (options || {}));
        return jwt.sign({
            authId: auth._id,
            source: auth.source,
            sourceId: auth.sourceId
        }, process.env.TOKEN_SECRET, {
            expiresIn: newOptions.expiresIn
        });
    }
    verifyJWT(token) {
        try {
            return jwt.verify(token, process.env.TOKEN_SECRET);
        }
        catch (e) {
            return false;
        }
    }
    async getSourceFromJWT(jwtToken) {
        const decodded = this.verifyJWT(jwtToken);
        if (!decodded) {
            return null;
        }
        if (decodded.source === 'user') {
            const user = await this.userService.findById(decodded.sourceId);
            return user ? new dtos_1.UserDto(user).toResponse(true) : null;
        }
        if (decodded.source === 'performer') {
            const user = await this.performerService.findById(decodded.sourceId);
            return user ? new dtos_2.PerformerDto(user).toPublicDetailsResponse() : null;
        }
        return null;
    }
    async forgot(auth, source) {
        const token = kernel_1.StringHelper.randomString(14);
        await this.forgotModel.create({
            token,
            source: auth.source,
            sourceId: source._id,
            authId: auth._id,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const forgotLink = new URL(`auth/password-change?token=${token}`, kernel_1.getConfig('app').baseUrl).href;
        await this.mailService.send({
            subject: 'Recover password',
            to: source.email,
            data: {
                forgotLink
            },
            template: 'forgot'
        });
        return true;
    }
    async getForgot(token) {
        return this.forgotModel.findOne({ token });
    }
    async sendVerificationEmail(source) {
        const verifications = await this.verificationModel.find({
            value: source.email.toLowerCase()
        });
        const token = kernel_1.StringHelper.randomString(15);
        if (!verifications.length) {
            await this.verificationModel.create({
                sourceId: source._id,
                sourceType: 'user',
                value: source.email,
                token
            });
            await this.verificationModel.create({
                sourceId: source._id,
                sourceType: 'performer',
                value: source.email,
                token
            });
        }
        if (verifications.length) {
            await Promise.all(verifications.map((verification) => {
                verification.token = token;
                return verification.save();
            }));
        }
        const verificationLink = new URL(`auth/email-verification?token=${token}`, kernel_1.getConfig('app').baseUrl).href;
        const siteName = await settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.SITE_NAME) || process.env.DOMAIN;
        await this.mailService.send({
            to: source.email,
            subject: 'Verify your email address',
            data: {
                source,
                verificationLink,
                siteName
            },
            template: 'email-verification'
        });
    }
    async verifyEmail(token) {
        const verifications = await this.verificationModel.find({
            token
        });
        if (!verifications || !verifications.length) {
            throw new kernel_1.EntityNotFoundException();
        }
        for (const verification of verifications) {
            if (verification.sourceType === 'user') {
                await this.userService.updateVerificationStatus(verification.sourceId);
            }
            if (verification.sourceType === 'performer') {
                await this.performerService.updateVerificationStatus(verification.sourceId);
            }
            verification.verified = true;
            await verification.save();
        }
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_2.PerformerService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_1.UserService))),
    __param(2, common_1.Inject(auth_provider_1.AUTH_MODEL_PROVIDER)),
    __param(3, common_1.Inject(auth_provider_1.VERIFICATION_MODEL_PROVIDER)),
    __param(4, common_1.Inject(auth_provider_1.FORGOT_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_2.PerformerService,
        services_1.UserService,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mailer_1.MailerService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map