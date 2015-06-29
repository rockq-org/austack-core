/**
 * An module for defining and initializing the App model.
 * Exporting the App model definition, schema and model instance.
 * @module {Object} app:model
 * @property {Object} definition - The [definition object]{@link app:model~AppDefinition}
 * @property {MongooseSchema} schema - The [mongoose model schema]{@link app:model~AppSchema}
 * @property {MongooseModel} model - The [mongoose model]{@link app:model~App}
 */
'use strict';

var mongoose = require('mongoose');
var requestContext = require('mongoose-request-context');
var createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;

/**
 * The App model definition
 * @type {Object}
 * @property {String} name - The name of this app
 * @property {String} info - Details about this app
 * @property {Boolean} active - Flag indicating this app is active
 */
var AppDefinition = {
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
 * The App model schema
 * @type {MongooseSchema}
 */
var AppSchema = new mongoose.Schema(AppDefinition);

/**
 * Attach security related plugins
 */
AppSchema.plugin(createdModifiedPlugin);

AppSchema.plugin(requestContext, {
  propertyName: 'modifiedBy',
  contextPath: 'request:acl.user.name'
});

/**
 * Validations
 */
AppSchema
  .path('appName')
  .validate(validateUniqueName, 'The specified appName is already in use.');

/**
 *  The registered mongoose model instance of the App model
 *  @type {App}
 */
var App = mongoose.model('App', AppSchema);

module.exports = {

  /**
   * The App model definition object
   * @type {Object}
   * @see app:AppModel~AppDefinition
   */
  definition: AppDefinition,

  /**
   * The App model schema
   * @type {MongooseSchema}
   * @see app:model~AppSchema
   */
  schema: AppSchema,

  /**
   * The App model instance
   * @type {app:model~App}
   */
  model: App

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
  }, function (err, app) {
    if (err) {
      throw err;
    }

    if (app) {
      // the searched name is my name or a duplicate
      return respond(self.id === app.id);
    }

    respond(true);
  });
}
