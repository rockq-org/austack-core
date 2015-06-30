'use strict';

process.env.DATABASE_NAME = process.env.DATABASE_NAME || 'austackdb';

module.exports = {

  corsOptions: {
    origin: 'http://austack-stg-client.arrking.com'
  },
  ip: process.env.AUSTACK_SYS_IP || undefined,

  port: process.env.AUSTACK_SYS_PORT || 9888,

  publicDir: 'public',

  mongo: {
    uri: 'mongodb://peter:Be8s2fsisOdWy@115.28.162.221:27088/' + process.env.DATABASE_NAME
  }
};
