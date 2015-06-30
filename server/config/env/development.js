'use strict';

process.env.DATABASE_NAME = process.env.DATABASE_NAME || 'austack-dev';

module.exports = {
  corsOptions: {
    origin: 'http://austack-stg-client.arrking.com'
  },
  mongo: {
    uri: 'mongodb://localhost/' + process.env.DATABASE_NAME
  },

  seedDB: true
};
