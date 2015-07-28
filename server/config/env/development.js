'use strict';

process.env.DATABASE_NAME = process.env.DATABASE_NAME || 'austack-dev';

module.exports = {

  corsOptions: {
    origin: 'http://localhost:3000'
  },

  publicDir: 'server/public',

  mongo: {
    uri: 'mongodb://localhost/' + process.env.DATABASE_NAME
  },

  logLevel: 'log',

  apiBaseURL: 'http://localhost:9001/api',

  seedDB: true,
  sms: {
    provider: 'weimi',
    weimi: {
      uid: "lmf8FDhlAHHB",
      pas: "r2z36xbh",
      cid: "Zh07NWBGgr1r"
    },
    qiji: {
      api: 'http://111.206.169.91:8180/templatesms/mysms',
      srcId: '0005',
      templateSmsId: '6',
      username: 'austack90-d46a-486d-abc0-1586d0001',
      password: 'IrcUgyug'
    }
  }
};
