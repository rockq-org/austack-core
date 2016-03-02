/**
 * Module for the controller definition of the user api.
 * The UserController is handling /api/users requests.
 * @module {user:controller~UserController} user:controller
 * @requires {@link module:config}
 * @requires {@link ParamController}
 */
'use strict';

var _ = require('lodash');
var shortid = require('shortid');
var ParamController = require('../../lib/controllers/param.controller');
var config = require('../../config');
var SMS = require('../../services/sms/index');
var Shape = require('../shape/shape.proxy');
var Repo = require('../repo/repo.proxy');
var util = require('util');
var auth = require('../../lib/auth/auth.service');
var ccap = require('ccap');
var InvitationCode = require('./invitationCode.model.js').model;
var AppModel = require('../application/application.model');

/**
 * The User model instance
 * @type {user:model~User}
 */
var User = require('./user.model').model;

exports = module.exports = UserController;

/**
 * UserController constructor
 * @classdesc Controller that handles /api/users route requests
 * for the user api.
 * Uses the 'id' parameter and the 'user' request property
 * to operate with the [main user API Model]{@link user:model~User} model.
 * @constructor
 * @inherits ParamController
 * @see user:model~User
 */
function UserController(router) {
  ParamController.call(this, User, 'id', 'userDocument', router);
  this.select = ['-salt', '-hashedPassword'];
  this.omit = ['salt', 'hashedPassword'];
  this.defaultReturn = 'profile';
}

UserController.prototype = {

  /**
   * Set our own constructor property for instanceof checks
   * @private
   */
  constructor: UserController,

  create: function (req, res) {
    var self = this;
    var mobile = req.body['mobile'];
    //var mobile = name;
    var now = new Date();
    // 四位数字验证码
    var verifyCode = SMS.generateVerificationCode();
    req.body['verifyCode'] = verifyCode;
    req.body['verifyCodeExpiredAt'] = new Date(now.valueOf() + 60000 * 3);
    req.body['verifyCodeLatestSendTime'] = now;

    req.body['password'] = 'password'; // moogose need this field or we can not create new user
    req.body['role'] = 'admin'; // should be set or maybe user make it to be root

    var invitationCode = req.body['invitationCode'];

    this.model.create(req.body, function (err, document) {
      if (err) {
        return res.handleError(err);
      }

      var sendData = {
        mobile: mobile,
        appName: '开发者注册',
        verifyCode: verifyCode,
        period: 3
      };

      var logData = {
        content: '', //only get this in the sms send
        status: '', // only get this valude after sms send
        type: 'system',
        mobile: sendData.mobile,
        clientId: 'system',
        appUserId: document._id,
        ownerId: 'system'
      };

      SMS.sendVerificationCode(sendData, logData)
        .then(function () {
          InvitationCode.remove({
            invitationCode: invitationCode
          }, function (err) {
            if (err) {
              return res.handleError(err);
            }

            return res.created(self.getResponseObject(document));
          });
        }).fail(function (err) {
          return res.handleError(err);
        });
    });
  },

  validateCaptcha: function (req, res, next) {
    if (process.env.NODE_ENV === 'development')
      return next();

    var sessCaptcha = (req.session.captcha || '').toLowerCase();
    var captcha = (req.body.captcha || '').toLowerCase();

    logger.log(captcha, sessCaptcha);
    if (captcha == '' || sessCaptcha !== captcha) {
      return res.forbidden({
        type: 'captcha not validate'
      });
    }

    return next();
  },

  validateInvitationCode: function (req, res, next) {
    if (process.env.NODE_ENV === 'development')
      return next();
    var invitationCode = req.body.invitationCode;

    if (invitationCode == '') {
      return res.forbidden({
        type: 'invitation code not validate'
      });
    }

    InvitationCode.findOne({
      invitationCode: invitationCode
    }, function (err, data) {
      if (err) {
        return res.handleError(err);
      }
      if (!data) {
        return res.forbidden({
          type: 'invitation code not validate'
        });
      }

      return next();
    });
  },

  captcha: function (req, res) {
    var captcha = ccap().get();
    req.session.captcha = captcha[0];
    logger.log(captcha[0]);
    res.send(captcha[1]);
  },

  resendVerifyCode: function (req, res) {
    var self = this;
    if (!req.body.mobile) {
      return res.badRequest();
    }
    var params = {
      'mobile': req.body.mobile
    };

    this.model.findOne(params, function (err, user) {
      logger.log(err, user);
      if (err || user == null) {
        return res.forbidden({
          message: 'user do not exist'
        });
      }

      var now = new Date();
      var timeSpan = now - user.verifyCodeLatestSendTime;
      if (timeSpan < (+60) * 1000) {
        return res.forbidden({
          message: 'please resend after 60 seconds'
        });
      }
      var verifyCode = SMS.generateVerificationCode();
      user.verifyCodeLatestSendTime = now;
      user.verifyCodeExpiredAt = new Date(now.valueOf() + 60000 * 3);
      user.verifyCode = verifyCode;

      var sendData = {
        mobile: user.mobile,
        appName: '开发者注册',
        verifyCode: verifyCode,
        period: 3
      };

      var logData = {
        content: '', //only get this in the sms send
        status: '', // only get this valude after sms send
        type: 'system-resend',
        mobile: sendData.mobile,
        clientId: 'system',
        appUserId: user._id,
        ownerId: 'system'
      };
      SMS.sendVerificationCode(sendData, logData)
        .then(function () {
          user.save(function (err) {
            if (err) {
              return res.handleError(err);
            }
            return res.noContent();
          });
        }).fail(function (err) {
          return res.handleError(err);
        });
    });
  },

  verifyMobile: function (req, res) {
    if (!req.body.mobile) {
      return res.badRequest();
    }
    var verifyCode = String(req.body.verifyCode);

    this.model.findOne({
      'mobile': req.body.mobile
    }, function (err, user) {
      if (user.verifyCode !== verifyCode) {
        return res.forbidden({
          message: "Verify Code Not Correct"
        });
      }

      var now = new Date();
      logger.log(user.verifyCodeExpiredAt, now, user.verifyCodeExpiredAt < now);
      if (user.verifyCodeExpiredAt < now) {
        return res.forbidden({
          message: "Verify Code Is Expired"
        });
      }

      var token = auth.signToken(user._id, 'admin');

      // Create User Shape & Repo after account is activated.
      // assume user is not active and not verified before.
      if ((!user.active) && (!user.isVerified)) {
        logger.debug('create Shape for this Dave.');
        Shape.create({
            name: util.format('repo_%s', shortid.generate()),
            ownerId: user._id,
            type: '_local_',
            mSchema: config.mSchema
          })
          .then(function (shape) {
            logger.debug('create Repo for this Dave.');
            return Repo.create(shape);
          })
          .then(function (name) {
            user.isVerified = true;
            user.active = true;
            user.repos.push(name);
            user.save(function (err, result) {
              if (err) {
                return res.handleError(err);
              } else {
                res.ok({
                  token: token
                });
              }
            });
          })
          .fail(function (err) {
            return res.handleError(err);
          })
      } else {
        return res.ok({
          token: token
        });
      }

    });
  },

  submitUserDetail: function (req, res) {
    var name = String(req.body.name);
    var mobile = String(req.body.mobile);
    var password = String(req.body.password);

    // var userIdReg = /^[a-zA-Z0-9\-]{1,}[a-zA-Z0-9]$/; //字母数字及“-”并以字母数字结尾

    // if (!userIdReg.test(userId)) {
    //   return res.badRequest({
    //     type: 'formatInvalidate',
    //     message: 'userId format is invalidate'
    //   });
    // }

    if (mobile != String(req.userInfo.mobile)) {
      return res.forbidden({
        message: "permission deny, you are not the user " + name
      });
    }

    this.model.findOne({
      'mobile': mobile
    }, function (err, user) {
      if (err) {
        return res.handleError(err);
      }
      user.name = name;
      user.password = password;

      user.save(function (err) {
        logger.log(err, user);
        if (err) {
          return res.handleError(err);
        }
        return res.noContent();
      });
    });
  },

  setNewPassword: function (req, res) {
    var mobile = String(req.body.mobile);
    var password = String(req.body.password);

    if (mobile != String(req.userInfo.mobile)) {
      return res.forbidden({
        message: "permission deny, you are not the user " + name
      });
    }

    this.model.findOne({
      'mobile': mobile
    }, function (err, user) {
      if (err) {
        return res.handleError(err);
      }
      user.password = password;

      user.save(function (err) {
        if (err) {
          return res.handleError(err);
        }
        return res.noContent();
      });
    });
  },

  /**README
   * Replaces an existing user password in the DB using the request body
   * property named 'password'. Should be an admin only route.
   * @param {IncomingMessage} req - The request message object
   * @param {ServerResponse} res - The outgoing response object
   * @returns {ServerResponse} The updated document or NOT FOUND if no document has been found
   */
  setPassword: function (req, res) {
    // check for a user id
    if (!req[this.paramName]._id) {
      return res.badRequest();
    }

    req[this.paramName].password = req.body.password;
    delete req.body.password;

    req[this.paramName].save(function (err) {
      if (err) {
        return res.handleError(err);
      }
      return res.noContent();
    });
  },

  /**
   * Change the password of a user in the DB. The 'oldPassword' and 'newPassword' property of the
   * request body are used.
   * @param {IncomingMessage} req - The request message object containing the 'oldPassword' and 'newPassword' property
   * @param {ServerResponse} res - The outgoing response object
   * @param {function} next - The next handler function
   * @returns {ServerResponse} The response status OK or FORBIDDEN if an error occurs
   */
  changePassword: function (req, res, next) {
    var userId = req[this.paramName]._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    this.model.findOne({
      '_id': userId
    }, function (err, user) {
      if (user.authenticate(oldPass)) {
        user.password = newPass;

        user.save(function (err) {
          if (err) {
            return res.handleError(err);
          }
          return res.noContent();
        });
      } else {
        res.forbidden();
      }
    });
  },

  /**
   * Get the authenticated user for the current request.
   * The requested user id is read from the userInfo parameter of the request object.
   * @param {IncomingMessage} req - The request message object the user object is read from
   * @param {ServerResponse} res - The outgoing response object
   * @param {function} next - The next handler function
   * @returns {ServerResponse} The virtual 'profile' of this user or UNAUTHORIZED if no document has been found
   */
  me: function (req, res, next) {
    if (!req.userInfo) {
      return res.unauthorized();
    }

    return res.ok(req.userInfo.profile);
  },

  /**
   * Authentication callback function, redirecting to '/'.
   * @param {IncomingMessage} req - The request message object
   * @param {ServerResponse} res - The outgoing response object that is redirected
   */
  authCallback: function (req, res) {
    res.redirect('/');
  }
};

UserController.prototype = _.create(ParamController.prototype, UserController.prototype);
