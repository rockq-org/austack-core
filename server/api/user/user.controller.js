/**
 * Module for the controller definition of the user api.
 * The UserController is handling /api/users requests.
 * @module {user:controller~UserController} user:controller
 * @requires {@link module:config}
 * @requires {@link ParamController}
 */
'use strict';

var _ = require('lodash');
var ParamController = require('../../lib/controllers/param.controller');
var config = require('../../config');
var Weimi = require('../../lib/weimi/index');
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
    var name = req.body['name'];
    var expiredTimeSpan = 60000 * 3; // three minutes
    // 四位数字验证码
    var verifyCode = Math.floor(Math.random() * (9999 - 1000) + 1000);
    req.body['verifyCode'] = verifyCode;
    req.body['verifyCodeExpiredAt'] = new Date(new Date().valueOf() + expiredTimeSpan);

    req.body['password'] = 'password'; // moogose need this field or we can not create new user

    this.model.create(req.body, function (err, document) {
      if (err) {
        return res.handleError(err);
      }

      Weimi.sendVerifyCode(name, verifyCode)
        .then(function () {
          return res.created(self.getResponseObject(document));
        }).fail(function (err) {
          return res.handleError(err);
        });
    });
  },

  verifyMobile: function (req, res) {
    if (!req[this.paramName]._id) {
      return res.badRequest();
    }
    var _id = req[this.paramName]._id;
    var verifyCode = String(req.body.verifyCode);

    this.model.findOne({
      '_id': _id
    }, function (err, user) {
      if (user.verifyCode !== verifyCode) {
        return res.forbidden({
          message: "Verify Code Not Correct"
        });
      }

      if (user.verifyCodeExpiredAt < new Date()) {
        return res.forbidden({
          message: "Verify Code Is Expired"
        });
      }

      user.isVerified = true;
      user.active = true;
      user.save(function (err) {
        if (err) {
          return res.handleError(err);
        }
        return res.noContent();
      });
    });
  },

  submitUserDetail: function (req, res) {
    if (!req[this.paramName]._id) {
      return res.badRequest();
    }
    var _id = req[this.paramName]._id;
    var userId = String(req.body.userId);
    var password = String(req.body.password);

    var userIdReg = /^[a-zA-Z0-9\-]{1,}[a-zA-Z0-9]$/; //字母数字及“-”并以字母数字结尾

    if (!userIdReg.test(userId)) {
      return res.badRequest({
        type: 'formatInvalidate',
        message: 'userId format is invalidate'
      });
    }

    this.model.findOne({
      '_id': _id
    }, function (err, user) {
      if (err) {
        return res.handleError(err);
      }
      user.userId = userId;
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
