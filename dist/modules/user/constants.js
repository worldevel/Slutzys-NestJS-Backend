"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_USER_CHANNEL = exports.GENDERS = exports.GENDER_TRANSGENDER = exports.GENDER_FEMALE = exports.GENDER_MALE = exports.STATUSES = exports.STATUS_INACTIVE = exports.STATUS_ACTIVE = exports.STATUS_PENDING_EMAIL_CONFIRMATION = exports.USER_ROLES = exports.ROLE_USER = exports.ROLE_ADMIN = void 0;
exports.ROLE_ADMIN = 'admin';
exports.ROLE_USER = 'user';
exports.USER_ROLES = {
    ADMIN: exports.ROLE_ADMIN,
    USER: exports.ROLE_USER
};
exports.STATUS_PENDING_EMAIL_CONFIRMATION = 'pending-email-confirmation';
exports.STATUS_ACTIVE = 'active';
exports.STATUS_INACTIVE = 'inactive';
exports.STATUSES = [
    exports.STATUS_PENDING_EMAIL_CONFIRMATION,
    exports.STATUS_ACTIVE,
    exports.STATUS_INACTIVE
];
exports.GENDER_MALE = 'male';
exports.GENDER_FEMALE = 'female';
exports.GENDER_TRANSGENDER = 'transgender';
exports.GENDERS = [exports.GENDER_MALE, exports.GENDER_FEMALE, exports.GENDER_TRANSGENDER];
exports.DELETE_USER_CHANNEL = 'DELETE_USER_CHANNEL';
//# sourceMappingURL=constants.js.map