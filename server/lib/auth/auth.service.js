/**
 * Module for setting up the authentication service functions.
 * Utility and service methods for the authentication and authorization services.
 * @module {object} auth:service
 */
'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var roles = require('./roles');
var config = require('../../config');
var contextService = require('request-context');
var Application = require('../../api/application/application.model').model;
var Q = require('q');

var secretCallback = function (req, payload, done) {
  logger.log(payload, done);

  if (!payload.role) {
    logger.log('payload do not have role data', req, payload);
    return;
  }

  switch (payload.role) {
  case 'root':
    done(null, config.secrets.session);
    break;
  case 'admin':
    done(null, config.secrets.session);
    break;
  case 'appAdmin':
    appAdminCallback(req, payload, done);
    break;
  case 'user':
    userCallback(req, payload, done);
    break;
  default:
    logger.log('role not validate ', payload.role);
    break;
  }

  function appAdminCallback(req, payload, done) {
    if (!payload.clientId || !payload.ownerId) {
      logger.log('missing clientId and ownerId in payload', payload);
      return;
    }

    //get clientSecret From application collection
    Application.findOne({
      clientId: payload.clientId,
      ownerId: payload.ownerId
    }, function (err, doc) {
      if (err || !doc) {
        return done(err);
      }
      var secret = doc.clientSecret;
      req.userInfo = doc;
      req.userInfo.role = 'appAdmin';
      done(null, secret);
    });
  }

  function userCallback(req, payload, done) {
    if (!payload.clientId || !payload.mobile) {
      logger.log('missing clientId and mobile in payload', payload);
      return;
    }

    //get clientSecret From application collection
    Application.findOne({
      clientId: payload.clientId
    }, function (err, doc) {
      if (err || !doc) {
        return done(err);
      }

      //for loginRecord
      req.validateUserJwtForLoginRecord = {
        mobile: payload.mobile,
        appUserId: payload.appUserId,
        clientId: payload.clientId,
        actionType: 'validateUserJwt',
        ownerId: doc.ownerId
      }

      var secret = doc.clientSecret;
      done(null, secret);
    });
  }
};

var validateJwt = expressJwt({
  secret: secretCallback
});

module.exports = {

  /**
   * Middleware for checking for valid authentication
   * @see {auth:service~isAuthenticated}
   */
  isAuthenticated: isAuthenticated,

  /**
   * Middleware for checking for a minimum role
   * @see {auth:service~hasRole}
   */
  hasRole: hasRole,

  /**
   * Middleware for add the current user object to the request context as the given name
   * @see {auth:service~addAuthContex}
   * @type {Function}
   */
  addAuthContext: addAuthContext,

  /**
   * Sign a token with a user id
   * @see {auth:service~signToken}
   */
  signToken: signToken,
  signTokenForApplication: signTokenForApplication,
  signTokenForApplicationUser: signTokenForApplicationUser,

  validateUserJwt: validateUserJwt,
  /**
   * Set a signed token cookie
   * @see {auth:service~setTokenCookie}
   */
  setTokenCookie: setTokenCookie,

  /**
   * Utility functions for handling user roles
   * @type {Object}
   */
  roles: roles

};

/**
 * Attaches the user object to the request if authenticated otherwise returns 403
 * @return {express.middleware}
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function (req, res, next) {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })

  .use(function (req, res, next) { // Attach userInfo to request
    // return if this request has already been authorized
    if (req.hasOwnProperty('userInfo')) {
      return next();
    }
    if (!req.user._id) {
      return next();
    }
    // load user model on demand
    var User = require('../../api/user/user.model').model;

    User.findOne({
      _id: req.user._id,
      active: true
    }, function (err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        res.unauthorized();
        return next();
      }

      // set the requests userInfo object as the authenticated user
      req.userInfo = user;
      next();
    });
  });
}

/**
 * Checks if the user role meets the minimum requirements of the route, sets
 * the response status to FORBIDDEN if the requirements do not match.
 * @param {String} roleRequired - Name of the required role
 * @return {ServerResponse}
 */
function hasRole(roleRequired) {
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (roles.hasRole(req.userInfo.role, roleRequired)) {
        next();
      } else {
        res.forbidden();
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 * @param {String} id - Id used to sign a token
 * @return {String}
 */
function signToken(id, role) {
  return jwt.sign({
    _id: id,
    role: role
  }, config.secrets.session, {
    expiresInMinutes: 60 * 5
  });
}

function signTokenForApplication(clientId, ownerId, clientSecret) {
  return jwt.sign({
    clientId: clientId,
    role: 'appAdmin',
    ownerId: ownerId
  }, clientSecret, {
    expiresInMinutes: 60 * 5
  });
}

function signTokenForApplicationUser(clientId, clientSecret, mobile, appUserId) {
  var OneDay = 60 * 24; // in minutes
  var FourMonths = OneDay * 30 * 4;

  return jwt.sign({
    clientId: clientId,
    appUserId: appUserId,
    role: 'user',
    mobile: mobile
  }, clientSecret, {
    expiresInMinutes: FourMonths
  });
}

function validateUserJwt(customReq) {
  var d = Q.defer();

  var res = {};
  validateJwt(customReq, res, function (err) {
    if (err) {
      logger.log('err', err);
      return d.reject(err);
    }
    logger.log('success');
    d.resolve();
  });

  return d.promise;
}

/**
 * Set token cookie directly for oAuth sreturn trategies. Use the user object of the request to
 * identify a valid session. Set the signed cookie to the request and redirect to '/'.
 * @param {http.IncomingMessage} req - The request message object
 * @param {ServerResponse} res - The outgoing response object the cookie is set to
 * @return {ServerResponse}
 */
function setTokenCookie(req, res) {
  if (!req.userInfo) {
    return res.notFound({
      message: 'Something went wrong, please try again.'
    });
  }

  var token = signToken(req.userInfo._id, req.userInfo.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

/**
 * Add the current user object to the request context as the given name
 *
 * @param {http.IncomingMessage} req - The request message object
 * @param {ServerResponse} res - The outgoing response object
 * @param {function} next - The next handler callback
 */
function addAuthContext(namespace) {
  if (!namespace) {
    throw new Error('No context namespace specified!');
  }

  return function addAuthContextMiddleWare(req, res, next) {
    contextService.setContext(namespace, req.userInfo);
    next();
  };
}