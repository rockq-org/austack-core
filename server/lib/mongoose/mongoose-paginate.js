var async = require('async');

/*
 * @method paginate
 * @param {Object} query Mongoose Query Object
 * @param {Object} pagination options
 * Extend Mongoose Models to paginate queries
 */

function paginate(q, options, callback) {
  /*jshint validthis:true */
  logger.debug('mongoose paginate query', q);
  logger.debug('mongoose paginate options', options);
  var model = this;
  var columns = options.columns || null;
  var sortBy = options.sortBy || null;
  var populate = options.populate || null;
  var pageNumber = options.page || 1;
  var resultsPerPage = options.limit || 10;
  var skipFrom = (pageNumber - 1) * resultsPerPage;
  var query = model.find(q);

  callback = callback || function () {};

  if (columns !== null) {
    query = query.select(options.columns);
  }
  query = query.skip(skipFrom).limit(resultsPerPage);
  if (sortBy !== null) {
    query.sort(sortBy);
  }
  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach(function (field) {
        query = query.populate(field);
      });
    } else {
      query = query.populate(populate);
    }
  }
  async.parallel({
    results: function (callback) {
      query.exec(callback);
    },
    count: function (callback) {
      model.count(q, function (err, count) {
        callback(err, count);
      });
    }
  }, function (error, data) {
    if (error) {
      return callback(error);
    }
    callback(null, data.results, pageNumber, Math.ceil(data.count / resultsPerPage) || 1, data.count);
  });
}

module.exports = function (schema) {
  schema.statics.paginate = paginate;
};
