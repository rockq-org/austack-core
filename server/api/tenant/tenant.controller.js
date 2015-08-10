'use strict';

module.exports = TenantController;

var _ = require('lodash');
var ParamController = require('../../lib/controllers/param.controller');
var LoginRecordModel = require('../loginRecord/loginRecord.model').model;
var Application = require('../application/application.model').model;
var User = require('../user/user.model').model;
var compose = require('composable-middleware');
var ShapeProxy = require('../shape/shape.proxy');
var SMS = require('../../lib/sms/index');
var auth = require('../../lib/auth/auth.service.js');
var Config = require('../../config/index.js');
var RepoProxy = require('../repo/repo.proxy');
var Q = require('q');
var ejs = require('ejs');
var shortid = require('shortid');
var VerificationCodeModel = require('../user/verificationCode.model').model;

/**
 * The Tenant model instance
 * @type {tenant:model~Tenant}
 */
var Tenant = require('./tenant.model').model; // maybe delete it later if we really do not need it

/**
 * TenantController constructor
 * @classdesc Controller that handles /tenant route requests
 * for the tenant api.
 * Uses the 'tenantId' parameter and the 'tenantParam' request property
 * to operate with the [main tenant API Model]{@link tenant:model~Tenant} model.
 * @constructor
 * @inherits ParamController
 * @see tenant:model~Tenant
 */
function TenantController(router) {
  ParamController.call(this, Tenant, router);

  // modify select only properties
  // this.select = ['-__v'];

  // omit properties on update
  // this.omit = ['hashedPassword'];

  // property to return (maybe a virtual getter of the model)
  // this.defaultReturn = 'profile';
}

// define properties for the TenantController here
TenantController.prototype = {

  /**
   * Set our own constructor property for instanceof checks
   * @private
   */
  constructor: TenantController,

  loginForm: function (req, res, next) {
    Helper.req = req;
    Helper.res = res;
    Helper.next = next;
    Helper.msg = '';

    var data = {
      mobile: 18959264502,
    };
    Helper.data = data;
    Helper.getApplication()
      .finally(Helper.render);
  },
  loginPost: function loginPost(req, res, next) {

    // Helper.jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3NhbXBsZXMuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA0NzE1MzA4ODIwMTQzMzMyMDE1IiwiYXVkIjoiQlVJSlNXOXg2MHNJSEJ3OEtkOUVtQ2JqOGVESUZ4REMiLCJleHAiOjE0MzY1ODY1MTYsImlhdCI6MTQzNjU1MDUxNn0.GQUI29qgwP7pKAxI-YF6r-h4Kjnkn-1hPAbsI6wXpFY';
    // var host = Config.apiBaseURL.substr(0, Config.apiBaseURL.length - 3);
    // var url = host + 'tenant' + req.url + '#id_token=' + Helper.jwt;
    // return res.redirect(302, url);

    Helper.req = req;
    Helper.res = res;
    Helper.next = next;
    Helper.msg = '';

    Helper.getApplication()
      .then(Helper.getRepoByOwnerId)
      .then(function () {
        if (Helper.req.body.action == 'send-verification-code') {
          logger.log('send-verification-code');
          return Helper.generateVerificationCode()
            .then(Helper.insertOrUpdateVerificationCodeModel)
            .then(Helper.sendSMS);
        }

        logger.log('validateVerificationCode');
        return Helper.validateVerificationCode()
          .then(Helper.getUserJwt)
          .then(Helper.addLoginRecord);
      })
      .catch(function (msg) {
        if (!Helper.msg) {
          Helper.msg = msg;
        }
      })
      .finally(function () {
        var data = {
          mobile: req.body.mobile,
          msg: Helper.msg
        };
        if (Helper.jwt) {
          // TODO: should be have bug later while we use tenant domain
          var host = Config.apiBaseURL.substr(0, Config.apiBaseURL.length - 3);
          var url = host + 'tenant' + req.url + '#id_token=' + Helper.jwt;
          logger.log(Helper.jwt);
          return res.redirect(302, url);
        }

        Helper.data = data;
        Helper.render();
      });
  }
};

// inherit from ParamController
TenantController.prototype = _.create(ParamController.prototype, TenantController.prototype);

var Helper = {
  msg: '',
  render: function (data) {
    if (!Helper.req.application) {
      return Helper.res.notFound('该应用不存在');
    }
    var loginTemplate = Helper.req.application.loginTemplate;
    if (!loginTemplate) {
      return Helper.res.render('tenant/login', Helper.data);
    }

    var htmlContent = ejs.render(loginTemplate, Helper.data);
    Helper.res.send(htmlContent);
  },
  getApplication: function () {
    var d = Q.defer();
    var clientId = Helper.req.query.clientId;

    Application.findByClientId(clientId, function (err, application) {
      if (err) {
        d.reject('该应用不存在');
        return d.promise;
      }

      Helper.req.application = application;
      d.resolve();
    });

    return d.promise;
  },
  getRepoByOwnerId: function () {
    var ownerId = Helper.req.application.ownerId;
    var data = {
      ownerId: ownerId
    };

    return RepoProxy.getRepo(data)
      .then(function (repoModel) {
        logger.log('get repoModel', repoModel);
        Helper.req.repoModel = repoModel;
      });
  },
  generateVerificationCode: function () {
    var d = Q.defer();
    var verificationCode = SMS.generateVerificationCode();
    Helper.req.verificationCode = verificationCode;
    d.resolve();
    return d.promise;
  },
  insertOrUpdateVerificationCodeModel: function () {
    var d = Q.defer();
    var repoModel = Helper.req.repoModel;
    var repoName = repoModel.modelName;
    var mobile = Helper.req.body.mobile;
    var idKey = repoName + '_' + mobile;
    var verificationCode = Helper.req.verificationCode;

    var now = new Date();
    var SIXTY_SECONDS = (+60) * 1000;

    var query = {
      idKey: idKey
    };
    VerificationCodeModel.findOne(query, function (err, doc) {
      if (doc) {
        var timeSpan = now - doc.verificationCodeLatestSendTime;
        logger.log('timeSpan ', timeSpan, now, doc.verificationCodeLatestSendTime);
        if (timeSpan < SIXTY_SECONDS) {
          Helper.msg = '请60秒后再重发验证码';
          logger.log('timeSpan < SIXTY_SECONDS');
          return d.reject('请60秒后再重发验证码');
        }
        doc.verificationCode = verificationCode;
        doc.save(function (err) {
          return d.resolve();
        });

        return;
      }

      // do not find doc, insert new one
      var expiredTimeSpan = 60000 * 3; // three minutes
      var verificationCodeExpiredAt = new Date(now.valueOf() + expiredTimeSpan);

      doc = {
        idKey: idKey,
        verificationCodeLatestSendTime: now,
        verificationCodeExpiredAt: verificationCodeExpiredAt,
        verificationCode: verificationCode
      };
      VerificationCodeModel.create(doc, function (err, _doc) {
        if (err) {
          d.reject(err);
        }
        logger.log(_doc);
        d.resolve();
      });
    });

    return d.promise;
  },

  sendSMS: function () {

    var sendData = {
      mobile: Helper.req.body.mobile,
      appName: Helper.req.application.name,
      verifyCode: Helper.req.verificationCode,
      period: 3
    };

    var logData = {
      content: '', //only get this in the sms send
      type: 'app',
      mobile: sendData.mobile,
      clientId: String(Helper.req.application.clientId),
      ownerId: String(Helper.req.application.ownerId),
      status: '' // only get this valude after sms send
    };

    return SMS.sendVerificationCode(sendData, logData)
      .then(function () {
        Helper.msg = '发送短信成功';
      })
      .catch(function () {
        Helper.msg = '发送短信失败';
      });
  },

  validateVerificationCode: function () {
    var d = Q.defer();
    var repoModel = Helper.req.repoModel;
    var verificationCode = Helper.req.body.verificationCode;
    var mobile = Helper.req.body.mobile;

    repoModel.findOne({
      mobile: mobile
    }, function (err, user) {
      d.resolve();
      if (err || user == null) {
        Helper.msg = '用户不存在';
        return;
      }

      if (user.verificationCode != verificationCode) {
        Helper.msg = '验证码错误';
        return;
      }

      var now = new Date();
      if (user.verificationCodeExpiredAt < now) {
        Helper.msg = '验证码已过期';
        return;
      }

      Helper.req.appUser = user;
    });

    return d.promise;
  },
  getUserJwt: Q.fbind(function () {
    //contain err, jump out of here
    if (Helper.msg) {
      return;
    }
    var clientId = Helper.req.application.clientId;
    var clientSecret = Helper.req.application.clientSecret;
    var mobile = Helper.req.body.mobile;
    var appUserId = String(Helper.req.appUser._id);
    var token = auth.signTokenForApplicationUser(clientId, clientSecret, mobile, appUserId);
    Helper.req.jwt = token;

    Helper.msg = '登录成功！';
    Helper.jwt = token;
    logger.log(token);
  }),
  addLoginRecord: Q.fbind(function () {
    if (!Helper.jwt) {
      return;
    }

    var recordData = {
      mobile: Helper.req.body.mobile,
      appUserId: String(Helper.req.appUser._id),
      clientId: Helper.req.query.clientId,
      actionType: 'login',
      ownerId: String(Helper.req.application.ownerId)
    };
    logger.log('addLoginRecord now', recordData);
    LoginRecordModel.create(recordData, function (err, doc) {
      logger.log(err, doc);
    });
  })
};