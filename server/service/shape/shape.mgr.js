/**
 * Shape management
 */

var Shape = require('./shape.model');
var u = require('util');
var Q = require('q');

/**
 * create a shape with params
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
exports.create = function (params) {
  var deferred = Q.defer();
  var s = new Shape();
  s.name = params.name;
  s.ownerId = params.ownerId;
  s.type = params.type;
  s.mSchema = params.mSchema;
  s.description = params.description;
  s.save(function (err, doc) {
    if (err) {
      logger.error('Fail to create shape', err);
      deferred.reject(err);
    } else {
      logger.debug('Create shape %j successfully.', doc);
      deferred.resolve(doc);
    }
  });

  return deferred.promise;
}

/**
 * get Shape by name
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
exports.getShapeByName = function (name) {
  var deferred = Q.defer();
  Shape.findOne({
    name: name
  }, function (err, doc) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(doc);
    }
  });
  return deferred.promise;
}
