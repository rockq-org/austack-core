/*
 * GET home page.
 */
var appJSON = require('../app.json');
var request = require('superagent');
var apiBaseURL = appJSON.apiBaseURL;
var clientId = appJSON.clientId;
var clientSecret = appJSON.clientSecret;

/**
 * get this application's repo from austack api service.
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function _getToken(callback) {
  request.post(apiBaseURL + '/auth/application')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      clientId: clientId,
      clientSecret: clientSecret
    })
    .end(function (err, res) {
      if (err) {
        return callback(err);
      }
      callback(null, res.body);
    });
}

exports.index = function (req, res) {
  _getToken(function (err, token) {
    res.render('index', {
      title: 'Sample APP Backend',
      token: JSON.stringify(token),
      err: err
    });
  });
};