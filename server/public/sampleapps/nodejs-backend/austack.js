var appJSON = require('app.json');
var request = require('superagent');
var apiBaseURL = appJSON.apiBaseURL;
var clientId = appJSON.clientId;
var clientSecret = appJSON.clientSecret;

exports.validateJwt = function (token) {
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