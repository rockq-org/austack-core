/**
 * Utilities for mongoose
 */
var Q = require('q');
var Config = require('../../config');

exports.getQuery = _getQuery;
exports.getPaginateOptions = _getPaginateOptions;

/**
 * get mongoose Query find parameters from req.
 * @param  {[type]} req [description]
 * @return {Promise}     if query does not exist, resolve as null.
 * if query is not null but not in JSON string format, reject with error.
 * 
 */
function _getQuery(req) {
  return Q.fcall(function () {
    if (req.query['q'])
      return JSON.parse(req.query['q'])
    return;
  });
}

/**
 * support get paginate params
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function _getPaginateOptions(req) {
  var query = req.query;
  var page = parseInt(query.page) || 1;
  var limit = parseInt(query.limit) || Config.limit;
  page = page < 1 ? 1 : page;
  limit = limit < 1 ? 1 : limit;

  // other options
  var columns = query['fields'] || null;
  var sortBy = query['sortby'] || null;

  return {
    page: page,
    limit: limit,
    columns: columns,
    sortBy: sortBy
  };
}
