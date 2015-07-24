/**
 * Module for the controller definition of the loginRecord api.
 * The LoginRecordController is handling /api/loginRecords requests.
 * @module {loginRecord:controller~LoginRecordController} loginRecord:controller
 * @requires {@link ParamController}
 */
'use strict';

module.exports = LoginRecordController;

var ParamController = require('../../lib/controllers/param.controller');

/**
 * The LoginRecord model instance
 * @type {loginRecord:model~LoginRecord}
 */
var LoginRecord = require('./loginRecord.model').model;

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

  addRecord: function (data) {
    this.model.create(data, function (err, document) {
      if (err) {
        logger.log(err);
      }
    });
  }

};

// inherit from ParamController
LoginRecordController.prototype = Object.create(ParamController.prototype);