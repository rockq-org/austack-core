/**
 * Module defining connect middleware to use in the austackApp application.
 * @module {Object} middleware
 * @requires {@link responses}
 */
'use strict';

var _ = require('lodash');
var reserved = ['__v'].concat(Object.keys(require('mongoose').Schema.reserved));

/**
 * Module for defining OK responses. Export all needed 200 range responses.
 * @module {Object} responses:ok
 */
var ok = {

  /**
   * Handles default responses
   * @type {function}
   * @see responses:ok~sendOk
   */
  ok: sendOk,

  /**
   * Handles default responses
   * @type {function}
   * @see responses:ok~sendOk
   */
  200: sendOk,

  /**
   * Handles created responses
   * @type {function}
   * @see responses:ok~created
   */
  created: created,

  /**
   * Handles created responses
   * @type {function}
   * @see responses:ok~created
   */
  201: created,

  /**
   * Handles content less responses
   * @type {function}
   * @see responses:ok~noContent
   */
  noContent: noContent,

  /**
   * Handles content less responses
   * @type {function}
   * @see responses:ok~noContent
   */
  204: noContent
};

// 200

/**
 * Handles default responses
 * @param {mixed} data - The data that should be send to the client
 * @param {Object|String} options - Response configuration object or view template name
 * @return A Response with status 200 set
 */
function sendOk(data, options) {
  // jshint validthis: true
  return this.res.status(200).sendData(data, options);
}

/**
 * Handles created responses
 * @param {mixed} data - The data that should be send to the client
 * @param {Object|String} options - Response configuration object or view template name
 * @return A Response with status 201 set
 */
function created(data, options) {
  // jshint validthis: true
  return this.res.status(201).sendData(data, options);
}

/**
 * Handles content less responses
 * @param {mixed} data - The data that should be send to the client
 * @param {Object|String} options - Response configuration object or view template name
 * @return A Response with status 204 set
 */
function noContent(data, options) {
  // jshint validthis: true
  return this.res.status(204).sendData(data, options);
}

/**
 * Default response output handler
 * @param {mixed} data - The data that should be send to the client
 * @param {Object|String} options - Response configuration object or view template name
 * @return A Response with the given status set, a rendered view if a view template has
 * been provided in the options paramter.
 */
function sendData(data, options) {
  // jshint validthis: true
  var req = this.req;
  var res = this.res;

  // headers already sent, nothing to do here
  if (res.headersSent) {
    return;
  }

  // If appropriate, serve data as JSON
  if (req.xhr || req.accepts('application/json')) {
    return res.json(data);
  }

  // if a template string is given as the options param
  // use it to render a view
  var viewFilePath = (typeof options === 'string') ? options : options.view;

  // try to render the given template, fall back to json
  // if an error occurs while rendering the view file
  if (viewFilePath && req.accepts('html')) {
    res.render(viewFilePath, data, function (err, result) {
      if (err) {
        return res.json(data);
      }
      return res.send(result);
    });
  }

  return res.json(data);
}

function html(viewFilePath, data) {
  // jshint validthis: true
  var req = this.req;
  var res = this.res;
  if (viewFilePath && req.accepts('html')) {
    res.render(viewFilePath, data, function (err, result) {
      if (err) {
        return res.json(data);
      }
      return res.send(result).end();
    });
  }

  return res.json(data);
}

/**
 * Module for defining error responses. Export all needed error responses.
 * @module {Object} responses:errors
 */

var errors = {
  /**
   * Handles malformed requests
   * @type {function}
   * @see responses:errors~badRequest
   */
  badRequest: badRequest,

  /**
   * Handles malformed requests
   * @type {function}
   * @see responses:errors~badRequest
   */
  400: badRequest,

  /**
   * Handles unauthorized requests
   * @type {function}
   * @see responses:errors~unauthorized
   */
  unauthorized: unauthorized,

  /**
   * Handles unauthorized requests
   * @type {function}
   * @see responses:errors~unauthorized
   */
  401: unauthorized,

  /**
   * Handles forbidden requests
   * @type {function}
   * @see responses:errors~forbidden
   */
  forbidden: forbidden,

  /**
   * Handles forbidden requests
   * @type {function}
   * @see responses:errors~forbidden
   */
  403: forbidden,

  /**
   * Handles not found requests
   * @type {function}
   * @see responses:errors~notFound
   */
  notFound: notFound,

  /**
   * Handles not found requests
   * @type {function}
   * @see responses:errors~notFound
   */
  404: notFound,

  /**
   * Handles unprocessable entities
   * @type {function}
   * @see responses:errors~unprocessableEntity
   */
  unprocessableEntity: unprocessableEntity,

  /**
   * Handles unprocessable entities
   * @type {function}
   * @see responses:errors~unprocessableEntity
   */
  422: unprocessableEntity,

  /**
   * Handles generic errors
   * @type {function}
   * @see responses:errors~handleError
   */
  handleError: handleError,

  /**
   * Handles generic errors
   * @type {function}
   * @see responses:errors~handleError
   */
  500: handleError,

  /**
   * Handles not implemented errors
   * @type {function}
   * @see responses:errors~notImplemented
   */
  notImplemented: notImplemented,

  /**
   * Handles not implemented errors
   * @type {function}
   * @see responses:errors~notImplemented
   */
  501: notImplemented,

  /**
   * Handles server errors
   * @type {function}
   * @see responses:errors~serverError
   */
  serverError: serverError
};

// 400

/**
 * Handles malformed requests
 * @param {mixed} data - The data that should be send to the client
 * @param {Object|String} options - Response configuration object or view template name
 * @return A Response with status 400 set
 */
function badRequest(data, options) {
  console.log(data, options);
  // jshint validthis: true
  return this.res.status(400).sendData(data, options);
}

/**
 * Handles unauthorized requests
 * @param {mixed} data - The data that should be send to the client
 * @param {Object|String} options - Response configuration object or view template name
 * @return A Response with status 401 set
 */
function unauthorized(data, options) {
  // jshint validthis: true
  return this.res.status(401).sendData(data, options);
}

/**
 * Handles forbidden requests
 * @param {mixed} data - The data that should be send to the client
 * @param {Object|String} options - Response configuration object or view template name
 * @return A Response with status 403 set
 */
function forbidden(data, options) {
  // jshint validthis: true
  return this.res.status(403).sendData(data, options);
}

/**
 * Handles not found requests
 * Set status 'Not found'
 * @param {mixed} data - The data that should be send to the client
 * @param {Object|String} options - Response configuration object or view template name
 * @return The given Response with status code 404 set and the 404 template if it can be
 * redered correctly, otherwise the error object set as json body
 */
function notFound(data, options) {
  // jshint validthis: true
  return this.res.status(404).sendData(data, options || '404');
}

/**
 * Handles unprocessable requests
 *
 * @param {mixed} data - The data that should be send to the client
 * @param {Object|String} options - Response configuration object or view template name
 * @return A Response with status 422 set
 */
function unprocessableEntity(data, options) {
  // jshint validthis: true
  return this.res.status(422).sendData(data, options);
}

// 500

/**
 * 500 (Server Error) Response
 * @param {mixed} data - The data that should be send to the client
 * @param {Object|String} options - Response configuration object or view template name
 * @return A Response with status 500 set
 * @usage
 * return res.serverError();
 * return res.serverError(err);
 * return res.serverError(err, 'some/specific/error/view');
 */

function serverError(data, options) {
  // jshint validthis: true
  // Get access to request and response
  var req = this.req;
  var res = this.res;
  console.log('serverError', data, options);
  // Set status code
  res.status(500);

  // Log error to console
  if (data !== undefined) {
    console.error('Sending 500 ("Server Error") response: \n', data);
  } else {
    console.error('Sending empty 500 ("Server Error") response');
  }

  // Only include errors in response if application environment
  // is not set to 'production'
  if (process.env.NODE_ENV === 'production') {
    data = undefined;
  }

  // If appropriate, serve data as JSON
  if (req.xhr || req.accepts('application/json')) {
    return res.json(data);
  }

  // if a template string is given as the options param
  // use it to render a view
  var viewFilePath = (typeof options === 'string') ? options : options && options.view;

  // If a view was provided in options, serve it.
  // Otherwise try to guess an appropriate view, or if that doesn't
  // work, just send JSON.
  if (viewFilePath) {
    return res.view(viewFilePath, {
      data: data
    });
  } else {
    // If no second argument provided, try to serve the default view,
    // but fall back to sending JSON if any errors occur.
    return res.view('500', {
      data: data
    }, function (err, html) {
      if (err) {
        if (err.code === 'E_VIEW_FAILED') { // log a missing view
          console.log('res.serverError() :: Could not locate view for error page (sending JSON instead).  Details: ', err);
        } else { // serious error
          console.error('res.serverError() :: When attempting to render error page view, an error occured (sending JSON instead).  Details: ', err);
        }
        return res.json(data);
      }

      return res.send(html);
    });
  }
}

/**
 * Handle generic errors on requests.
 * Set status 'Internal Server Error'
 * @param {http.ServerResponse} res - The outgoing response object
 * @param {Error} [err] - The error that occurred during the request
 * @return The given Response with a error status code set (defaults to 500)
 * and the error object set as response body.
 */
function handleError(err, options) {
  // jshint validthis: true
  // Get access to response object
  var res = this.res;
  var statusCode;

  logger.log('handleError', err, options);

  if (err.name && err.name === 'ValidationError') {
    return res.badRequest(err);
  }

  try {
    statusCode = err.status || 500;
    // set the status as a default
    res.status(statusCode);

    if (statusCode !== 500 && typeof res[statusCode] === 'function') {
      return res[statusCode](err);
    }
  } catch (e) {
    logger.log('Exception while handling error: %s', e);
  }

  return res.serverError(err);
}

/**
 * Handles requests that are not implemented.
 * Set status 'Not implemented'
 *
 * @param {http.ServerResponse} res - The outgoing response object
 * @param {Error} [err] - The error that occurred during the request
 * @return The given Response with status code 501 set and the error
 * object set as json body
 */
function notImplemented(data, options) {
  // jshint validthis: true
  return this.res.status(501).sendData(data, options);
}

/**
 * Extend responses with the following methods:
 * 200, 201, 204, 400, 401, 403, 404, 422, 500, 501, sendData, ok, created,
 * noContent, badRequest, unauthorized, forbidden, notFound, unprocessableEntity,
 * handleError, notImplemented, serverError
 * @module {Object} responses
 * @requires {@link responses:ok}
 * @requires {@link responses:errors}
 */

// export all available reponse methods
var customResponses = _.assign({
  sendData: sendData,
  html: html
}, ok, errors);

/**
 * The default error handler
 * Binds the handleError method of reponse to the request and response objects.
 * Passes the error to following handlers. The handleErrpr function will send the best
 * response available.
 *
 * @type {Function}
 * @param {Error|String} err - The error that occured during the request-response-cycle
 * @param {http.IncomingMessage} req - The request message object
 * @param {http.ServerResponse} res - The outgoing response object
 * @param {function} [next] - The next handler callback
 */
exports.defaultErrorHandler = function defaultErrorHandler(err, req, res, next) {
  console.error('defaultErrorHandler', req.originalUrl, res.statusCode, err);
  _.bind(customResponses.handleError, { res: res, req: req }, err);
  // pass the error to following handlers (if next if passed)
  if (next) {
    return next(err);
  }
};

/**
 * Removes reserved properties from the request body.
 *
 * @param {http.IncomingMessage} req - The request message object
 * @param {http.ServerResponse} res - The outgoing response object
 * @param {function} next - The next handler callback
 */
exports.removeReservedSchemaKeywords = function removeReservedSchemaKeywords(req, res, next) {
  if (!_.isObject(req.body)) {
    return next();
  }
  req.body = _.omit(req.body, reserved);
  return next();
};

/**
 * Extends the response with custom methods.
 *
 * Attach custom responses to `res` object,
 * provide access to `req` and `res` in their `this` context.
 * @param {http.IncomingMessage} req - The request message object
 * @param {http.ServerResponse} res - The outgoing response object
 * @param {function} next - The next handler callback
 */
exports.extendResponse = function extendResponse(req, res, next) {
  _.forEach(customResponses, function eachResponse(fn, name) {
    res[name] = _.bind(fn, {
      req: req,
      res: res
    });
  });
  return next();
};
