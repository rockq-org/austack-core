/**
 * Module for the controller definition of the shape api.
 * The ShapeController is handling /api/shapes requests.
 * @module {Shape:controller~ShapeController} Shape:controller
 * @requires {@link ParamController}
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = ShapeController;

var _ = require('lodash');
var roles = require('../../lib/auth/roles');
var Repo = require('../repo/repo.proxy');

/**
 * The Shape model instance
 * @type {Shape:model~Shape}
 */
var Shape = require('./shape.model');

/**
 * ShapeController constructor
 * @classdesc Controller that handles /api/shapes route requests
 * for the application api.
 * Uses the 'shapeId' parameter and the 'shapeParam' request property
 * to operate with the [main shape API Model]{@link shape:model~Shape} model.
 * @constructor
 * @inherits ParamController
 * @see application:model~Shape
 */
function ShapeController(router) {
  // modify select only properties
  // this.select = ['-__v'];

  // omit properties on update
  // this.omit = ['hashedPassword'];

  // property to return (maybe a virtual getter of the model)
  // this.defaultReturn = 'profile';
}

// define properties for the ApplicationController here
ShapeController.prototype = {

  /**
   * Set our own constructor property for instanceof checks
   * @private
   */
  constructor: ShapeController,
  hasPermission: _hasPermission,
  index: _index,
  put: _put
}

/**
 * check if user hasPermission
 * @param  {[type]}  req [description]
 * @param  {[type]}  res [description]
 * @return {Boolean}     [description]
 */
function _hasPermission(req, res) {
  if (req.userInfo.role == 'root') {
    return true;
  }
  // assign the requested doc into req before check.
  var doc = req.shape;
  // http://stackoverflow.com/questions/11637353/comparing-mongoose-id-and-strings
  // _id and ownerId are object.
  if (doc.ownerId.equals(req.userInfo._id)) {
    return true;
  }

  return false;
}

/**
 * get specific repo's shape by name
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function _index(req, res) {
  Shape.findOne({
      name: req.params['repoName']
    })
    .exec()
    .then(function (doc) {
      if (!doc) {
        res.json({
          rc: 2,
          error: 'Can not find repo in this name.'
        });
      } else {
        req.shape = doc;
        if (_hasPermission(req, res)) {
          res.json({
            rc: 1,
            data: _.pick(doc, ['mSchema', 'type', 'name', 'modified', 'created'])
          });
        } else {
          res.unauthorized();
        }
      }
    }, function (err) {
      res.json({
        rc: 0,
        error: err
      });
    });
}

/**
 * enable update shape with body
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function _put(req, res) {
  Shape.findOne({
      name: req.params['repoName']
    })
    .exec()
    .then(function (doc) {
      if (!doc) {
        res.json({
          rc: 2,
          error: 'Can not find repo in this name.'
        });
      } else {
        req.shape = doc;
        if (_hasPermission(req, res)) {
          _processShapeUpdate(req, res, doc);
        } else {
          res.unauthorized();
        }
      }
    }, function (err) {
      res.json({
        rc: 0,
        error: err
      });
    });
}

/**
 * process shape update
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @param  {[type]} source target doc to be update in database.
 * @return {[type]}     [description]
 */
function _processShapeUpdate(req, res, source) {
  var desired = req.body;
  if (desired.mSchema && _validateDesiredShape(desired.mSchema)) {
    source.mSchema = desired.mSchema;
    source.markModified('mSchema');
    source.save()
      .then(function (doc) {
        // #TODO update model in repo
        res.json({
          rc: 1,
          data: _.pick(doc, ['mSchema', 'type', 'name', 'modified', 'created'])
        });
      }, function (err) {
        res.json({
          rc: 4,
          error: err
        });
      });
  } else {
    res.json({
      rc: 3,
      error: 'Illegal request body.'
    });
  }
}

/**
 * validate properties to be updated.
 * @param  {[type]} desired [description]
 * @return {[type]}         [description]
 * #prototype, only support update mSchema of a shape.
 * mShema is something like this, it meets monogoose schema argument
 * further, mSchema is passed into monogoose.Schema.
 * "mSchema": {
            "mobile": {
                "required": true
            },
            "uid": {
                "required": true,
                "unique": true
            }
        }
  * Note, mobile and uid are fixed. Other properties are only in String, Number, Date or Boolean.
  * Mixed type are not supported.
  *
 */
function _validateDesiredShape(mSchema) {
  var result = true;
  var fixedSchema = Repo.convertSchema(mSchema);
  // first, mobile and uid are defined as unaltered.
  if (fixedSchema.mobile && typeof (fixedSchema.mobile) === 'object' &&
    fixedSchema.mobile.required && fixedSchema.mobile.type === 'String') {
    result = true;
  } else {
    return false;
  }

  if (fixedSchema.uid && typeof (fixedSchema.uid) === 'object' &&
    fixedSchema.uid.required && fixedSchema.uid.type === 'String' &&
    fixedSchema.uid.unique === true) {
    result = true;
  } else {
    return false
  }

  // second, check other properites in a try catch way
  try {
    new Schema(fixedSchema);
  } catch (e) {
    logger.error('_validateDesiredShape', e);
    return false;
  }

  // at last, to limit store and complex, just support four types of data
  // ['String', 'Boolean', 'Number', 'Date']
  var keys = _.keys(fixedSchema);
  _.each(keys, function (k, index) {
    if (!fixedSchema[k].type) {
      logger.warn('Can not get type for fixedSchema.');
      result = false;
    } else if (!_.includes(['String', 'Boolean', 'Number', 'Date'], fixedSchema[k].type)) {
      logger.warn('Only allow "String", "Boolean", "Number" and "Date" for type.');
      result = false;
    }
  });

  return result;
}
