/**
 * An module for defining and initializing the Tenant model.
 * Exporting the Tenant model definition, schema and model instance.
 * @module {Object} tenant:model
 * @property {Object} definition - The [definition object]{@link tenant:model~TenantDefinition}
 * @property {Schema} schema - The [mongoose model schema]{@link tenant:model~TenantSchema}
 * @property {Model} model - The [mongoose model]{@link tenant:model~Tenant}
 */
'use strict';

var mongoose = require('mongoose');
var MongooseError = require('mongoose/lib/error');
var crypto = require('crypto');
var requestContext = require('mongoose-request-context');
var createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;
var auth = require('../../lib/auth/auth.service');

var Schema = mongoose.Schema;

/**
 * The Tenant model definition
 * @type {Object}
 * @property {String} name - The name of this tenant
 * @property {String} role - The role of this tenant, defaults to 'tenant'
 * @property {String} info - Information and notes about this tenant
 * @property {Boolean} active - Flag indicating this tenant is active
 * @property {String} hashedPassword - The hashed password of this tenant
 * @property {String} provider - The authentication provider used by this tenant account
 * @property {String} salt - Salt used to build the password
 */
var TenantDefinition = {
  mobile: {
    type: String,
    required: true
  },
  hashedPassword: String,
  salt: String,
  userId: String,
  signupAt: {
    type: Date,
    default: Date.now
  },
  verifyCode: String,
  verifyCodeExpiredAt: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  }
};

/**
 * The Tenant model schema
 * @type {Schema}
 */
var TenantSchema = new Schema(TenantDefinition);

/*
 * Virtual definitions
 */

/**
 * Virtual 'password'
 * Used for getting and setting the internal hashedPassword property
 * @memberOf TenantSchema
 */
TenantSchema
  .virtual('password')
  .set(setPassword)
  .get(getPassword);

/**
 * Virtual 'profile'
 * Public profile information
 * @memberOf TenantSchema
 */
TenantSchema
  .virtual('profile')
  .get(getProfile);

/**
 * Virtual 'token'
 * Non-sensitive info we'll be putting in the token
 * @memberOf TenantSchema
 */
TenantSchema
  .virtual('token')
  .get(getToken);

/**
 * Validations
 */

// Validate mobile is not taken
TenantSchema
  .path('mobile')
  .validate(validateUniqueMobile, 'The specified mobile is already in use.');

// Validate mobile is not taken
TenantSchema
  .path('userId')
  .validate(validateUniqueUserId, 'The specified userId is already in use.');

// Validate unique root tenant
// TenantSchema
//   .path('role')
//   .validate(validateUniqueRoot, 'There can only be one tenant with the maximum role');

// Validate empty password
TenantSchema
  .path('hashedPassword')
  .validate(validateHashedPassword, 'Password cannot be blank');

/**
 * Additional instance methods
 */

/**
 * Authenticate - check if the password is correct
 *
 * @param {String} plainText
 * @return {Boolean}
 * @api public
 */
TenantSchema.methods.authenticate = function authenticate(plainText) {
  return this.encryptPassword(plainText) === this.hashedPassword;
};

/**
 * Make salt
 *
 * @return {String}
 * @api public
 */
TenantSchema.methods.makeSalt = function makeSalt() {
  return crypto.randomBytes(16).toString('base64');
};

/**
 * Encrypt password
 *
 * @param {String} password
 * @return {String}
 * @api public
 */
TenantSchema.methods.encryptPassword = function encryptPassword(password) {
  if (!password || !this.salt) {
    return '';
  }

  var salt = new Buffer(this.salt, 'base64');
  return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
};

/**
 * Static methods
 */

/**
 * Return the root tenant document
 * @param {Function} cb - The callback function
 * @returns {*}
 */
TenantSchema.statics.getRoot = function (cb) {
  this.findOne({
    role: auth.roles.getMaxRole()
  }, cb);
};

/**
 * Attach pre hook plugins
 */
TenantSchema.plugin(requestContext, {
  propertyName: 'modifiedBy',
  contextPath: 'request:acl.tenant.name'
});

/**
 * Attach pre-save and pre-remove hooks
 *
 * @api private
 */
// TenantSchema
//   .pre('save', preSave)
//   .pre('remove', preRemove);

/**
 * Attach post hook plugins
 */
TenantSchema.plugin(createdModifiedPlugin);

/**
 * Set the virtual password property
 *
 * @api private
 * @param {String} password - The tenant password to set
 */
function setPassword(password) {
  // jshint validthis: true
  this._password = password;
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(password);
}

/**
 * Get the value of the virtual password property
 *
 * @api private
 * @returns {String|*} The value of the virtual password property
 */
function getPassword() {
  // jshint validthis: true
  return this._password;
}

/**
 * Return the value of the virtual profile property
 *
 * @api private
 * @returns {{_id: *, name: *, prename: *, surname: *, email: *, active: *, role: *, info: *}}
 */
function getProfile() {
  // jshint validthis: true
  return {
    '_id': this._id,
    'name': this.name,
    'active': this.active,
    'role': this.role,
    'info': this.info
  };
}

/**
 * Return the value of the virtual token property
 *
 * @api private
 * @returns {{_id: *, role: *}}
 */
function getToken() {
  // jshint validthis: true
  return {
    '_id': this._id,
    'role': this.role
  };
}

/**
 * Check if the hashed password is specified.
 *
 * @api private
 * @param {String} hashedPassword
 * @returns {Boolean} True if the hashed password has a length
 */
function validateHashedPassword(hashedPassword) {
  return hashedPassword.length;
}

/**
 * Check existence and length of the given value.
 *
 * @api private
 * @param {String} value - The value to check
 * @returns {Boolean} True if a value with a truthy length property is given
 */
function validatePresenceOf(value) {
  return value && value.length;
}

/**
 * Validate the uniqueness of the given mobile
 *
 * @api private
 * @param {String} value - The mobile to check for uniqueness
 * @param {Function} respond - The callback function
 */
function validateUniqueMobile(value, respond) {
  // jshint validthis: true
  var self = this;

  // check for uniqueness of tenant name
  this.constructor.findOne({
    mobile: value
  }, function (err, tenant) {
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

/**
 * Validate the uniqueness of the given userId
 *
 * @api private
 * @param {String} value - The tenantname to check for uniqueness
 * @param {Function} respond - The callback function
 */
function validateUniqueUserId(value, respond) {
  // jshint validthis: true
  var self = this;

  // check for uniqueness of tenant name
  this.constructor.findOne({
    userId: value
  }, function (err, tenant) {
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

/**
 * Check the uniqueness of the root role (the maximum role)
 * @api private
 * @param {String} newRole - The role name to save
 * @param {Function} respond - The callback function
 * @returns {*}
 */
function validateUniqueRoot(newRole, respond) {
  // jshint validthis: true
  var self = this;

  // attempt to create a root tenant
  if (auth.roles.isRoot(newRole)) {
    // check for an existing root tenant
    self.constructor.getRoot(function (err, rootTenant) {
      if (err) {
        throw err;
      }

      if (rootTenant) {
        // found a root tenant, if it is me everything is ok
        return respond(self.id === rootTenant.id);
      }

      // there is no root tenant yet (should only be true once)
      respond(true);

    });
  } else {
    // any other role can be set
    respond(true);
  }
}

/**
 * Pre save hook for the Tenant model. Validates the existence of the
 * hashedPassword property if the document is saved for the first time.
 * Ensure that only the root tenant can update itself.
 *
 * @api private
 * @param {Function} next - The mongoose middleware callback
 * @returns {*} If an error occurs the passed callback with an Error as its argument is called
 */
function preSave(next) {
  // jshint validthis: true
  var self = this;

  if (this.isNew && !validatePresenceOf(this.hashedPassword)) {
    return next(new MongooseError.ValidationError('Missing password'));
  }

  // check if the root tenant should be updated
  // return an error if some not root tries to touch the root document
  self.constructor.getRoot(function (err, rootTenant) {
    if (err) {
      throw err;
    }

    // will we update the root tenant?
    if (rootTenant && self.id === rootTenant.id) {

      // delete the role to prevent loosing the root status
      delete self.role;

      // get the tenant role to check if a root tenant will perform the update
      var tenantRole = self.getContext('request:acl.tenant.role');
      if (!tenantRole) { // no tenant role - no root tenant check
        return next();
      }

      if (!auth.roles.isRoot(tenantRole)) {
        // return error, only root can update root
        return next(new MongooseError.ValidationError('Forbidden root update request'));
      }
    }

    // normal tenant update
    return next();
  });
}

/**
 * Pre remove hook for the Tenant model.
 * Validates that the root tenant cannot be deleted.
 *
 * @api private
 * @param {Function} next - The mongoose middleware callback
 * @returns {*} If an error occurs the passed callback with an Error as its argument is called
 */
function preRemove(next) {
  // jshint validthis: true
  if (auth.roles.isRoot(this.role)) {
    return next(new MongooseError.ValidationError(auth.roles.getMaxRole() + ' role cannot be deleted'));
  }

  return next();
}

module.exports = {

  /**
   * The Tenant model definition object
   * @type {Object}
   * @see tenant:TenantModel~TenantDefinition
   */
  definition: TenantDefinition,

  /**
   * The Tenant model schema
   * @type {Schema}
   * @see tenant:model~TenantSchema
   */
  schema: TenantSchema,

  /**
   *  The registered mongoose model instance of the Tenant model
   *  @type {Tenant}
   */
  model: mongoose.model('Tenant', TenantSchema)
};
