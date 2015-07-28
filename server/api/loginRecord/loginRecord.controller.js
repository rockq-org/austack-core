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

    Helper.getAllUserCount()
      .then(Helper.getCurrentMonthActively)
      .then(Helper.getCurrentWeekLoginTimes)
      .then(Helper.getCurrentWeekNewUser)
      .then(function () {
        res.json(Helper.data);
      })
      .fail(function (err) {
        logger.log(err);
        var data = {
          allUserCount: 0,
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
  data: {},
  getAllUserCount: function () {
    var ownerId = String(Helper.req.userInfo._id);
    return RepoProxy.getRepoByOwnerId(ownerId)
      .then(function (repoModel) {
        logger.log('get repoModel', repoModel);
        Helper.req.repoModel = repoModel;
        repoModel.count({}, function (err, count) {
          Helper.data.allUserCount = count;
          logger.log(count);
        });
      });
  },
  getCurrentMonthActively: function () {
    Helper.data.currentMonthActively = 10;
  },
  getCurrentWeekLoginTimes: function () {
    Helper.data.currentWeekLoginTimes = 10;
  },
  getCurrentWeekNewUser: function () {
    Helper.data.currentWeekNewUser = 10;
  }
};

// inherit from ParamController
LoginRecordController.prototype = _.create(ParamController.prototype, LoginRecordController.prototype);