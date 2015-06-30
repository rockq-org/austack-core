'use strict';

var utility = require("../../utils/utility");
var Q = require('q');
var should = require("should");
var request = require('superagent');
var cfg = utility.commonConfig;
var url = require('url');
var host = (global.url === "" || global.url === undefined) ? cfg.defaultURL : global.url;

var token;

describe('Authentication', function () {

  // login user
  beforeEach(function (done) {
    login(host, cfg.credential.name, cfg.credential.password).then(function (tk) {
      token = tk;
      done();
    }, function (err) {
      done(err);
    });
  });

  // logout user
  afterEach(function (done) {
    token = null;
    done();
  });

  it('should get information of Dave.', function (done) {
    request.get(host + '/api/users/me')
      .set('Authorization', 'Bearer ' + token)
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          /**
	       * {
					_id: '55925c4bee8459c0b8c2d864',
					active: true,
					name: 'dave',
					role: 'admin'
			}
        	*/
          res.body.should.have.property('name', 'dave');
          res.body.should.have.property('active', true);
          res.body.should.have.property('role', 'admin');
          done();
        }
      });
  });

  function login(host, name, password) {
    var deferred = Q.defer();
    request.post(host + '/api/auth/local')
      .send({
        name: 'dave',
        password: 'auth4fun'
      })
      .end(function (err, res) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(res.body.token);
        }
      });

    return deferred.promise;
  }

});
