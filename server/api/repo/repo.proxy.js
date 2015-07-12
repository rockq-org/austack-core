/**
 * User management reuseable utilities
 * Each Developer's user data, as in the persona, we called Linda
 * would store in austack's database, after Dave register his account
 *  in austack, austack create a default collection for user management
 * , this is his repo.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dbase = mongoose.connection;
var Shape = require('../shape');
var u = require('util');
var Q = require('q');

/**
 * get repo's model by collection name or shape name.
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function _getModel(shape) {
  delete mongoose.models[shape.name];
  delete mongoose.modelSchemas[shape.name];
  return mongoose.model(shape.name, new mongoose.Schema(shape.mSchema), shape.name);
}

/**
 * create a collection as a repo for specific user
 * @param  {ObjectId} ownerId user id
 * @param  {Shape} shape   Shape's model for this collection
 * @return {promise}       promise for further operations
 */
function _create(shape) {
  var deferred = Q.defer();

  dbase.db.collection(shape.name, {
    strict: true
  }, function (err, collection) {
    if (!err) {
      deferred.reject('repo does exist.');
    } else {
      var mschema = new mongoose.Schema(shape.mSchema, {
        strict: false
      });
      // Mongoose#model(name, [schema], [collection], [skipInit])
      var m = mongoose.model(shape.name, mschema, shape.name);
      deferred.resolve(shape.name);
    }
  });

  return deferred.promise;
}

exports.create = _create;
exports.getModel = _getModel;
