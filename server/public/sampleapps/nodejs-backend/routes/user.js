/*
 * GET users listing.
 */
var appJSON = require('../app.json');
var Austack = require('../austack');
var request = require('superagent');
var apiBaseURL = appJSON.apiBaseURL;
var clientId = appJSON.clientId;
var clientSecret = appJSON.clientSecret;

exports.list = function (req, res) {
  res.send("respond with a resource");
};

exports.me = function (req, res) {
  var userJwt = req.headers.authorization;
  Austack.validateUserJwt(userJwt)
    .then(function () {
      var profile = {
        clientId: clientId,
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
};