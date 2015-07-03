'use strict';

process.env.DATABASE_NAME = process.env.DATABASE_NAME || 'austack-dev';

module.exports = {
  corsOptions: {
    origin: 'http://localhost:3000'
  },
  mongo: {
    uri: 'mongodb://localhost/' + process.env.DATABASE_NAME
  },

  seedDB: false
};
