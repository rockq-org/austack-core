/**
 * An module for defining and initializing the SmsRecord model.
 * Exporting the SmsRecord model definition, schema and model instance.
 * @module {Object} smsRecord:model
 * @property {Object} definition - The [definition object]{@link smsRecord:model~SmsRecordDefinition}
 * @property {MongooseSchema} schema - The [mongoose model schema]{@link smsRecord:model~SmsRecordSchema}
 * @property {MongooseModel} model - The [mongoose model]{@link smsRecord:model~SmsRecord}
 */
'use strict';

var mongoose = require('mongoose');
var requestContext = require('mongoose-request-context');
var createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;
var Q = require('q');

/**
 * The SmsRecord model definition
 * @type {Object}
 * @property {String} name - The name of this smsRecord
 * @property {String} info - Details about this smsRecord
 * @property {Boolean} active - Flag indicating this smsRecord is active
 */
var SmsRecordDefinition = {
  content: String, // sms content
  type: String, // system(dave), app(linda)
  mobile: String,
  clientId: String,
  ownerId: String,
  provider: String, // weimi, qiji
  status: String // success, failed
};

/**
 * The SmsRecord model schema
 * @type {MongooseSchema}
 */
var SmsRecordSchema = new mongoose.Schema(SmsRecordDefinition);

/**
 * Attach security related plugins
 */
SmsRecordSchema.plugin(createdModifiedPlugin);

SmsRecordSchema.plugin(requestContext, {
  propertyName: 'modifiedBy',
  contextPath: 'request:acl.user.name'
});

// {
//   content: String, // sms content
//   type: String, // system(dave), app(linda)
//   mobile: String,
//   clientId: String,
//   appUserId: String,
//   ownerId: String,
//   status: String // success, failed
// };
SmsRecordSchema.statics.insertSmsRecord = function (data) {
  var d = Q.defer();
  this.create(data, function (err, doc) {
    if (err) {
      logger.log(err, doc);
      return d.reject(err);
    }

    logger.log('insertSmsRecord success', doc);
    return d.resolve(doc);
  });

  return d.promise;
};

/**
 * Validations
 */
// SmsRecordSchema
//   .path('name')
//   .validate(validateUniqueName, 'The specified name is already in use.');

/**
 *  The registered mongoose model instance of the SmsRecord model
 *  @type {SmsRecord}
 */
var SmsRecord;
if (mongoose.models.SmsRecord) {
  SmsRecord = mongoose.model('SmsRecord');
} else {
  SmsRecord = mongoose.model('SmsRecord', SmsRecordSchema);
}

module.exports = {

  /**
   * The SmsRecord model definition object
   * @type {Object}
   * @see smsRecord:SmsRecordModel~SmsRecordDefinition
   */
  definition: SmsRecordDefinition,

  /**
   * The SmsRecord model schema
   * @type {MongooseSchema}
   * @see smsRecord:model~SmsRecordSchema
   */
  schema: SmsRecordSchema,

  /**
   * The SmsRecord model instance
   * @type {smsRecord:model~SmsRecord}
   */
  model: SmsRecord

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
//   }, function (err, smsRecord) {
//     if (err) {
//       throw err;
//     }

//     if (smsRecord) {
//       // the searched name is my name or a duplicate
//       return respond(self.id === smsRecord.id);
//     }

//     respond(true);
//   });
// }