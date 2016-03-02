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
var mongoosePaginatePlugin = require('../../persistence/mongoose-paginate');
var Shape = require('../shape/shape.model');
var ShapeProxy = require('../shape/shape.proxy');
var RepoProxy = require('../repo/repo.proxy');
var User = require('../user/user.model').model;
var u = require('util');
var Q = require('q');
var shortid = require('shortid');
var _ = require('lodash');
var logger = require('../../common').loggerUtil.getLogger('api/repo.proxy');

module.exports = {
  import: _import,
  create: _create,
  insertOrUpdate: insertOrUpdate,
  getModel: _getModel,
  getRepo: getRepo,
  convertSchema: convertSchema,
  createAppUser: createAppUser,
  getRepoName: getRepoName,
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
function _import(repoName, data) {
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

function getRepo(data) {
  var d = Q.defer();
  var ownerId = data.ownerId;

  User.getById(ownerId)
    .then(function (user) {
      // var shapeName = 'repo_' + user.userId;
      var shapeName = user.repos[0];
      logger.debug('shapename', shapeName);
      ShapeProxy.getShapeByName(shapeName)
        .then(function (shape) {
          var repoModel = _getModel(shape);
          d.resolve(repoModel);
        });
    });

  return d.promise;
};

function getRepoName(ownerId) {
  var d = Q.defer();

  User.getById(ownerId)
    .then(function (user) {
      // var shapeName = 'repo_' + user.userId;
      var shapeName = user.repos[0];
      d.resolve(shapeName);
    })
    .catch(function (err) {
      logger.error(err);
      d.reject(err);
    });

  return d.promise;
};

function getRepoByName(repoName) {
  var d = Q.defer();

  ShapeProxy.getShapeByName(repoName)
    .then(function (shape) {
      var repoModel = _getModel(shape);
      d.resolve(repoModel);
    })
    .catch(function (err) {
      logger.error(err);
      d.reject(err);
    });

  return d.promise;
};

function createAppUser(repoModel, mobile) {
  var d = Q.defer();

  repoModel.findOne({
      mobile: mobile
    },
    function (err, user) {
      if (user) {
        //current mobile exist, can not create
        return d.reject('mobile exist');
      }

      user = {
        mobile: mobile,
        uid: shortid.generate()
      };
      repoModel.create(user, function (err, _user) {
        if (err) {
          logger.error(err);
          return d.reject('error while repoModel.create');
        }
        return d.resolve(_user);
      });
    });

  return d.promise;
}
