/**
 * An module for defining and initializing the InvitationCode model.
 * Exporting the InvitationCode model definition, schema and model instance.
 * @module {Object} loginRecord:model
 * @property {Object} definition - The [definition object]{@link loginRecord:model~InvitationCodeDefinition}
 * @property {MongooseSchema} schema - The [mongoose model schema]{@link loginRecord:model~InvitationCodeSchema}
 * @property {MongooseModel} model - The [mongoose model]{@link loginRecord:model~InvitationCode}
 */
'use strict';

var mongoose = require('mongoose');
var requestContext = require('mongoose-request-context');
var createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;

/**
 * The InvitationCode model definition
 * @type {Object}
 * @property {String} name - The name of this loginRecord
 * @property {String} info - Details about this loginRecord
 * @property {Boolean} active - Flag indicating this loginRecord is active
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
// InvitationCodeSchema
//   .path('name')
//   .validate(validateUniqueName, 'The specified name is already in use.');

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
   * @see loginRecord:InvitationCodeModel~InvitationCodeDefinition
   */
  definition: InvitationCodeDefinition,

  /**
   * The InvitationCode model schema
   * @type {MongooseSchema}
   * @see loginRecord:model~InvitationCodeSchema
   */
  schema: InvitationCodeSchema,

  /**
   * The InvitationCode model instance
   * @type {loginRecord:model~InvitationCode}
   */
  model: InvitationCode

};

/**
 * Validate the uniqueness of the given name
 *
 * @api private
 * @param {String} value - The username to check for uniqueness
 * @param {Function} respond - The callback function
 */
// function validateUniqueName(value, respond) {
//   // jshint validthis: true
//   var self = this;

//   // check for uniqueness of user name
//   this.constructor.findOne({
//     name: value
//   }, function (err, loginRecord) {
//     if (err) {
//       throw err;
//     }

//     if (loginRecord) {
//       // the searched name is my name or a duplicate
//       return respond(self.id === loginRecord.id);
//     }

//     respond(true);
//   });
// }