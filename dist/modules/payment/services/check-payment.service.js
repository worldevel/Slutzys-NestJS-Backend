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
exports.CheckPaymentService = void 0;
const common_1 = require("@nestjs/common");
const dtos_1 = require("../../user/dtos");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const dtos_2 = require("../../performer-assets/dtos");
const providers_1 = require("../providers");
const constants_1 = require("../constants");
let CheckPaymentService = class CheckPaymentService {
    constructor(orderDetailsModel) {
        this.orderDetailsModel = orderDetailsModel;
        this.checkBoughtVideo = async (video, user) => {
            if (video.performerId.toString() === user._id.toString()) {
                return 1;
            }
            return this.orderDetailsModel.countDocuments({
                status: constants_1.ORDER_STATUS.PAID,
                productId: video._id,
                buyerId: user._id
            });
        };
    }
    async checkBoughtProduct(product, user) {
        if (!product || (product && !product.price)) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (product.performerId.toString() === user._id.toString()) {
            return 1;
        }
        return this.orderDetailsModel.countDocuments({
            status: constants_1.ORDER_STATUS.PAID,
            productId: product._id,
            buyerId: user._id
        });
    }
    async checkBoughtGallery(gallery, user) {
        if (gallery.performerId.toString() === user._id.toString()) {
            return 1;
        }
        return this.orderDetailsModel.countDocuments({
            status: constants_1.ORDER_STATUS.PAID,
            productId: gallery._id,
            buyerId: user._id
        });
    }
};
CheckPaymentService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.ORDER_DETAIL_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], CheckPaymentService);
exports.CheckPaymentService = CheckPaymentService;
//# sourceMappingURL=check-payment.service.js.map