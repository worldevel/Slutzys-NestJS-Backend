"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.userSchema = void 0;
const mongoose = require("mongoose");
const mongodb_1 = require("mongodb");
const constants_1 = require("../constants");
exports.userSchema = new mongoose.Schema({
    name: String,
    firstName: String,
    lastName: String,
    username: {
        type: String,
        index: true,
        lowercase: true,
        unique: true,
        trim: true,
        sparse: true
    },
    email: {
        type: String,
        index: true,
        unique: true,
        lowercase: true,
        trim: true,
        sparse: true
    },
    verifiedEmail: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String
    },
    roles: [
        {
            type: String,
            default: constants_1.ROLE_USER
        }
    ],
    avatarId: mongodb_1.ObjectId,
    avatarPath: String,
    status: {
        type: String,
        default: constants_1.STATUS_ACTIVE
    },
    gender: {
        type: String
    },
    balance: {
        type: Number,
        default: 0
    },
    country: {
        type: String
    },
    isOnline: {
        type: Number,
        default: 0
    },
    onlineAt: {
        type: Date
    },
    offlineAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
exports.UserSchema = exports.userSchema;
//# sourceMappingURL=user.schema.js.map