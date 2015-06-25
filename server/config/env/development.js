'use strict';

process.env.DATABASE_NAME = process.env.DATABASE_NAME || 'austack-dev';

module.exports = {

  mongo: {
    uri: 'mongodb://localhost/' + process.env.DATABASE_NAME
  },

  seedDB: false
};
