/**
 * Module for the controller definition of the tenant api.
 * The TenantController is handling /tenant requests.
 * @module {tenant:controller~TenantController} tenant:controller
 * @requires {@link ParamController}
 */
'use strict';

module.exports = TenantController;

var _ = require('lodash');
var ParamController = require('../../lib/controllers/param.controller');
var Application = require('../application/application.model').model;
var User = require('../user/user.model').model;
var compose = require('composable-middleware');
var ShapeProxy = require('../shape/shape.proxy');
var Weimi = require('../../lib/weimi/index');
var auth = require('../../lib/auth/auth.service.js');
var Repo = require('../repo/repo.proxy');
var Q = require('q');
var shortid = require('shortid');

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

  loginForm: function (req, res) {
    var data = {
      mobile: 18959264502
    };

    return res.render('tenant/login', data);
  },
  loginPost: function loginPost(req, res, next) {
    Helper.req = req;
    Helper.res = res;
    Helper.next = next;

    Helper.getApplication()
      .then(Helper.getRepoByClientId)
      .then(function () {
        if (Helper.req.body.action == 'send-verification-code') {
          return Helper.generateVerificationCode()
            .then(Helper.findAppUserAndSave)
            .then(Helper.insertAppUser)
            .then(Helper.sendSMS);
        }

        return Helper.validateVerificationCode()
          .then(Helper.getUserJwt);
      })
      .catch(function (msg) {
        Helper.msg = msg;
      })
      .finally(function () {
        var data = {
          mobile: req.body.mobile,
          msg: Helper.msg
        };

        return res.render('tenant/login', data);
      });
  }
};

// inherit from ParamController
TenantController.prototype = _.create(ParamController.prototype, TenantController.prototype);

var Helper = {
  msg: '',
  getApplication: function () {
    var d = Q.defer();
    var data = {
      mobile: Helper.req.body.mobile
    };
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
  getRepoByClientId: function () {
    var ownerId = Helper.req.application.ownerId;
    return User.getById(ownerId)
      .then(function (user) {
        var d = Q.defer();
        // var shapeName = 'repo_' + user.userId;
        var shapeName = user.repos[0];
        logger.log('shapeName', shapeName);
        ShapeProxy.getShapeByName(shapeName)
          .then(function (shape) {
            Helper.req.shape = shape;
            Helper.req.repoModel = Repo.getModel(shape);
            d.resolve();
          });

        return d.promise;
      });
  },

  generateVerificationCode: function () {
    var d = Q.defer();
    var verificationCode = Weimi.generateVerificationCode();
    Helper.req.verificationCode = verificationCode;
    d.resolve();
    return d.promise;
  },
  findAppUserAndSave: function () {
    var d = Q.defer();
    var repoModel = Helper.req.repoModel;
    var mobile = Helper.req.body.mobile;
    repoModel.findOne({
      mobile: mobile
    }, function (err, appUser) {
      if (!appUser) {
        return d.resolve();
      }

      Helper.req.appUser = appUser;
      appUser.verificationCode = Helper.req.verificationCode;
      appUser.save(function (err) {
        logger.log('findAppUserAndSave', appUser);
        return d.resolve(appUser);
      });
    });
    return d.promise;
  },
  insertAppUser: function (appUser) {
    var d = Q.defer();
    if (appUser) {
      d.resolve();
      return d.promise;
    };

    var repoModel = Helper.req.repoModel;
    var mobile = Helper.req.body.mobile;
    var verificationCode = Helper.req.verificationCode;
    // TODO: Need to figure out how to make the two fields and rename mobile to mobile?
    var appUser = {
      uid: shortid.generate(),
      mobile: mobile,
      verificationCode: verificationCode
    };

    repoModel.create(appUser, function (err, _appUser) {
      if (err) {
        return d.reject(err);
      }
      logger.log('insertAppUser', err, appUser, _appUser, repoModel);
      return d.resolve(appUser);
    });

    return d.promise;
  },
  //done func at above

  sendSMS: function () {
    var mobile = Helper.req.body.mobile;
    var verificationCode = Helper.req.verificationCode;
    // for now we can only send by cid, can not send customize cotent yet
    return Weimi.sendSMSByCid(mobile, verificationCode)
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
      if (err || user == null ||
        user.verificationCode != verificationCode
      ) {
        logger.log(err, user, verificationCode);
        Helper.msg = '验证码错误';
      }
      d.resolve();
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
    var token = auth.signTokenForApplicationUser(clientId, clientSecret, mobile);
    Helper.req.jwt = token;

    Helper.msg = token;
  })
};