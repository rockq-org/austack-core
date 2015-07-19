/**
 * User Repo Shape Management
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;

var ShapeDefinition = {
  // by default, in prototype phase, One Dave, One Shape,
  // one Repo, so the shape's is generated with dave_id_short_id
  // name is also the repo's name.
  name: {
    type: String,
    require: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  // local or remote
  // for local type, repo is created inside austack database,
  // but a remote repo is created with the developer inputted
  // db url.
  type: {
    type: String,
    require: true
  },
  // by default, all repo has uid as user id, and mobile
  // mobile phone number.
  mSchema: {
    type: Schema.Types.Mixed,
    require: true
  },
  // an optional description of this shape.
  description: {
    type: String
  }
}

var ShapeSchema = new mongoose.Schema(ShapeDefinition);

/**
 * attache plugins
 */
ShapeSchema.plugin(createdModifiedPlugin);

var Shape = mongoose.model('Shape', ShapeSchema, '_shapes');

exports = module.exports = Shape;