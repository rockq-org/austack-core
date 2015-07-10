/*
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var mongoose = require('mongoose');
var env = process.env.NODE_ENV || 'development';
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('../api/user/user.model').model;
var Application = require('../api/application/application.model').model;
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

exports.applications = [{
  "_id": "559e96ff772008b47f035727",
  "name": "Troy",
  "ownerId": "5596b9bd30e816d8f84bba33",
  "clientId": "7e37446147bc5224fa42072f",
  "clientSecret": "e98e13bfbc6aa39da1693e13",
  "modified": "2015-07-09T15:45:03.409Z",
  "created": "2015-07-09T15:45:03.410Z",
  "isTrashed": false,
  "corsDomains": [],
  "callbackUrls": [],
  "jwtExpiration": 36000,
}, {
  "_id": "559e96ff772008b47f035728",
  "name": "Troy",
  "ownerId": "5596b9bd30e816d8f84bba34",
  "clientId": "7e37446147bc5224fa420724",
  "clientSecret": "e98e13bfbc6aa39da1693e19",
  "modified": "2015-07-09T15:45:03.409Z",
  "created": "2015-07-09T15:45:03.410Z",
  "isTrashed": false,
  "corsDomains": [],
  "callbackUrls": [],
  "jwtExpiration": 36000,
}, {
  "_id": "559e96ff772008b47f035729",
  "name": "Troy",
  "ownerId": "5596b9bd30e816d8f84bba35",
  "clientId": "7e37446147bc5224fa420725",
  "clientSecret": "e98e13bfbc6aa39da1693e1y",
  "modified": "2015-07-09T15:45:03.409Z",
  "created": "2015-07-09T15:45:03.410Z",
  "isTrashed": false,
  "corsDomains": [],
  "callbackUrls": [],
  "jwtExpiration": 36000,
}];

exports.seed = function () {
  var deferred = Q.defer();
  _dropReposAndShapesAndApplications().then(function () {
      logger.debug('>> database: remove all users.');
      return User.find({}).remove().exec();
    })
    .then(function () {
      logger.debug('>> database: create seed users.');
      return User.create(exports.users);
    })
    .then(function (docs) {
      logger.debug('>> database: create seed repos and shapes.');
      return _createRepoAndShapes(docs);
    })
    .then(function (name) {
      logger.debug('>> database: create applications as seed.');
      return _createApplications();
    })
    .then(function () {
      logger.debug('>> database: seeds setup successfully.');
      deferred.resolve();
    })
    .fail(function (err) {
      logger.error('Get error when inserting seeds.', err);
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
      .then(function (apps) {
        d.resolve();
      })
      .fail(function (err) {
        d.reject(err);
      });

    promises.push(d.promise);
  });

  return Q.allSettled(promises);
}

function _createApplications() {
  var d = Q.defer();
  Application.find({})
    .remove()
    .exec()
    .then(function () {
      return Application.create(exports.applications);
    }, function (err) {
      d.reject(err);
    })
    .then(function (apps) {
      d.resolve(apps);
    }, function (err) {
      d.reject(err);
    });
  return d.promise;
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
    } else if (cls.length == 0) {
      deferred.resolve();
    } else {

      _.each(cls, function (x, index) {
        if (S(x.name).startsWith('repo') || x.name === '_shapes' || x.name === '_applications') {
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
