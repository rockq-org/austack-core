'use strict';

process.env.AUSTACK_DATABASE_URL = process.env.AUSTACK_DATABASE_URL || 'xxx';

// Fix https://github.com/arrking/austack-core/issues/238
// Doc https://github.com/expressjs/cors
var corsWhitelist = ['http://console.austack.com', 'http://7xl33e.com1.z0.glb.clouddn.com'];

module.exports = {

  corsOptions: {
    origin: function (origin, callback) {
      var originIsWhitelisted = corsWhitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
    }
  },

  ip: process.env.AUSTACK_SYS_IP || undefined,

  port: process.env.AUSTACK_SYS_PORT || 9888,

  publicDir: 'server/public',

  logLevel: 'log',

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

  seedDB: false
};
