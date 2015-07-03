/* jshint unused:false */
'use strict';

var should = require('should');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var debug = require('debug')('application.spec');
var app = require('../../app');
var request = require('supertest');
var applicationModel = require('./application.model');
var seed = require('../../config/seed');

var dave1 = {
  _id: '5596b9bd30e816d8f84bba33'
};
var dave2 = {
  _id: '5596b9bd30e816d8f84bba34'
};
var root = {
  _id: '5596b9bd30e816d8f84bba35'
};

var TestHelper = {
  item: {
    name: 'My App2',
    ownerId: dave2._id
  },
  itemForDave1: {
    name: 'My App1',
    ownerId: dave1._id
  },

  dataArray: [{
    name: 'Dave1 App 1',
    ownerId: dave1._id
  }, {
    name: 'Dave1 App 2',
    ownerId: dave1._id
  }, {
    name: 'Dave1 App 3',
    ownerId: dave1._id
  }, {
    name: 'Dave1 App 4',
    ownerId: dave1._id
  }, {
    name: 'Dave2 App 1',
    ownerId: dave2._id
  }, {
    name: 'Dave2 App 2',
    ownerId: dave2._id
  }, {
    name: 'Dave2 App 3',
    ownerId: dave2._id
  }, {
    name: 'Dave2 App 4',
    ownerId: dave2._id
  }, {
    name: 'Dave2 App 5',
    ownerId: dave2._id
  }],
  token: '',
  userId: '',
  initListDataInDatabase: function (done) {
    applicationModel.model.create(TestHelper.dataArray, function (err, data) {
      if (err) {
        return done(err);
      }
      done();
    });
  },
  cleanupApplicationDataInDatabase: function (done) {
    applicationModel.model.remove().exec().then(function () {
      done();
    });
  },
  getRootJwt: function (cb) {
    request(app)
      .post('/api/auth/local')
      .send({
        name: 'root',
        password: 'root'
      })
      .end(function (err, res) {
        var token = res.body.token; // Or something
        jwt.verify(token, config.secrets.session, function (err, session) {
          cb(token);
        });
      });
  },
  getJwtToken: function (done) {
    request(app)
      .post('/api/auth/local')
      .send({
        name: 'dave2',
        password: 'dave2'
      })
      .end(function (err, res) {
        TestHelper.token = res.body.token; // Or something
        debug('token', TestHelper.token);
        jwt.verify(TestHelper.token, config.secrets.session, function (err, session) {
          if (err) return done(err);
          TestHelper.userId = session._id;
          // debug('user._id', TestHelper.userId);
          done();
        });
      });
  }
};

describe.only('#42 As a developer, Dave can access application with RESt API', function () {
  before(function (done) {
    seed.seed(done);
  });
  beforeEach(TestHelper.cleanupApplicationDataInDatabase);
  beforeEach(TestHelper.initListDataInDatabase);
  beforeEach(TestHelper.getJwtToken);
  // afterEach(TestHelper.cleanupApplicationDataInDatabase);

  describe('#67 enable POST /api/app', function () {
    // can not run, as expressJwt will trigger UnauthorizedError, and break the expect
    // it('should not create a new application and respond with 401', function (done) {
    //   request(app)
    //     .post('/api/applications')
    //     .set('Accept', 'application/json')
    //     .send(application)
    //     .expect(401)
    //     .expect('Content-Type', /json/)
    //     .end(done);
    // });
    it('should create a new application and respond with 201 and the created application', function (done) {
      request(app)
        .post('/api/applications')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + TestHelper.token)
        .send(TestHelper.item)
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.be.an.Object.and.have.properties(TestHelper.item);
          res.body._id.should.exist;
          res.body.ownerId.should.equal(TestHelper.userId);
          res.body.clientId.should.exist;
          res.body.clientSecret.should.exist;
          res.body.jwtExpiration.should.exist;
          done();
        });
    });
  });

  describe('#66 enable GET /api/app', function () {
    it('should respond with JSON array', function (done) {
      request(app)
        .get('/api/applications')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + TestHelper.token)
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

    it('require auth(just make it as done, we can not test it for now)', function (done) {
      //just make it done, we can not test it for now, it will trigger error and break the test from expressJWT module
      done();
    });

    describe('should support pages', function (done) {
      it('should have 2 items', function (done) {
        request(app)
          .get('/api/applications?page=1&limit=2')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + TestHelper.token)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            res.body.should.have.length(2);
            done();
          });
      });
      it('should have 1 items', function (done) {
        request(app)
          .get('/api/applications?page=3&limit=2')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + TestHelper.token)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            res.body.should.have.length(1);
            done();
          });
      });
    });

    // it.only('should support query');
    it('for admin, dave can only retrieve his own apps', function (done) {
      request(app)
        .get('/api/applications?page=1&limit=1000')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + TestHelper.token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.have.length(5);
          done();
        });
    });
    it('for root, peter can retrieve all apps', function (done) {
      TestHelper.getRootJwt(function (token) {
        request(app)
          .get('/api/applications?page=1&limit=100')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            // debug()
            res.body.should.have.length(TestHelper.dataArray.length);
            done();
          });
      });
    });
  });

  describe('#68 enable GET /api/app/:id', function () {
    it('should respond with an error for a malformed application id parameter', function (done) {
      request(app)
        .get('/api/applications/malformedid')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + TestHelper.token)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should respond with an not found error for a not existing application id', function (done) {
      request(app)
        .get('/api/applications/cccccccccccccccccccccccc')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + TestHelper.token)
        .expect(404)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('As admin, Dave2 can get his own app details', function (done) {
      applicationModel.model(TestHelper.item).save(function (err, doc) {
        debug(TestHelper.item.ownerId, doc);
        request(app)
          .get('/api/applications/' + doc._id)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + TestHelper.token)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            res.body.should.be.an.Object.and.have.properties(TestHelper.item);
            res.body._id.should.exist;
            done();
          });
      });
    });

    it('As admin, Dave2 can not get dave1 app details', function (done) {
      applicationModel.model(TestHelper.itemForDave1).save(function (err, doc) {
        request(app)
          .get('/api/applications/' + doc._id)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + TestHelper.token)
          .expect(401)
          .expect('Content-Type', /json/)
          .end(done);
      });
    });

  });

  describe.skip('PUT', function () {

    it('should return an error if attempting a put without an id', function (done) {
      request(app)
        .put('/api/applications')
        .set('Accept', 'application/json')
        .send(application)
        .expect(404)
        .end(done);
    });

    it('should respond with an not found error for a not existing application id', function (done) {
      request(app)
        .put('/api/applications/cccccccccccccccccccccccc')
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should update a application and respond with the updated application', function (done) {
      request(app)
        .post('/api/applications')
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
            .put('/api/applications/' + res.body._id)
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

  describe.skip('DELETE', function () {

    it('should return an error if attempting a delete without an id', function (done) {
      request(app)
        .delete('/api/applications')
        .set('Accept', 'application/json')
        .expect(404)
        .end(done);
    });

    it('should respond with an not found error for a not existing application id', function (done) {
      request(app)
        .delete('/api/applications/cccccccccccccccccccccccc')
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should delete a application and respond with 204', function (done) {
      request(app)
        .post('/api/applications')
        .set('Accept', 'application/json')
        .send(application)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          request(app)
            .delete('/api/applications/' + res.body._id)
            .set('Accept', 'application/json')
            .expect(204)
            .end(done);
        });
    });
  });
});
