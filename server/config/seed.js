/*
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var mongoose = require('mongoose');
var env = process.env.NODE_ENV || 'development';
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('../api/user/user.model').model;

/*
// Insert some data needed to bootstrap or init the application

if ('production' === env) {
  // Insert some data needed to init the production instance only, update a version info ...
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

exports.seed = function (done) {
  User.find({}).remove(function () {
    User.create(exports.users, function (err) {
      if (err) {
        console.error('Error while populating users: %s', err);
      } else {
        console.log('finished populating users');
      }
      if (done) {
        done();
      }
    });
  });
}
