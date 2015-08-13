var express = require('express');
var router = express.Router();
var Austack = require('austack-nodejs');

router.get('/me', me);
router.get('/createNewUser/:mobile', createNewUser);

module.exports = router;

function me(req, res, next) {
  var userJwt = req.headers.authorization;
  Austack.validateUserJwt(userJwt)
    .then(function () {
      var profile = {
        clientId: Austack.get('clientId'),
        //下面得数据你可以通过查询你的数据库用户表数据来添加
        userOtherInfo: 'some other userInfo dave want to add'
      };
      console.log('success', profile);
      res.status(200).json(profile);
    })
    .fail(function () {
      console.log('not validate');
      res.status(401).json({
        message: 'user force logout'
      });
    });
}

function createNewUser(req, res, next) {
  var mobile = req.params.mobile;

  Austack.createNewUser({
      mobile: mobile
    })
    .then(function (data) {
      var message = 'create user success: mobile: ' + data.mobile + ' uid: ' + data.uid;

      res.render('index', {
        message: message
      });
    })
    .catch(function (err) {
      var data = {
        message: err.body.message,
        error: err
      };
      console.log(data);
      res.render('error', data);
    });
}