/**
 * Module for the controller definition of the loginRecord api.
 * The LoginRecordController is handling /api/loginRecords requests.
 * @module {loginRecord:controller~LoginRecordController} loginRecord:controller
 * @requires {@link ParamController}
 */
'use strict';

module.exports = LoginRecordController;

var _ = require('lodash');
var ParamController = require('../../lib/controllers/param.controller');
var auth = require('../../lib/auth/auth.service');
var Q = require('q');

/**
 * The LoginRecord model instance
 * @type {loginRecord:model~LoginRecord}
 */
var LoginRecord = require('./loginRecord.model').model;
var LoginRecordDailyCount = require('./loginRecordDailyCount.model').model;
var RepoProxy = require('../repo/repo.proxy');
var SmsRecordModel = require('../../lib/sms/smsRecord.model.js').model;
/**
 * LoginRecordController constructor
 * @classdesc Controller that handles /api/loginRecords route requests
 * for the loginRecord api.
 * Uses the 'loginRecordId' parameter and the 'loginRecordParam' request property
 * to operate with the [main loginRecord API Model]{@link loginRecord:model~LoginRecord} model.
 * @constructor
 * @inherits ParamController
 * @see loginRecord:model~LoginRecord
 */
function LoginRecordController(router) {
  ParamController.call(this, LoginRecord, router);

  // modify select only properties
  // this.select = ['-__v'];

  // omit properties on update
  // this.omit = ['hashedPassword'];

  // property to return (maybe a virtual getter of the model)
  // this.defaultReturn = 'profile';
}

// define properties for the LoginRecordController here
LoginRecordController.prototype = {

  /**
   * Set our own constructor property for instanceof checks
   * @private
   */
  constructor: LoginRecordController,

  validateJwt: function (req, res, next) {
    if (!req.body || !req.body.userJwt) {
      return res.forbidden({
        message: "Do not have userJwt in req.body"
      });
    }

    var userJwt = req.body.userJwt;
    logger.log('userJwt', userJwt);
    var customReq = {
      headers: {
        authorization: userJwt
      }
    };
    auth.validateUserJwt(customReq)
      .then(function () {
        logger.log('success');
        res.ok({
          message: 'userJwt validate'
        });
      })
      .fail(function (err) {
        logger.log('err');
        res.forbidden({
          message: "userJwt not validate"
        });
      })
      .finally(function () {
        //   req.validateUserJwtForLoginRecord = {
        //   mobile: payload.mobile,
        //   appUserId: payload.appUserId,
        //   clientId: payload.clientId,
        //   actionType: 'validateUserJwt',
        //   ownerId: doc.ownerId
        // }
        logger.log('finally');
        LoginRecord.create(customReq.validateUserJwtForLoginRecord, function (err, document) {
          if (err) {
            logger.log('loginRecord save failed');
          }
          logger.log('loginRecord success', customReq.validateUserJwtForLoginRecord);
        });

        LoginRecordDailyCount.increaseTodayCount(customReq.validateUserJwtForLoginRecord)
          .then(function () {
            logger.log('loginRecordDailyCount success', customReq.validateUserJwtForLoginRecord);
          })
          .fail(function () {
            logger.log('loginRecordDailyCount failed');
          });

        Helper.updateAppUserLatestActive(customReq.validateUserJwtForLoginRecord)
          .then(function () {
            logger.log('success update appUser latestActive event');
          })
          .fail(function () {
            logger.log('failed update appUser latestActive event');
          });
      });
  },

  index: function (req, res) {
    var query = req.query || {};
    var self = this;

    logger.log(req.query, req.userInfo);

    var start = req.query.start.substr(0, 10);
    var stop = req.query.stop.substr(0, 10);
    var query = {
      day: {
        $gt: start,
        $lt: stop
      },
      ownerId: String(req.userInfo._id)
    };
    logger.log(query);
    LoginRecordDailyCount
      .find(query)
      .limit(1000)
      .sort({
        day: 1
      }).select({
        day: 1,
        count: 1
      })
      .exec(function (err, docs) {
        logger.log(err, docs);
        res.json(docs);
      });
  },
  statistics: function (req, res) {
    Helper.req = req;
    Helper.res = res;

    Helper.getRepoByOwnerId()
      .then(Helper.getAllUserCount)
      .then(Helper.getAllSmsCount)
      .then(Helper.getCurrentMonthActively)
      .then(Helper.getCurrentWeekLoginTimes)
      .then(Helper.getCurrentWeekNewUser)
      .then(function () {
        logger.log('success get statistics ', Helper.data);
        res.json(Helper.data);
      })
      .fail(function (err) {
        logger.log(err);
        var data = {
          allUserCount: 0,
          allSmsCount: 0,
          currentMonthActively: 0,
          currentWeekLoginTimes: 0,
          currentWeekNewUser: 0,
          message: 'error while get data from server'
        };

        res.json(data);
      });
  }
};

var Helper = {
  req: {},
  res: {},
  data: {},
  getRepoByOwnerId: function (ownerId) {
    var d = Q.defer();

    ownerId = ownerId || String(Helper.req.userInfo._id);
    var data = {
      ownerId: ownerId
    };
    logger.log(data);
    RepoProxy.getRepo(data)
      .then(function (repoModel) {
        logger.log('get repoModel at Helper.getRepoByOwnerId', repoModel);

        Helper.req.repoModel = repoModel;
        d.resolve(repoModel);
      });

    return d.promise;
  },
  getAllUserCount: function () {
    var d = Q.defer();
    Helper.req.repoModel.count({}, function (err, count) {
      Helper.data.allUserCount = count;
      logger.log('getAllUserCount', count);
      d.resolve(count);
    });

    return d.promise;
  },
  getAllSmsCount: function () {
    var d = Q.defer();
    var query = {
      ownerId: String(Helper.req.userInfo._id)
    };

    SmsRecordModel.count(query, function (err, count) {
      if (err) {
        logger.log(err, count);
        return d.reject(err);
      }

      Helper.data.allSmsCount = count;
      logger.log('getAllSmsCount', count);
      return d.resolve(count);
    });

    return d.promise;
  },
  getCurrentMonthActively: function () {
    var d = Q.defer();

    var today = new Date();
    var firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    var condition = {
      latestActive: {
        $gt: firstDayOfCurrentMonth,
        $lt: today
      }
    };
    logger.log(condition);
    Helper.req.repoModel.count(condition, function (err, count) {
      Helper.data.currentMonthActively = count;
      logger.log(count);
      d.resolve(count);
    });

    return d.promise;
  },
  getMonday: function (d) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  },
  getCurrentWeekLoginTimes: function () {
    var d = Q.defer();

    var today = new Date();
    var firstDayOfCurrentWeek = Helper.getMonday(today);

    var condition = {
      day: {
        $gt: firstDayOfCurrentWeek,
        $lt: today
      }
    };
    logger.log(condition);
    LoginRecordDailyCount
      .find(condition)
      .exec(function (err, docs) {
        var count = 0;
        for (var i = 0, total = docs.lenth; i < total; i++) {
          count += docs[i].count;
        }
        Helper.data.currentWeekLoginTimes = count;
        d.resolve(count);
      });

    return d.promise;
  },
  getCurrentWeekNewUser: function () {
    var d = Q.defer();

    var today = new Date();
    var firstDayOfCurrentWeek = Helper.getMonday(today);
    var condition = {
      createDate: {
        $gt: firstDayOfCurrentWeek,
        $lt: today
      }
    };
    logger.log(condition);
    Helper.req.repoModel.count(condition, function (err, count) {
      Helper.data.currentWeekNewUser = count;
      logger.log(count);
      d.resolve(count);
    });

    return d.promise;
  },
  updateAppUserLatestActive: function (data) {
    logger.log('herethere');
    logger.log(data);
    var d = Q.defer();
    var ownerId = data.ownerId;
    var appUserId = data.appUserId;
    logger.log('updateAppUserLatestActive start');

    Helper.getRepoByOwnerId(ownerId)
      .then(function (repoModel) {
        logger.log('get repoModel at updateAppUserLatestActive', repoModel);
        var condition = {
          _id: appUserId
        };
        logger.log(condition, repoModel.modelName);

        repoModel.findOne(condition, function (err, doc) {
          logger.log(err, doc);
          if (err || doc == null) {
            return d.reject(err);
          }
          var now = new Date();
          logger.log(doc, now);
          doc.latestActive = now;
          doc.save(function (err) {
            if (err) {
              return d.reject(err);
            }
            logger.log('updateAppUserLatestActive success');
            d.resolve();
          });
        });

      });

    return d.promise;
  }
};

// inherit from ParamController
LoginRecordController.prototype = _.create(ParamController.prototype, LoginRecordController.prototype);