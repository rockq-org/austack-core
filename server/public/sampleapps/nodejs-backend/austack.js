var Q = require('q');
var appJSON = require('app.json');
var request = require('superagent');
var apiBaseURL = appJSON.apiBaseURL;
var clientId = appJSON.clientId;
var clientSecret = appJSON.clientSecret;
var austack = {
  applicationJwt: '',
  validateUserJwt: validateUserJwt,
  getApplicationJwt: getApplicationJwt,
};
module.exports = austack;

function validateUserJwt(userJwt) {
  var d = Q.defer();

  var applicationJwt = '';
  austack.getApplicationJwt()
    .then(function (applicationJwt) {
      request.post(apiBaseURL + '/loginRecords/validateJwt')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer' + applicationJwt)
        .send({
          userJwt: userJwt
        })
        .end(function (err, res) {
          if (err) {
            return d.reject(err);
          }

          d.resolve(userJwt);
        });
    });

  return d.promise;
}

function getApplicationJwt() {
  var d = Q.defer();
  if (austack.applicationJwt) {
    d.resolve(austack.applicationJwt);
    return d.promise;
  }

  request.post(apiBaseURL + '/auth/application')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      clientId: clientId,
      clientSecret: clientSecret
    })
    .end(function (err, res) {
      if (err) {
        return d.reject(err);
      }

      austack.applicationJwt = res.body.token;
      d.resolve(austack.applicationJwt);
    });

  return d.promise;
}