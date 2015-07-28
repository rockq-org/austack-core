'use strict';

process.env.AUSTACK_DATABASE_URL = process.env.AUSTACK_DATABASE_URL || 'mongodb://localhost:27017/austackdb';

module.exports = {

  corsOptions: {
    origin: 'http://console.austack.com'
  },
  ip: process.env.AUSTACK_SYS_IP || undefined,

  port: process.env.AUSTACK_SYS_PORT || 9888,

  publicDir: 'server/public',

  mongo: {
    uri: process.env.AUSTACK_DATABASE_URL,
    options: {
      server: {
        auto_reconnect: true,
        poolSize: 4,
        socketOptions: {
          keepAlive: 1
        }
      }
    }
  },

  apiBaseURL: 'http://api.austack.com/api',

  seedDB: true,
  sms: {
    provider: 'qiji',
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
