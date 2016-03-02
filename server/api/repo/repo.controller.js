/**
 * Controller of repo to process req and res
 */

'use strict';

module.exports = RepoController;

var _ = require('lodash');
var shortid = require('shortid');
var roles = require('../../permission/roles');
var User = require('../user/user.model').model;
var Shape = require('../shape/shape.model');
var Repo = require('./repo.proxy');
var Config = require('../../config');
var Q = require('q');
var mongooseUtil = require('../../persistence/mongoose/mongoose-util');

/**
 * RepoController constructor
 * @classdesc Controller that handles /api/repos route requests
 * for the repo api.
 * Uses the 'repoId' parameter and the 'repoParam' request property
 * to operate with the [main repo API Model]{@link repo:model~Repo} model.
 * @constructor
 * @see application:model~Repo
 */
function RepoController(router) {

  // modify select only properties
  // this.select = ['-__v'];

  // omit properties on update
  // this.omit = ['hashedPassword'];

  // property to return (maybe a virtual getter of the model)
  // this.defaultReturn = 'profile';
}

// define properties for the ApplicationController here
RepoController.prototype = {

  /**
   * Set our own constructor property for instanceof checks
   * @private
   */
  constructor: RepoController,
  // Enable GET /api/repos
  index: _index,
  // Enable POST /api/repos/:repoName
  post: _post,
  // Enable GET /api/repos/:repoName
  get: _get,
  // Enable PUT /api/repos/:repoName/:uid
  put: _put,
  // Enable DELETE /api/repos/:repoName/:uid
  delete: _delete
}

/**
 * get dave's repo array
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function _index(req, res) {
  // {"_id":"5596b9bd30e816d8f84bba33","role":"admin","iat":1436510300,"exp":1436528300}
  // logger.debug('get req.user %j', req.user);
  if (req.userInfo.repos && req.userInfo.repos.length > 0) {
    res.json({
      rc: 1,
      data: req.userInfo.repos
    });
  } else {
    res.json({
      rc: 0,
      data: 'User does not have any repo yet.'
    });
  }
}

/**
 * [_get description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function _get(req, res) {
  var repoName = req.params['repoName'];
  var repoUId = req.params['uid'];
  logger.debug('Get %s uid %s', repoName, repoUId);

  if (!repoName) {
    res.json({
      rc: 0,
      error: 'Bad Parameters. :repoName needed.'
    });
  }

  // just get one record by uid.
  if (repoUId)
    return _getByUId(req, res, repoName, repoUId);

  // support GET with query
  Shape.findOne({
      name: repoName
    }).then(function (shape) {
      if (!shape)
        throw new Error('Repo not exist.');

      if (_hasPermission(req, shape)) {
        var M = Repo.getModel(shape);
        var query = req.query || {};
        mongooseUtil.getQuery(req)
          .then(function (mQuery) {
            var options = mongooseUtil.getPaginateOptions(req);
            logger.log(options, req.query);
            M.paginate(
              mQuery || {},
              options,
              function (err, results, pageNumber, pageCount, itemCount) {
                if (err) {
                  return res.handleError(err);
                }
                var json = {
                  total: itemCount,
                  total_page: pageCount,
                  current_page: pageNumber,
                  rc: 1,
                  data: results
                };
                logger.log(req.query, json);
                return res.ok(json);
              });
          }, function (err) {
            return res.json({
              rc: 0,
              error: err
            });
          })
      } else {
        throw new Error('Permission denied.');
      }
    }, function (err) {
      throw err;
    })
    .then(undefined, function (err) {
      logger.error(err);
      res.json({
        rc: 3,
        error: err
      });
    });

  function _getByUId(req, res, repoName, repoUId) {
    return Shape.findOne({
        name: repoName
      }).then(function (shape) {
        if (!shape)
          throw new Error('Repo not exist.');

        if (_hasPermission(req, shape)) {
          var M = Repo.getModel(shape);
          return M.findOne({
            uid: repoUId
          }).exec();
        } else {
          throw new Error('Permission denied.');
        }
      }, function (err) {
        throw err;
      })
      .then(function (m) {
        if (!m)
          return res.json({
            rc: 0,
            error: 'Can not find record in repo by this uid.'
          });

        var rs = m.toJSON();
        delete rs['__v'];
        delete rs['_id'];

        return res.json({
          rc: 1,
          data: rs
        });
      }, function (err) {
        logger.log(err);
        res.json({
          rc: 2,
          error: err
        });
      });
  }
}

/**
 * [_get description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function _delete(req, res) {
  var repoName = req.params['repoName'];
  var repoUId = req.params['uid'];
  logger.debug('repoName ' + repoName);
  logger.debug('repoUId ' + repoUId);

  Shape.findOne({
      name: repoName
    }).then(function (shape) {
      if (!shape)
        throw new Error('Repo not exist.');

      if (_hasPermission(req, shape)) {
        var M = Repo.getModel(shape);
        return M.findOne({
          uid: repoUId
        }).exec();
      } else {
        throw new Error('Permission denied.');
      }
    }, function (err) {
      throw err;
    })
    .then(function (m) {
      if (!m)
        return res.json({
          rc: 0,
          error: 'Can not find record in repo by this uid.'
        });
      m.remove(function (err) {
        if (err)
          return res.json({
            rc: 0,
            error: 'Can not remove record in repo by this uid.'
          });
        res.json({
          rc: 1,
          data: 'Record removed.'
        });
      });
    }, function (err) {
      res.json({
        rc: 2,
        error: err
      });
    });

}

/**
 * [_get description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function _put(req, res) {
  var repoName = req.params['repoName'];
  var repoUId = req.params['uid'];
  var repoBody = req.body;

  logger.debug('%s %s update. %j', repoName, repoUId, repoBody);

  if (!(repoName || repoUId || repoBody)) {
    return res.json({
      rc: 0,
      error: 'Bad parameters.'
    });
  }

  Shape.findOne({
      name: repoName
    }).then(function (shape) {
      if (!shape)
        throw new Error('Repo not exist.');

      if (_hasPermission(req, shape)) {
        var M = Repo.getModel(shape);
        _updateRepoRecord(res, shape, M, repoUId, repoBody);
      } else {
        throw new Error('Permission denied.');
      }
    }, function (err) {
      throw err;
    })
    .then(undefined, function (err) {
      res.json({
        rc: 2,
        error: err
      });
    });
}

/**
 * Post new record into a repo.
 * Note, uid is created, also support other properties in mSchema.
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function _post(req, res) {
  var repoName = req.params['repoName'];
  var repoBody = req.body;
  if (!repoName)
    return res.json({
      rc: 0,
      error: 'Parameters required.'
    });

  Shape.findOne({
      name: repoName
    })
    .then(function (doc) {
      logger.log(repoName, doc);
      if (!doc) {
        throw new Error('Requested repo not exist.');
      } else {
        return doc;
      }
    }, function (err) {
      throw err;
    })
    .then(function (shape) {
      // check permission
      if (_hasPermission(req, shape)) {
        var M = Repo.getModel(shape);
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
      } else {
        res.json({
          rc: 4,
          error: 'Permission deny.'
        });
      }
    }, function (err) {
      res.json({
        rc: 2,
        error: err
      });
    });
}

/**
 * check if user hasPermission
 * @param  {[type]}  req [description]
 * @param  {[type]}  res [description]
 * @return {Boolean}     [description]
 */
function _hasPermission(req, resource) {
  if (req.userInfo.role == 'root') {
    return true;
  }
  logger.log(resource, req.userInfo);
  // assign the requested resource into req before check.
  // http://stackoverflow.com/questions/11637353/comparing-mongoose-id-and-strings
  // _id and ownerId are object.
  // if (resource.ownerId.equals(req.userInfo._id)) {
  if (resource.ownerId.equals(req.userInfo.ownerId) //appAdmin
    || resource.ownerId.equals(req.userInfo._id)) { //admin
    return true;
  }

  return false;
}

/**
 * update record in a repo by uid
 * @param  {[type]} ep    ep.emit(doc) to return succ with res, ep.throw to send err with res.
 * @param  {[type]} shape
 * @param  {[type]} model [description]
 * @param  {[type]} uid   [description]
 * @param  {[type]} data  desired data.
 * @return {[type]}       [description]
 */
function _updateRepoRecord(res, shape, model, uid, data) {

  logger.debug('uid %s', uid);
  model.findOne({
      uid: uid
    })
    .then(function (doc) {
      if (!doc) {
        return res.json({
          rc: 4,
          error: 'Can not find record with this uid.'
        })
      }
      delete data._id;
      delete data.__v;
      delete data.uid;

      // #TODO delete disappeared keys
      var target = _.merge(doc.toJSON(), data);
      var keys = _.keys(target);
      _.each(keys, function (k) {
        doc[k] = target[k];
      });
      doc.save(function (err, result) {
        if (err)
          return res.json({
            rc: 5,
            error: err
          });
        var resultJSON = result.toJSON();
        delete resultJSON.__v;
        delete resultJSON._id;
        res.json({
          rc: 1,
          data: resultJSON
        });
      });
    }, function (err) {
      logger.error(err);
      res.json({
        rc: 3,
        error: err
      });
    });
}