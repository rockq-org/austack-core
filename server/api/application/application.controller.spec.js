/* jshint unused:false */
'use strict';

var should = require('should');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var debug = require('debug')('application');
var app = require('../../app');
var request = require('supertest');
var applicationModel = require('./application.model');

// Clear all applications
function cleanup(done) {
  applicationModel.model.remove().exec().then(function () {
    done();
  });
}

describe('/api/application', function () {

  var application;
  var token;
  var userId;

  // reset application before each test
  beforeEach(function (done) {
    application = {
      appName: 'My App',
      // ownerId: '5594659cb3692fa9394ee884',
      // clientId: '5594659cb3982fa9394ee884',
      // clientSecret: 'someClientSecret',
      // jwtExpiration: 36000,
      // callbackUrls: ['http://localhost', 'http://baidu.com'],
      // corsDomains: ['http://localhost', 'http://baidu.com']
    };

    request(app)
      .post('/api/auth/local')
      .send({
        name: '18959264502',
        password: 'laijinyue'
      })
      .end(function (err, res) {
        token = res.body.token; // Or something
        jwt.verify(token, config.secrets.session, function (err, session) {
          if (err) return done(err);
          userId = session._id;
          debug('user._id', userId);
          done();
        });
      });
  });

  // Clear applications before each test
  beforeEach(cleanup);

  // Clear applications after each test
  // afterEach(cleanup);

  describe.only('POST', function () {
    it('should create a new application and respond with 201 and the created application', function (done) {
      request(app)
        .post('/api/application')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .send(application)
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          debug('res.body', res.body);
          res.body.should.be.an.Object.and.have.properties(application);
          res.body._id.should.exist;
          res.body.ownerId.should.equal(userId);
          res.body.clientId.should.exist;
          res.body.clientSecret.should.exist;
          res.body.jwtExpiration.should.exist;
          done();
        });
    });
  })

  describe('GET', function () {

    it('should respond with JSON array', function (done) {
      request(app)
        .get('/api/application')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.be.instanceof(Array);
          done();
        });
    });

    it('should respond with an error for a malformed application id parameter', function (done) {
      request(app)
        .get('/api/application/malformedid')
        .set('Accept', 'application/json')
        .expect(400)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should respond with an not found error for a not existing application id', function (done) {
      request(app)
        .get('/api/application/cccccccccccccccccccccccc')
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should return a application for its id', function (done) {
      applicationModel.model(application).save(function (err, doc) {
        request(app)
          .get('/api/application/' + doc._id)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            res.body.should.be.an.Object.and.have.properties(application);
            res.body._id.should.exist;
            done();
          });
      });
    });

  });

  describe('PUT', function () {

    it('should return an error if attempting a put without an id', function (done) {
      request(app)
        .put('/api/application')
        .set('Accept', 'application/json')
        .send(application)
        .expect(404)
        .end(done);
    });

    it('should respond with an not found error for a not existing application id', function (done) {
      request(app)
        .put('/api/application/cccccccccccccccccccccccc')
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should update a application and respond with the updated application', function (done) {
      request(app)
        .post('/api/application')
        .set('Accept', 'application/json')
        .send(application)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          application.name = 'Cat';
          // check if id is stripped on update
          application._id = 'malformed id string';
          request(app)
            .put('/api/application/' + res.body._id)
            .set('Accept', 'application/json')
            .send(application)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
              if (err) {
                return done(err);
              }
              res.body.should.be.an.Object.and.have.property('name', application.name);
              done();
            });
        });
    });

  });

  describe('DELETE', function () {

    it('should return an error if attempting a delete without an id', function (done) {
      request(app)
        .delete('/api/application')
        .set('Accept', 'application/json')
        .expect(404)
        .end(done);
    });

    it('should respond with an not found error for a not existing application id', function (done) {
      request(app)
        .delete('/api/application/cccccccccccccccccccccccc')
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should delete a application and respond with 204', function (done) {
      request(app)
        .post('/api/application')
        .set('Accept', 'application/json')
        .send(application)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          request(app)
            .delete('/api/application/' + res.body._id)
            .set('Accept', 'application/json')
            .expect(204)
            .end(done);
        });
    });
  });
});
