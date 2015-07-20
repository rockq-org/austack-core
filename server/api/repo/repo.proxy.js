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
var mongoosePaginatePlugin = require('../../lib/mongoose/mongoose-paginate');
var Shape = require('../shape/shape.model');
var u = require('util');
var Q = require('q');
var shortid = require('shortid');

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

  var schema = new mongoose.Schema(shape.mSchema);
  schema.plugin(mongoosePaginatePlugin);
  var model = mongoose.model(shape.name, schema, shape.name);
  return model;
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

function insertOrUpdate(user, M) {
  var m = new M();
  var keys = _.keys(repoBody);
  _.each(keys, function (key) {
    m[key] = repoBody[key];
  });
  m.uid = shortid.generate();
  m.save(function (err, result) {
    if (err) {
      res.json({
        rc: 3,
        error: err
      });
    } else {
      var resultJSON = result.toJSON();
      delete resultJSON.__v;
      delete resultJSON._id;
      res.json({
        rc: 1,
        data: resultJSON
      });
    }
  });
}
exports.create = _create;
exports.insertOrUpdate = insertOrUpdate;
exports.getModel = _getModel;