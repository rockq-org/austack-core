'use strict';

process.env.DATABASE_NAME = process.env.DATABASE_NAME || 'austack-dev';

module.exports = {

  corsOptions: {
    origin: 'http://localhost:3000'
  },

  publicDir: 'server/public',

  logLevel: 'log',

  mongo: {
    uri: 'mongodb://localhost/' + process.env.DATABASE_NAME
  },

  apiBaseURL: 'http://localhost:9001/api',

  seedDB: true
};
