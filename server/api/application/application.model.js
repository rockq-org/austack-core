/**
 * An module for defining and initializing the Application model.
 * Exporting the Application model definition, schema and model instance.
 * @module {Object} application:model
 * @property {Object} definition - The [definition object]{@link application:model~ApplicationDefinition}
 * @property {MongooseSchema} schema - The [mongoose model schema]{@link application:model~ApplicationSchema}
 * @property {MongooseModel} model - The [mongoose model]{@link application:model~Application}
 */
'use strict';

var mongoose = require('mongoose');
var requestContext = require('mongoose-request-context');
var createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;

/**
 * The Application model definition
 * @type {Object}
 * @property {String} name - The name of this application
 * @property {String} info - Details about this application
 * @property {Boolean} active - Flag indicating this application is active
 */
var ApplicationDefinition = {
  appName: {
    type: String,
    required: true
  },
  ownerId: String,
  clientId: String,
  clientSecret: String,
  jwtExpiration: {
    type: Number,
    default: 36000
  },
  callbackUrls: [String],
  corsDomains: [String]
};

/**
 * The Application model schema
 * @type {MongooseSchema}
 */
var ApplicationSchema = new mongoose.Schema(ApplicationDefinition);

/**
 * Attach security related plugins
 */
ApplicationSchema.plugin(createdModifiedPlugin);

ApplicationSchema.plugin(requestContext, {
  propertyName: 'modifiedBy',
  contextPath: 'request:acl.user.name'
});

/**
 * Validations
 */
ApplicationSchema
  .path('appName')
  .validate(validateUniqueName, 'The specified name is already in use.');

/**
 *  The registered mongoose model instance of the Application model
 *  @type {Application}
 */
var Application = mongoose.model('Application', ApplicationSchema);

module.exports = {

  /**
   * The Application model definition object
   * @type {Object}
   * @see application:ApplicationModel~ApplicationDefinition
   */
  definition: ApplicationDefinition,

  /**
   * The Application model schema
   * @type {MongooseSchema}
   * @see application:model~ApplicationSchema
   */
  schema: ApplicationSchema,

  /**
   * The Application model instance
   * @type {application:model~Application}
   */
  model: Application

};

/**
 * Validate the uniqueness of the given name
 *
 * @api private
 * @param {String} value - The username to check for uniqueness
 * @param {Function} respond - The callback function
 */
function validateUniqueName(value, respond) {
  // jshint validthis: true
  var self = this;

  // check for uniqueness of user name
  this.constructor.findOne({
    name: value
  }, function (err, application) {
    if (err) {
      throw err;
    }

    if (application) {
      // the searched name is my name or a duplicate
      return respond(self.id === application.id);
    }

    respond(true);
  });
}
