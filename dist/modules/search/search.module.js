"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchModule = void 0;
const common_1 = require("@nestjs/common");
const search_service_1 = require("./services/search.service");
const search_controller_1 = require("./controllers/search.controller");
const performer_module_1 = require("../performer/performer.module");
const performer_assets_module_1 = require("../performer-assets/performer-assets.module");
const block_module_1 = require("../block/block.module");
const utils_module_1 = require("../utils/utils.module");
let SearchModule = class SearchModule {
};
SearchModule = __decorate([
    common_1.Module({
        imports: [
            common_1.forwardRef(() => performer_module_1.PerformerModule),
            common_1.forwardRef(() => performer_assets_module_1.PerformerAssetsModule),
            common_1.forwardRef(() => block_module_1.BlockModule),
            common_1.forwardRef(() => utils_module_1.UtilsModule)
        ],
        providers: [search_service_1.SearchService],
        controllers: [search_controller_1.SearchController]
    })
], SearchModule);
exports.SearchModule = SearchModule;
//# sourceMappingURL=search.module.js.map