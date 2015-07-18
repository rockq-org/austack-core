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
  loginPost: function loginPost (req,res,next) {
    Helper.req = req;
    Helper.res = res;
    Helper.next = next;

    Helper.getApplication()
      .then(Helper.getRepoByClientId)
      .then(Helper.switchAction)
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

      Helper.req.application = application[0];
      d.resolve();
    });

    return d.promise;
  },
  getRepoByClientId: function () {
    var ownerId = Helper.req.application.ownerId;

    return User.getById(ownerId)
      .then(function (user) {
        logger.log(user);
        var shapeName = 'shape_' + user.userId;
        ShapeProxy.getShapeByName(shapeName)
          .then(function (shape) {
            Helper.req.shape = shape;
            Helper.req.repoModel = Repo.getModel(req.shape);
            logger.log( Helper.req.repoModel );
          });
      });
  },
  switchAction: function() {
    logger.log('switchAction');
    switch(Helper.req.body.action){
      case 'send-verification-code':
        logger.log('case send-verification-code');
        logger.log(Helper.sendVerificationCode);
        return Q.fcall(Helper.sendVerificationCode);
        break;
      case 'verify-code':
        logger.log('case verify-code');
        return Q.fcall(Helper.verifyCode);
        break;
    }
  },
  sendVerificationCode: function () {
    logger.log('sendVerificationCode');
    return Q.fcall(Helper.generateVerificationCode)
      .then(Helper.findAppUserAndSave)
      .then(Helper.insertAppUser)
      .then(Helper.sendSMS);
  },
  verifyCode: function () {
    logger.log('verifyCode');
    return Helper.validateVerificationCode()
            .then(Helper.getUserJwt);
  },

  generateVerificationCode: function () {
    var verificationCode = Weimi.generateVerificationCode();
    Helper.req.verificationCode = verificationCode;
  },
  findAppUserAndSave: function (req, res, next) {
    var repoModel = Helper.req.repoModel;
    var mobile = Helper.req.body.mobile;
    repoModel.find({ mobile: mobile }, function (err, appUser) {
      if(!appUser){
        return next();
      }
      Helper.req.appUser = appUser;
      appUser.verificationCode = Helper.req.verificationCode;
      appUser.save(function (err) {

        return next();
      })
    });
  },
  insertAppUser: function(req,res,next ){
    if(req.appUser){
      return next();
    }
    var repoModel = Helper.req.repoModel;
    var mobile = Helper.req.body.mobile;
    var verificationCode = Helper.req.verificationCode;
    var appUser = { mobile: mobile, verificationCode: verificationCode };

    repoModel.create( appUser, function (err) {
      return next();
    });
  },
  //done func at above

  sendSMS: function (req, res, next) {
    var mobile = Helper.req.body.mobile;
    var verificationCode = Helper.req.verificationCode;
    // for now we can only send by cid, can not send customize cotent yet
    Weimi.sendSMSByCid(mobile, verificationCode)
      .then(function () {
        Helper.req.msg = '发送短信成功';
      })
      .catch(function () {
        Helper.req.msg = '发送短信失败';
      })
      .finally(function () {
        next();
      });
  },


  validateVerificationCode: function (req, res, next) {
    var repoModel = Helper.req.repoModel;
    var verificationCode = Helper.req.body.verificationCode;
    var mobile = Helper.req.body.mobile;
    repoModel.getByMobile(mobile)
      .then(function (user) {
        if (user.verificationCode != verificationCode) {
          Helper.req.msg = '验证码错误';
        }

        return next();
      });
  },
  getUserJwt: function (req, res, next) {
    //contain err, jump out of here
    if (req.msg) {
      return next();
    }

    var clientId = Helper.req.query.clientId;
    Application.getClientSecretByClientId(clientId)
      .then(function (clientSecret) {
        var mobile = Helper.req.body.mobile;
        var token = auth.signTokenForApplicationUser(clientId, clientSecret, mobile);
        Helper.req.jwt = token;
        return next();
      });
  }
};

