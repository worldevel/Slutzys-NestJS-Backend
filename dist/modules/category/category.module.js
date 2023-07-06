"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModule = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../kernel");
const auth_module_1 = require("../auth/auth.module");
const providers_1 = require("./providers");
const admin_category_controller_1 = require("./controllers/admin-category.controller");
const user_category_controller_1 = require("./controllers/user-category.controller");
const services_1 = require("./services");
let CategoryModule = class CategoryModule {
};
CategoryModule = __decorate([
    common_1.Module({
        imports: [
            kernel_1.MongoDBModule,
            common_1.forwardRef(() => auth_module_1.AuthModule)
        ],
        providers: [
            ...providers_1.categoryProviders,
            services_1.CategoryService
        ],
        controllers: [
            admin_category_controller_1.AdminCategoryController,
            user_category_controller_1.UserCategoryController
        ],
        exports: [
            ...providers_1.categoryProviders,
            services_1.CategoryService
        ]
    })
], CategoryModule);
exports.CategoryModule = CategoryModule;
//# sourceMappingURL=category.module.js.map