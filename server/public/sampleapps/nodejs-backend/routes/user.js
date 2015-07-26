/*
 * GET users listing.
 */
var appJSON = require('../app.json');
var request = require('superagent');
var apiBaseURL = appJSON.apiBaseURL;
var clientId = appJSON.clientId;
var clientSecret = appJSON.clientSecret;

exports.list = function (req, res) {
  res.send("respond with a resource");
};

exports.me = function (req, res) {
  var userJwt = req.headers.authorization;
  austack.validateUserJwt(userJwt)
    .then(function () {
      var profile = {
        clientId: clientId
          // maybe other user data dave want to insert
      };
      res.status(200).json(profile);
    })
    .fail(function () {
      res.status(401).json({
        msg: 'user force logout'
      });
    });
};