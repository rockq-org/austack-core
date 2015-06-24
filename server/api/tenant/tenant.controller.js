/**
 * Module for the controller definition of the tenant api.
 * The TenantController is handling /api/tenant requests.
 * @module {tenant:controller~TenantController} tenant:controller
 * @requires {@link module:config}
 * @requires {@link ParamController}
 */
'use strict';

var _ = require('lodash');
var ParamController = require('../../lib/controllers/param.controller');
var config = require('../../config');

/**
 * The Tenant model instance
 * @type {tenant:model~Tenant}
 */
var Tenant = require('./tenant.model').model;

exports = module.exports = TenantController;

/**
 * TenantController constructor
 * @classdesc Controller that handles /api/tenant route requests
 * for the tenant api.
 * Uses the 'id' parameter and the 'tenant' request property
 * to operate with the [main tenant API Model]{@link tenant:model~Tenant} model.
 * @constructor
 * @inherits ParamController
 * @see tenant:model~Tenant
 */
function TenantController(router) {
  ParamController.call(this, Tenant, 'id', 'tenantDocument', router);
  this.select = ['-salt', '-hashedPassword'];
  this.omit = ['salt', 'hashedPassword'];
  this.defaultReturn = 'profile';
}

TenantController.prototype = {

  /**
   * Set our own constructor property for instanceof checks
   * @private
   */
  constructor: TenantController,

  create: function (req, res) {
    var self = this;
    var fiveMinutes = 60000 * 5;
    req.body['verifyCode'] = '1234';
    req.body['verifyCodeExpiredAt'] = new Date(new Date().valueOf() + fiveMinutes);

    this.model.create(req.body, function (err, document) {
      if (err) {
        return res.handleError(err);
      }

      return res.created(self.getResponseObject(document));
    });
  },

  // TODO: connect with jwt
  verifyMobile: function (req, res) {
    if (!req[this.paramName]._id) {
      return res.badRequest();
    }
    var tenantId = req[this.paramName]._id;
    var verifyCode = String(req.body.verifyCode);

    this.model.findOne({
      '_id': tenantId
    }, function (err, tenant) {
      if (tenant.verifyCode !== verifyCode) {
        return res.forbidden({
          message: "Verify Code Not Correct"
        });
      }

      // if (tenant.verifyCodeExpiredAt < new Date()) {
      //   return res.forbidden({
      //     message: "Verify Code Is Expired"
      //   });
      // }

      tenant.isVerified = true;
      tenant.save(function (err) {
        if (err) {
          return res.handleError(err);
        }
        return res.noContent();
      });
    });
  },

  // TODO: connect with jwt
  submitUserDetail: function (req, res) {
    if (!req[this.paramName]._id) {
      return res.badRequest();
    }
    var tenantId = req[this.paramName]._id;
    var userId = String(req.body.userId);
    var password = String(req.body.password);

    this.model.findOne({
      '_id': tenantId
    }, function (err, tenant) {
      if (err) {
        return res.handleError(err);
      }
      tenant.userId = userId;
      tenant.password = password;

      tenant.save(function (err) {
        if (err) {
          return res.handleError(err);
        }
        return res.noContent();
      });
    });
  },


  /**README
   * Replaces an existing tenant password in the DB using the request body
   * property named 'password'. Should be an admin only route.
   * @param {IncomingMessage} req - The request message object
   * @param {ServerResponse} res - The outgoing response object
   * @returns {ServerResponse} The updated document or NOT FOUND if no document has been found
   */
  setPassword: function (req, res) {
    // check for a tenant id
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
   * Change the password of a tenant in the DB. The 'oldPassword' and 'newPassword' property of the
   * request body are used.
   * @param {IncomingMessage} req - The request message object containing the 'oldPassword' and 'newPassword' property
   * @param {ServerResponse} res - The outgoing response object
   * @param {function} next - The next handler function
   * @returns {ServerResponse} The response status OK or FORBIDDEN if an error occurs
   */
  changePassword: function (req, res, next) {
    var tenantId = req[this.paramName]._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    this.model.findOne({
      '_id': tenantId
    }, function (err, tenant) {
      if (tenant.authenticate(oldPass)) {
        tenant.password = newPass;

        tenant.save(function (err) {
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
   * Get the authenticated tenant for the current request.
   * The requested tenant id is read from the tenantInfo parameter of the request object.
   * @param {IncomingMessage} req - The request message object the tenant object is read from
   * @param {ServerResponse} res - The outgoing response object
   * @param {function} next - The next handler function
   * @returns {ServerResponse} The virtual 'profile' of this tenant or UNAUTHORIZED if no document has been found
   */
  me: function (req, res, next) {
    if (!req.tenantInfo) {
      return res.unauthorized();
    }

    return res.ok(req.tenantInfo.profile);
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

TenantController.prototype = _.create(ParamController.prototype, TenantController.prototype);
