/**
 * This module loads the application configuration depending on the
 * 'NODE_ENV' environment variable.
 * @module {Object} config
 * @property {String} env - The environment used in the application
 * @property {String} root - The application root path
 * @property {String} publicDir - The path to public sources
 * @property {String} ip - IP address used to bind the application server
 * @property {String} port - The port used to bind the application server
 * @property {Object} secrets - Holding the session secret used to sign the user session
 * @property {Array} userRoles - Array of available user role names
 * @property {Object} mongo - Configuration that is passed to mongoose to establish a connection
 */
'use strict';

var _ = require('lodash');
var path = require('path');

/**
 * Load environment configuration
 */

var common = {
  env: process.env.NODE_ENV,

  root: path.normalize(__dirname + '/../..'),

  distDir: 'dist',

  publicDir: 'server/public',

  ip: '0.0.0.0',

  port: process.env.PORT || 9001,

  corsOptions: {
    credentials: true
  },

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: process.env.SESSION_SECRET || 'my-austack-secret'
  },

  // List of user roles
  userRoles: ['user', 'appAdmin', 'admin', 'root'],
  limit: 100, // paginate limit

  // shape's default schema
  mSchema: [{
    name: 'uid',
    isSys: true,
    props: {
      type: 'String',
      unique: true,
      required: true
    }
  }, {
    name: 'mobile',
    isSys: true,
    props: {
      type: 'String',
      required: true
    }
  }, {
    name: 'createDate',
    isSys: true,
    props: {
      type: 'Date',
      default: Date.now
    }
  }, {
    name: 'latestActive',
    isSys: true,
    props: {
      type: 'Date',
      default: Date.now
    }
  }],

  // options passed to create mongo connections
  mongo: {
    options: {
      db: {
        safe: true
      },
      server: {
        socketOptions: {
          keepAlive: 1,
          connectTimeoutMS: 10000
        }
      },
      replset: {
        socketOptions: {
          keepAlive: 1,
          connectTimeoutMS: 10000
        }
      }
    }
  },
  logLevel: 'log',
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

module.exports = _.merge(
  common,
  require('./env/' + process.env.NODE_ENV + '.js') || {});