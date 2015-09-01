/**
 * An module for defining and initializing the Tenant model.
 * Exporting the Tenant model definition, schema and model instance.
 * @module {Object} tenant:model
 * @property {Object} definition - The [definition object]{@link tenant:model~TenantDefinition}
 * @property {MongooseSchema} schema - The [mongoose model schema]{@link tenant:model~TenantSchema}
 * @property {MongooseModel} model - The [mongoose model]{@link tenant:model~Tenant}
 */
'use strict';

var mongoose = require('mongoose');

/**
 * The Tenant model definition
 * @type {Object}
 * @property {String} name - The name of this tenant
 * @property {String} info - Details about this tenant
 * @property {Boolean} active - Flag indicating this tenant is active
 */
var TenantDefinition = {
	name: {type: String, required: true},
	info: String,
	active: Boolean
};

/**
 * The Tenant model schema
 * @type {MongooseSchema}
 */
var TenantSchema = new mongoose.Schema(TenantDefinition);

/**
 * Validations
 */
TenantSchema
	.path('name')
	.validate(validateUniqueName, 'The specified name is already in use.');

/**
 *  The registered mongoose model instance of the Tenant model
 *  @type {Tenant}
 */
var Tenant = mongoose.model('Tenant', TenantSchema);

module.exports = {

	/**
	 * The Tenant model definition object
	 * @type {Object}
	 * @see tenant:TenantModel~TenantDefinition
	 */
	definition: TenantDefinition,

	/**
	 * The Tenant model schema
	 * @type {MongooseSchema}
	 * @see tenant:model~TenantSchema
	 */
	schema: TenantSchema,

	/**
	 * The Tenant model instance
	 * @type {tenant:model~Tenant}
	 */
	model: Tenant

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
	this.constructor.findOne({name: value}, function (err, tenant) {
		if (err) {
			throw err;
		}

		if (tenant) {
			// the searched name is my name or a duplicate
			return respond(self.id === tenant.id);
		}

		respond(true);
	});
}
