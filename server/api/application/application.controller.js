/**
 * Module for the controller definition of the application api.
 * The ApplicationController is handling /api/applications requests.
 * @module {application:controller~ApplicationController} application:controller
 * @requires {@link ParamController}
 */
'use strict';

module.exports = ApplicationController;

var _ = require('lodash');
var ParamController = require('../../lib/controllers/param.controller');
var roles = require('../../lib/auth/roles');

/**
 * The Application model instance
 * @type {application:model~Application}
 */
var Application = require('./application.model').model;

/**
 * ApplicationController constructor
 * @classdesc Controller that handles /api/applications route requests
 * for the application api.
 * Uses the 'applicationId' parameter and the 'applicationParam' request property
 * to operate with the [main application API Model]{@link application:model~Application} model.
 * @constructor
 * @inherits ParamController
 * @see application:model~Application
 */
function ApplicationController(router) {
  ParamController.call(this, Application, router);

  // modify select only properties
  // this.select = ['-__v'];

  // omit properties on update
  // this.omit = ['hashedPassword'];

  // property to return (maybe a virtual getter of the model)
  // this.defaultReturn = 'profile';
}

// define properties for the ApplicationController here
ApplicationController.prototype = {

  /**
   * Set our own constructor property for instanceof checks
   * @private
   */
  constructor: ApplicationController,

  create: function (req, res) {
    var self = this;
    req.body['ownerId'] = req.user._id;
    req.body['clientId'] = this.model.generateRandomObjectId();
    req.body['clientSecret'] = this.model.generateRandomObjectId();

    this.model.create(req.body, function (err, document) {
      if (err) {
        return res.handleError(err);
      }

      return res.created(self.getResponseObject(document));
    });
  },

  hasPermission: function (req, res) {
    if (req.userInfo.role == 'root') {
      return true;
    }
    var doc = req[this.paramName];
    if (doc.ownerId == req.userInfo._id) {
      return true;
    }

    return false;
  },
  show: function (req, res) {
    if (!req[this.paramName]) {
      return res.notFound();
    }
    if (req[this.paramName].isTrashed) {
      return res.notFound();
    }

    if (!this.hasPermission(req, res)) {
      return res.unauthorized();
    }
    return res.ok(this.getResponseObject(req[this.paramName]));
  },

  update: function (req, res) {
    if (req.body._id) {
      delete req.body._id;
    }
    if (!this.hasPermission(req, res)) {
      return res.unauthorized();
    }

    var self = this;
    var bodyData = _.omit(req.body, this.omit);
    var updated = _.merge(req[this.paramName], bodyData);

    updated.save(function (err) {
      if (err) {
        return res.handleError(err);
      }

      req[this.paramName] = updated;
      return res.ok(self.getResponseObject(updated));
    });
  },

  updateSmsTemplates: function (req, res) {
    var self = this;
    if (req.body._id) {
      delete req.body._id;
    }
    if (!this.hasPermission(req, res)) {
      return res.unauthorized();
    }
    var reg = / VERIFY_CODE /i;
    if (!req.body.type || !req.body.content || !reg.test(req.body.content)) {
      return res.badRequest({
        message: '必须包含"<% VERIFY_CODE %>"字段'
      });
    }

    req[this.paramName].smsTemplates[req.body.type] = req.body.content;
    var updated = req[this.paramName];

    updated.save(function (err) {
      if (err) {
        return res.handleError(err);
      }

      req[this.paramName] = updated;
      return res.ok(self.getResponseObject(updated));
    });
  },

  /**
   * Deletes an document from the DB using the request
   * property named {@link ParamController#paramName}.
   * @param {IncomingMessage} req - The request message object
   * @param {ServerResponse} res - The outgoing response object
   * @returns {ServerResponse} The response status 201 CREATED or an error response
   */
  destroy: function (req, res) {
    if (!this.hasPermission(req, res)) {
      return res.unauthorized();
    };

    req[this.paramName].isTrashed = true;

    req[this.paramName].save(function (err) {
      if (err) {
        return res.handleError(err);
      }

      return res.noContent();
    });
  },

  index: function (req, res) {
    var query = {
      'ownerId': req.userInfo._id,
      'isTrashed': false
    };

    if (roles.hasRole(req.userInfo.role, 'root')) {
      query = {
        'isTrashed': false
      };
    }

    this.model.paginate(
      query,
      this.getPaginateOptions(req),
      function (err, results, pageCount, itemCount) {
        if (err) {
          return res.handleError(err);
        }
        return res.ok(results);
      });
  }
};

// inherit from ParamController
ApplicationController.prototype = _.create(ParamController.prototype, ApplicationController.prototype);
