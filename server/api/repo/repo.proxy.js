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
var ShapeProxy = require('../shape/shape.proxy');
var RepoProxy = require('../repo/repo.proxy');
var User = require('../user/user.model').model;
var u = require('util');
var Q = require('q');
var shortid = require('shortid');
var _ = require('lodash');

module.exports = {
  import: import,
  create: _create,
  insertOrUpdate: insertOrUpdate,
  getModel: _getModel,
  getRepo: getRepo,
  convertSchema: convertSchema,
  getRepoByName: getRepoByName
};

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

  var schema = new mongoose.Schema(convertSchema(shape.mSchema));
  schema.plugin(mongoosePaginatePlugin);
  var model = mongoose.model(shape.name, schema, shape.name);
  logger.log(shape.name, shape.mSchema);
  return model;
}

/**
 * Convert Schema in Array format into Object Format.
 * https://github.com/arrking/austack-core/issues/93
 * @param  {[type]} source [description]
 * @return {[type]}        [description]
 */
function convertSchema(source) {
  var target = {};
  _.each(source, function (val, index, lis) {
    target[val.name] = val.props;
  });

  return target;
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
      logger.log(shape.mSchema);
      // https://github.com/arrking/austack-core/issues/181
      var mschema = new mongoose.Schema(convertSchema(shape.mSchema), {
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
function
import (repoName, data) {
  var deferred = Q.defer();
  Shape.findOne({
      name: repoName
    })
    .then(function (doc) {
      if (repoName == 'repo_root') {
        logger.log(repoName, data);
      };
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

function getRepo(data) {
  var d = Q.defer();
  var ownerId = data.ownerId;
  logger.log(data);

  User.getById(ownerId)
    .then(function (user) {
      // var shapeName = 'repo_' + user.userId;
      var shapeName = user.repos[0];
      logger.log('shapename', shapeName);
      ShapeProxy.getShapeByName(shapeName)
        .then(function (shape) {
          var repoModel = _getModel(shape);
          logger.log(shape.name, shape.mSchema, repoModel);
          d.resolve(repoModel);
        });
    });

  return d.promise;
};

function getRepoByName(repoName) {
  var d = Q.defer();

  ShapeProxy.getShapeByName(repoName)
    .then(function (shape) {
      var repoModel = _getModel(shape);
      logger.log(shape.name, shape.mSchema, repoModel);
      d.resolve(repoModel);
    })
    .catch(function (err) {
      logger.log(err);
      d.reject(err);
    });

  return d.promise;
};