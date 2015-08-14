var Q = require('q');
var request = require('superagent');

var Austack = {
  data: {
    clientId: '',
    apiBaseURL: '',
    clientSecret: '',
    applicationJwt: '',
  },
  get: get,
  set: set,
  init: init,
  // method
  // 验证用户的JWT是否合法（主要是为了验证是否被用户强制退出登录而导致的过期）
  validateUserJwt: validateUserJwt,
  // 1. 获取jwt
  getApplicationJwt: getApplicationJwt
};

module.exports = Austack;

function init(cfg) {
  Austack.set('repoName', cfg.repoName);
  Austack.set('clientId', cfg.clientId);
  Austack.set('apiBaseURL', cfg.apiBaseURL);
  Austack.set('clientSecret', cfg.clientSecret);
}

function get(key) {
  if (Austack.data[key]) {
    return Austack.data[key];
  }

  return null;
}

function set(key, val) {
  Austack.data[key] = val;

  return Austack;
}

function validateUserJwt(userJwt) {
  var d = Q.defer();

  Austack.getApplicationJwt()
    .then(function (applicationJwt) {
      console.log('start validateUserJwt applicationJwt', applicationJwt);
      request.post(Austack.get('apiBaseURL') + '/loginRecords/validateJwt')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + applicationJwt)
        .send({
          userJwt: userJwt
        })
        .end(function (err, res) {
          if (err) {
            console.log(err);
            console.dir(res);
            return d.reject(err);
          }

          console.log('validateUserJwt', userJwt);
          d.resolve(userJwt);
        });
    });

  return d.promise;
}

function getApplicationJwt() {
  var d = Q.defer();
  var applicationJwt = Austack.get('applicationJwt');
  if (applicationJwt) {
    console.log('use applicationJwt from cache');
    d.resolve(applicationJwt);
    return d.promise;
  }

  request.post(Austack.get('apiBaseURL') + '/auth/application')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send({
      clientId: Austack.get('clientId'),
      clientSecret: Austack.get('clientSecret')
    })
    .end(function (err, res) {
      if (err) {
        return d.reject(err);
      }

      var applicationJwt = res.body.token;
      console.log('get applicationJwt', applicationJwt);
      Austack.set('applicationJwt', res.body.token);
      d.resolve(applicationJwt);
    });

  return d.promise;
}