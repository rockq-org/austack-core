/* jshint unused:false */
'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var appUserModel = require('./appUser.model');

// Clear all appUsers
function cleanup(done) {
	appUserModel.model.remove().exec().then(function () { done();	});
}

describe('/api/appUsers', function () {

	var appUser;

	// reset appUser before each test
	beforeEach(function () {
		appUser = {
			name: 'Dog',
			info: 'Hello, this is dog.',
			active: true
		};
	});

	// Clear appUsers before each test
	beforeEach(cleanup);

	// Clear appUsers after each test
	afterEach(cleanup);

	describe('GET', function () {

		it('should respond with JSON array', function (done) {
			request(app)
				.get('/api/appUsers')
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

		it('should respond with an error for a malformed appUser id parameter', function (done) {
			request(app)
				.get('/api/appUsers/malformedid')
				.set('Accept', 'application/json')
				.expect(400)
				.expect('Content-Type', /json/)
				.end(done);
		});

		it('should respond with an not found error for a not existing appUser id', function (done) {
			request(app)
				.get('/api/appUsers/cccccccccccccccccccccccc')
				.set('Accept', 'application/json')
				.expect(404)
				.expect('Content-Type', /json/)
				.end(done);
		});

		it('should return a appUser for its id', function (done) {
			appUserModel.model(appUser).save(function (err, doc) {
				request(app)
					.get('/api/appUsers/' + doc._id)
					.set('Accept', 'application/json')
					.expect(200)
					.expect('Content-Type', /json/)
					.end(function (err, res) {
						if (err) {
							return done(err);
						}
						res.body.should.be.an.Object.and.have.properties(appUser);
						res.body._id.should.exist;
						done();
					});
			});
		});

	});

	describe('POST', function () {

		it('should create a new appUser and respond with 201 and the created appUser', function (done) {
			request(app)
				.post('/api/appUsers')
				.set('Accept', 'application/json')
				.send(appUser)
				.expect(201)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					res.body.should.be.an.Object.and.have.properties(appUser);
					res.body._id.should.exist;
					done();
				});
		});

	});

	describe('PUT', function () {

		it('should return an error if attempting a put without an id', function (done) {
			request(app)
				.put('/api/appUsers')
				.set('Accept', 'application/json')
				.send(appUser)
				.expect(404)
				.end(done);
		});

		it('should respond with an not found error for a not existing appUser id', function (done) {
			request(app)
				.put('/api/appUsers/cccccccccccccccccccccccc')
				.set('Accept', 'application/json')
				.expect(404)
				.expect('Content-Type', /json/)
				.end(done);
		});

		it('should update a appUser and respond with the updated appUser', function (done) {
			request(app)
				.post('/api/appUsers')
				.set('Accept', 'application/json')
				.send(appUser)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					appUser.name = 'Cat';
					// check if id is stripped on update
					appUser._id = 'malformed id string';
					request(app)
						.put('/api/appUsers/' + res.body._id)
						.set('Accept', 'application/json')
						.send(appUser)
						.expect(200)
						.expect('Content-Type', /json/)
						.end(function (err, res) {
							if (err) {
								return done(err);
							}
							res.body.should.be.an.Object.and.have.property('name', appUser.name);
							done();
						});
				});
		});

	});

	describe('DELETE', function () {

		it('should return an error if attempting a delete without an id', function (done) {
			request(app)
				.delete('/api/appUsers')
				.set('Accept', 'application/json')
				.expect(404)
				.end(done);
		});

		it('should respond with an not found error for a not existing appUser id', function (done) {
			request(app)
				.delete('/api/appUsers/cccccccccccccccccccccccc')
				.set('Accept', 'application/json')
				.expect(404)
				.expect('Content-Type', /json/)
				.end(done);
		});

		it('should delete a appUser and respond with 204', function (done) {
			request(app)
				.post('/api/appUsers')
				.set('Accept', 'application/json')
				.send(appUser)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					request(app)
						.delete('/api/appUsers/' + res.body._id)
						.set('Accept', 'application/json')
						.expect(204)
						.end(done);
				});
		});
	});
});
