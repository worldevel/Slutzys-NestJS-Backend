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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadUser = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../services");
let LoadUser = class LoadUser {
    constructor(authService) {
        this.authService = authService;
    }
    async canActivate(context) {
        var _a, _b;
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization || ((_a = request === null || request === void 0 ? void 0 : request.query) === null || _a === void 0 ? void 0 : _a.authorization) || ((_b = request === null || request === void 0 ? void 0 : request.query) === null || _b === void 0 ? void 0 : _b.Authorization);
        if (!token || token === 'null')
            return true;
        const user = request.user || (await this.authService.getSourceFromJWT(token));
        if (!request.user)
            request.user = user;
        const decodded = this.authService.verifyJWT(token);
        request.authUser = request.authUser || decodded;
        return true;
    }
};
LoadUser = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [services_1.AuthService])
], LoadUser);
exports.LoadUser = LoadUser;
//# sourceMappingURL=user.guard.js.map