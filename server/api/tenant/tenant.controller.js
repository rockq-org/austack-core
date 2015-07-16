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
var compose = require('composable-middleware');
var Weimi = require('../../lib/weimi/index');
var auth = require('../../lib/auth/auth.service.js');
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
  loginPost: function (req, res) {
    return compose()
      .use(this.getApplication)
      .use(this.sendVerificationCode)
      .use(this.verifyCode);
  },

  getApplication: function (req, res, next) {
    var data = {
      mobile: req.body.mobile
    };
    var clientId = req.query.clientId;
    Application.findByClientId(clientId, function (err, application) {
      if (err) {
        data.msg = '该应用不存在';
        return res.render('tenant/login', data);
      }
      req.application = application;
      next();
    });

  },
  sendVerificationCode: function (req, res, next) {
    if (req.body.action != 'send-verification-code') {
      return next();
    }
    var mobile = req.body.mobile;
    var data = {
      mobile: mobile
    };

    return compose()
      .use(this.getRepoByClientId)
      .use(this.insertOrUpdateRepoUser)
      .use(this.sendSMS)
      .use(function (req, res, next) {
        data.msg = req.msg;
        return res.render('tenant/login', data);
      });
  },

  getRepoByClientId: function (req, res, next) {
    //TODO: how to get the Repo?
    var clientId = req.query.clientId;
    // var Repo = ??;
    Repo.getRepoByClientId(clientId)
      .then(function (repoModel) {
        req.repoModel = repoModel;
        return next();
      });
  },
  insertOrUpdateRepoUser: function (req, res, next) {
    var repoModel = req.repoModel;
    var verificationCode = Weimi.generateVerificationCode();
    var user = {
      mobile: req.body.mobile,
      verificationCode: verificationCode
    };
    repoModel.insertOrUpdate(user)
      .then(function () {
        req.verificationCode = verificationCode;
        next();
      });
  },
  sendSMS: function (req, res, next) {
    var mobile = req.body.mobile;
    var verificationCode = req.verificationCode;
    // for now we can only send by cid, can not send customize cotent yet
    Weimi.sendSMSByCid(mobile, verificationCode)
      .then(function () {
        req.msg = '发送短信成功';
      })
      .catch(function () {
        req.msg = '发送短信失败';
      })
      .finally(function () {
        next();
      });
  },

  verifyCode: function (req, res, next) {
    if (req.body.action != 'verify-code') {
      return next();
    }

    var mobile = req.body.mobile;
    var data = {
      mobile: mobile
    };

    return compose()
      .use(this.getRepoByClientId)
      .use(this.validateVerificationCode)
      .use(this.getUserJwt)
      .use(function (req, res, next) {
        data.msg = req.msg;
        if (req.jwt) {
          data.jwt = req.jwt;
        }
        return res.render('tenant/login', data);
      });
  },
  validateVerificationCode: function (req, res, next) {
    var repoModel = req.repoModel;
    var verificationCode = req.body.verificationCode;
    var mobile = req.body.mobile;
    repoModel.getByMobile(mobile)
      .then(function (user) {
        if (user.verificationCode != verificationCode) {
          req.msg = '验证码错误';
        }

        return next();
      });
  },
  getUserJwt: function (req, res, next) {
    //contain err, jump out of here
    if (req.msg) {
      return next();
    }

    var clientId = req.query.clientId;
    Application.getClientSecretByClientId(clientId)
      .then(function (clientSecret) {
        var mobile = req.body.mobile;
        var token = auth.signTokenForApplicationUser(clientId, clientSecret, mobile);
        req.jwt = token;
        return next();
      });
  }
};

// inherit from ParamController
TenantController.prototype = _.create(ParamController.prototype, TenantController.prototype);
