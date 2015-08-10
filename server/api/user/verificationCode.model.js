'use strict';

var mongoose = require('mongoose');
var requestContext = require('mongoose-request-context');
var createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;

var VerificationCodeDefinition = {
  idKey: String, //repoName_uid
  mobile: String,
  verificationCode: String,
  verificationCodeExpiredAt: Date,
  verificationCodeLatestSendTime: Date
};

var VerificationCodeSchema = new mongoose.Schema(VerificationCodeDefinition);

/**
 * Attach security related plugins
 */
VerificationCodeSchema.plugin(createdModifiedPlugin);

VerificationCodeSchema.plugin(requestContext, {
  propertyName: 'modifiedBy',
  contextPath: 'request:acl.user.name'
});

/**
 * Validations
 */
// VerificationCodeSchema
//   .path('pathName')
//   .validate(validateUniqueVerificationCode, 'The specified pathName is already in use.');

var VerificationCode;
if (mongoose.models.VerificationCode) {
  VerificationCode = mongoose.model('VerificationCode');
} else {
  VerificationCode = mongoose.model('VerificationCode', VerificationCodeSchema);
}

module.exports = {
  definition: VerificationCodeDefinition,
  schema: VerificationCodeSchema,
  model: VerificationCode
};

// function validateUniqueVerificationCode(value, respond) {
//   var self = this;

//   this.constructor.findOne({
//     invitationCode: value
//   }, function (err, doc) {
//     if (err) {
//       throw err;
//     }

//     if (doc) {
//       return respond(self.id === doc.id);
//     }

//     respond(true);
//   });
// }