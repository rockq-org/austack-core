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
var Shape = require('../shape/shape.model');
var u = require('util');
var Q = require('q');

/**
 * get repo's model by collection name or shape name.
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function _getModel(shape) {
  // seems mongoose gets a lot workloads here in the context.
  // but it should be one in this way, all the models of repo 
  // should not depend on global instance, since the mShema maybe 
  // change in shape. So everytime, CRUD of repo happens, get a new 
  // model for stability reason. It has negative impact for performance.
  // Just add nodes. 
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

/**
 * import data by repo name and data
 * @param  {[type]} repoName [description]
 * @param  {[type]} data     [description]
 * @return {[type]}          [description]
 */
exports.import = function (repoName, data) {
  var deferred = Q.defer();
  Shape.findOne({
      name: repoName
    })
    .then(function (doc) {
      if (doc) {
        return _getModel(doc).create(data);
      } else {
        deferred.reject();
      }
    })
    .then(function (docs) {
      deferred.resolve(docs);
    });
  return deferred.promise;
}

exports.create = _create;
exports.getModel = _getModel;
