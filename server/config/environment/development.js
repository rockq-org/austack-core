'use strict';

process.env.DATABASE_NAME = process.env.DATABASE_NAME || 'austack-dev';

var corsWhitelist = ['http://localhost:3000'];

module.exports = {

  corsOptions: {
    origin: function (origin, callback) {
      var originIsWhitelisted = corsWhitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
    }
  },

  publicDir: 'server/public',

  mongo: {
    uri: 'mongodb://localhost:27017/' + process.env.DATABASE_NAME
  },

  logLevel: 'log',

  apiBaseURL: 'http://localhost:9001/api',

  seedDB: true
};
