/**
 * Module for the controller definition of the shape api.
 * The ShapeController is handling /api/shapes requests.
 * @module {Shape:controller~ShapeController} Shape:controller
 * @requires {@link ParamController}
 */
'use strict';

module.exports = ShapeController;

var _ = require('lodash');
var roles = require('../../lib/auth/roles');

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
  index: _index,
  hasPermission: _hasPermission
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
