/**
 * An module for defining and initializing the LoginRecord model.
 * Exporting the LoginRecord model definition, schema and model instance.
 * @module {Object} loginRecord:model
 * @property {Object} definition - The [definition object]{@link loginRecord:model~LoginRecordDefinition}
 * @property {MongooseSchema} schema - The [mongoose model schema]{@link loginRecord:model~LoginRecordSchema}
 * @property {MongooseModel} model - The [mongoose model]{@link loginRecord:model~LoginRecord}
 */
'use strict';

var mongoose = require('mongoose');
var requestContext = require('mongoose-request-context');
var createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;

/**
 * The LoginRecord model definition
 * @type {Object}
 * @property {String} name - The name of this loginRecord
 * @property {String} info - Details about this loginRecord
 * @property {Boolean} active - Flag indicating this loginRecord is active
 */
var LoginRecordDefinition = {
	name: {type: String, required: true},
	info: String,
	active: Boolean
};

/**
 * The LoginRecord model schema
 * @type {MongooseSchema}
 */
var LoginRecordSchema = new mongoose.Schema(LoginRecordDefinition);

/**
 * Attach security related plugins
 */
LoginRecordSchema.plugin(createdModifiedPlugin);

LoginRecordSchema.plugin(requestContext, {
	propertyName: 'modifiedBy',
	contextPath: 'request:acl.user.name'
});

/**
 * Validations
 */
LoginRecordSchema
	.path('name')
	.validate(validateUniqueName, 'The specified name is already in use.');

/**
 *  The registered mongoose model instance of the LoginRecord model
 *  @type {LoginRecord}
 */
var LoginRecord = mongoose.model('LoginRecord', LoginRecordSchema);

module.exports = {

	/**
	 * The LoginRecord model definition object
	 * @type {Object}
	 * @see loginRecord:LoginRecordModel~LoginRecordDefinition
	 */
	definition: LoginRecordDefinition,

	/**
	 * The LoginRecord model schema
	 * @type {MongooseSchema}
	 * @see loginRecord:model~LoginRecordSchema
	 */
	schema: LoginRecordSchema,

	/**
	 * The LoginRecord model instance
	 * @type {loginRecord:model~LoginRecord}
	 */
	model: LoginRecord

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
	this.constructor.findOne({name: value}, function (err, loginRecord) {
		if (err) {
			throw err;
		}

		if (loginRecord) {
			// the searched name is my name or a duplicate
			return respond(self.id === loginRecord.id);
		}

		respond(true);
	});
}
