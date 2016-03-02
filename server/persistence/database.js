/**
 * Connect to the database and add connection handlers
 * @module {MongooseConnection} config:mongoose
 * @requires {@link config}
 */
'use strict';

var mongoose = require('mongoose');
var config = require('../config');
var logger = require('../common').loggerUtil.getLogger('persistence/database');

// connect to mongodb
var connection = mongoose.connect(config.mongo.uri, config.mongo.options);

/**
 * The initialized Mongoose connection object
 * @type {MongooseConnection}
 */
module.exports = connection;

// reconnect if connection is disconnected or disconnecting
// throw any errors that occur while reconnecting
if (connection.state === 0 || connection.state === 3) {
  connection.open(function connectionReconnect(err) {
    if (err) {
      logger.error('Error while reinitializing the database connection: %s', err);
      throw err; // throw error to stop application launch
    }
    logger.log('Database Connection reopened');
  });
}

// register global database error handler
mongoose.connection.on('error', function connectionError(err) {
  logger.error('Database Error: ', err);
});

// register the connection handler once only
mongoose.connection.once('open', function connectionOpen() {
  logger.log('Database connection open');
  // Populate DB with sample data
  if (config.seedDB) {
    logger.debug('seed db ...');
    require('./seed').seed();
  }
});