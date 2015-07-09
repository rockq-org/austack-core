/*
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var mongoose = require('mongoose');
var env = process.env.NODE_ENV || 'development';
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('../api/user/user.model').model;
var Q = require('q');
var S = require('string');
var _ = require('lodash');
var util = require('util');
var shortid = require('shortid');
var Shape = require('../service/shape');
var Repo = require('../service/repo');

/*
// Insert some data needed to bootstrap or init the application

if ('production' === env) {
  // Insert some data needed to init the production instance only, update a version debug ...
}
*/

/*
 * Insert dummy data to test the application
 */
exports.users = [{
  provider: 'local',
  // _id: 'dave1_id',
  _id: '5596b9bd30e816d8f84bba33',
  name: 'dave1',
  userId: 'dave1',
  password: 'dave1',
  role: 'admin',
  isVerified: true,
  active: true
}, {
  provider: 'local',
  // _id: 'dave2_id',
  _id: '5596b9bd30e816d8f84bba34',
  role: 'admin',
  name: 'dave2',
  password: 'dave2',
  isVerified: true,
  userId: 'dave2',
  active: true
}, {
  provider: 'local',
  // _id: 'root_id',
  _id: '5596b9bd30e816d8f84bba35',
  role: 'root',
  name: 'root',
  userId: 'root',
  password: 'root',
  isVerified: true,
  active: true
}];

exports.seed = function () {
  var deferred = Q.defer();
  _dropReposAndShapesAndApplications().then(function () {
      logger.debug('>> database: remove all users.');
      return User.find({}).remove().exec();
      // User.find({}).remove(function () {
      //   User.create(exports.users, function (err) {
      //     if (err) {
      //       logger.error('>> database: Error while populating users: %s', err);
      //     } else {
      //       logger.debug('>> database: finished populating users');
      //     }
      //   });
      // });
    })
    .then(function () {
      logger.debug('>> database: create seed users.');
      return User.create(exports.users);
    })
    .then(function (docs) {
      logger.debug('>> database: create seed repos and shapes.');
      return _createRepoAndShapes(docs);
    })
    .then(function () {
      logger.debug('>> database: seeds setup successfully.');
      deferred.resolve();
    })
    .fail(function (err) {
      deferred.reject(err);
    });
  return deferred.promise;
}

/**
 * create repos and shapes for users

 * @return {[type]} [description]
 */
function _createRepoAndShapes(users) {
  var promises = [];

  _.each(exports.users, function (user, index) {
    var d = Q.defer();
    Shape.mgr.create({
        name: util.format('repo_%s', shortid.generate()),
        ownerId: user._id,
        type: '_local_',
        mSchema: {
          uid: {
            type: String,
            unique: true,
            required: true
          },
          mobilePhone: {
            type: String,
            required: true
          }
        }
      })
      .then(function (shape) {
        logger.debug('>> database: create shape as seed %s for %s', shape.name, user.name);
        return Repo.mgr.create(shape);
      })
      .then(function (name) {
        logger.debug('>> database: create repo as seed %s for %s', name, user.name);
        d.resolve(name);
      })
      .fail(function (err) {
        d.reject(err);
      });

    promises.push(d.promise);
  });

  return Q.allSettled(promises);
}

/**
 * drop repos, shapes, applications in database.
 * @return {[type]} [description]
 */
function _dropReposAndShapesAndApplications() {
  var deferred = Q.defer();

  mongoose.connection.db.listCollections().toArray(function (err, cls) {
    if (err) {
      logger.error(err);
    } else {
      _.each(cls, function (x, index) {
        if (S(x.name).startsWith('repo') || x.name === 'shapes' || x.name === 'applications') {
          mongoose.connection.db.dropCollection(x.name);
          logger.debug('>> database: collection %s dropped.', x.name);
        }
        if ((cls.length - 1) == index) {
          deferred.resolve();
        }
      });
    }
  });

  return deferred.promise;
}
