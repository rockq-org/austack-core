var Q = require('q');
var appJSON = require('./app.json');
var request = require('superagent');
var apiBaseURL = appJSON.apiBaseURL;
var clientId = appJSON.clientId;
var clientSecret = appJSON.clientSecret;

var Austack = {
  data: {
    applicationJwt: ''
  },
  // method
  // 验证用户的JWT是否合法（主要是为了验证是否被用户强制退出登录而导致的过期）
  validateUserJwt: validateUserJwt,
  // 1. 获取jwt
  getApplicationJwt: getApplicationJwt,
  // 2. 获取用户列表
  getUserList: getUserList,
  // 3. 创建新用户
  createNewUser: createNewUser,
  // 4. 获取用户详情
  getUserDetail: getUserDetail,
  // 5. 更新用户
  updateUser: updateUser,
  // 6. 删除用户
  deleteUser: deleteUser,
};

module.exports = Austack;

function validateUserJwt(userJwt) {
  var d = Q.defer();

  Austack.getApplicationJwt()
    .then(function (applicationJwt) {
      console.log('start validateUserJwt applicationJwt', applicationJwt);
      request.post(apiBaseURL + '/loginRecords/validateJwt')
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
  if (Austack.applicationJwt && Austack.applicationJwt != '') {
    d.resolve(Austack.applicationJwt);
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
      var applicationJwt = res.body.token;
      console.log('get applicationJwt', applicationJwt);
      Austack.applicationJwt = res.body.token;
      d.resolve(Austack.applicationJwt);
    });

  return d.promise;
}

function getUserList() {
  // body...
}

function createNewUser() {
  // body...
}

function getUserDetail() {
  // body...
}

function updateUser() {
  // body...
}

function deleteUser() {
  // body...
}