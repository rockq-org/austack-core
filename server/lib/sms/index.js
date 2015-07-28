/**
 * SMS Service Provider
 */

var config = require('../../config');

var smsProvider;

switch (config.sms.provider) {
case 'weimi':
  logger.debug('Initialize SMS Service with weimi %j', config.sms.weimi);
  smsProvider = require('./weimi');
  break;
case 'qiji':
  logger.debug('Initialize SMS Service with qiji %j', config.sms.qiji);
  smsProvider = require('./qiji')(config.sms.qiji);
  break;
default:
  throw new Error('Invalid Configuration for SMS Provider.');
  break;
}

exports = module.exports = smsProvider;
