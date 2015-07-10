/**
 * Module for the controller definition of the shape api.
 * The ShapeController is handling /api/shapes requests.
 * @module {Shape:controller~ShapeController} Shape:controller
 * @requires {@link ParamController}
 */
'use strict';

module.exports = ShapeController;

var _ = require('lodash');
var ParamController = require('../../lib/controllers/param.controller');
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
  ParamController.call(this, Shape, router);

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
  index: function (req, res) {
    console.log(" sss " + ShapeController.paramString);
    Shape.findOne({
        name: req.param[ShapeController.paramString]
      })
      .exec()
      .then(function (docs) {
        res.json({
          rc: 1,
          data: docs
        });
      }, function (err) {
        res.json({
          rc: 0,
          error: err
        });
      });
  }
}

// inherit from ParamController
ShapeController.prototype = _.create(ParamController.prototype, ShapeController.prototype);
