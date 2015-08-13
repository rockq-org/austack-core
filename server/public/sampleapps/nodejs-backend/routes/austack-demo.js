var express = require('express');
var router = express.Router();
var Austack = require('austack-nodejs');

router.get('/me', me);
router.get('/createNewUser', createNewUser);

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
  var newUser = {
    mobile: '18959264502'
  };

  Austack.createNewUser(newUser)
    .then(function (res) {
      var user = res.body;
      console.log(user);
      res.render('index', {
        message: user
      });
    })
    .catch(function (err) {
      console.log(err);
      res.render('index', {
        message: err.message
      });
    });
}