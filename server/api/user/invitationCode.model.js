/**
 * An module for defining and initializing the InvitationCode model.
 * Exporting the InvitationCode model definition, schema and model instance.
 * @module {Object} invitationCode:model
 * @property {Object} definition - The [definition object]{@link invitationCode:model~InvitationCodeDefinition}
 * @property {MongooseSchema} schema - The [mongoose model schema]{@link invitationCode:model~InvitationCodeSchema}
 * @property {MongooseModel} model - The [mongoose model]{@link invitationCode:model~InvitationCode}
 */
'use strict';

var mongoose = require('mongoose');
var requestContext = require('mongoose-request-context');
var createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;

/**
 * The InvitationCode model definition
 * @type {Object}
 * @property {String} name - The name of this invitationCode
 * @property {String} info - Details about this invitationCode
 * @property {Boolean} active - Flag indicating this invitationCode is active
 */
var InvitationCodeDefinition = {
  invitationCode: String
};

/**
 * The InvitationCode model schema
 * @type {MongooseSchema}
 */
var InvitationCodeSchema = new mongoose.Schema(InvitationCodeDefinition);

/**
 * Attach security related plugins
 */
InvitationCodeSchema.plugin(createdModifiedPlugin);

InvitationCodeSchema.plugin(requestContext, {
  propertyName: 'modifiedBy',
  contextPath: 'request:acl.user.name'
});

/**
 * Validations
 */
InvitationCodeSchema
  .path('invitationCode')
  .validate(validateUniqueInvitationCode, 'The specified invitationCode is already in use.');

/**
 *  The registered mongoose model instance of the InvitationCode model
 *  @type {InvitationCode}
 */
var InvitationCode;
if (mongoose.models.InvitationCode) {
  InvitationCode = mongoose.model('InvitationCode');
} else {
  InvitationCode = mongoose.model('InvitationCode', InvitationCodeSchema);
}

module.exports = {

  /**
   * The InvitationCode model definition object
   * @type {Object}
   * @see invitationCode:InvitationCodeModel~InvitationCodeDefinition
   */
  definition: InvitationCodeDefinition,

  /**
   * The InvitationCode model schema
   * @type {MongooseSchema}
   * @see invitationCode:model~InvitationCodeSchema
   */
  schema: InvitationCodeSchema,

  /**
   * The InvitationCode model instance
   * @type {invitationCode:model~InvitationCode}
   */
  model: InvitationCode

};

/**
 * Validate the uniqueness of the given invitationCode
 *
 * @api private
 * @param {String} value - The invitationCode to check for uniqueness
 * @param {Function} respond - The callback function
 */
function validateUniqueInvitationCode(value, respond) {
  // jshint validthis: true
  var self = this;

  // check for uniqueness of user invitationCode
  this.constructor.findOne({
    invitationCode: value
  }, function (err, invitationCode) {
    if (err) {
      throw err;
    }

    if (invitationCode) {
      // the searched invitationCode is my invitationCode or a duplicate
      return respond(self.id === invitationCode.id);
    }

    respond(true);
  });
}