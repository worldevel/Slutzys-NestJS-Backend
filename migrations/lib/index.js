const crypto = require('crypto');

const mongoose = require('mongoose');

exports.COLLECTION = {
  SETTING: 'settings',
  USER: 'users',
  AUTH: 'auth',
  POST: 'posts',
  MENU: 'menus',
  PERFORMER: 'performers',
  PERFORMER_VIDEO: 'performervideos',
  PERFORMER_PHOTO: 'performerphotos',
  PERFORMER_GALLERY: 'performergalleries',
  PERFORMER_PRODUCT: 'performerproducts',
  USER_SUBSCRIPTION: 'usersubscriptions',
  EMAIL_TEMPLATE: 'emailtemplates'
};

exports.DB = mongoose.connection;

exports.encryptPassword = (pw, salt) => {
  const defaultIterations = 10000;
  const defaultKeyLength = 64;

  return crypto
    .pbkdf2Sync(pw, salt, defaultIterations, defaultKeyLength, 'sha1')
    .toString('base64');
};

exports.generateSalt = (byteSize = 16) => crypto.randomBytes(byteSize).toString('base64');
