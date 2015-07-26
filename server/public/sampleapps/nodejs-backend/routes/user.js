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
  console.log(req.headers);
  var profile = {
    clientId: clientId
  };
  return res.status(200).json(profile);

  var token = req.headers.authorization;
  austack.validateJwt(token)
    .then(function (argument) {
      res.status(200).json({
        token: token
      });
    });
};