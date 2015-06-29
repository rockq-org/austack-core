/* jshint unused:false */
'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var appModel = require('./app.model');

// Clear all apps
function cleanup(done) {
	appModel.model.remove().exec().then(function () { done();	});
}

describe('/api/apps', function () {

	var app;

	// reset app before each test
	beforeEach(function () {
		app = {
			name: 'Dog',
			info: 'Hello, this is dog.',
			active: true
		};
	});

	// Clear apps before each test
	beforeEach(cleanup);

	// Clear apps after each test
	afterEach(cleanup);

	describe('GET', function () {

		it('should respond with JSON array', function (done) {
			request(app)
				.get('/api/apps')
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

		it('should respond with an error for a malformed app id parameter', function (done) {
			request(app)
				.get('/api/apps/malformedid')
				.set('Accept', 'application/json')
				.expect(400)
				.expect('Content-Type', /json/)
				.end(done);
		});

		it('should respond with an not found error for a not existing app id', function (done) {
			request(app)
				.get('/api/apps/cccccccccccccccccccccccc')
				.set('Accept', 'application/json')
				.expect(404)
				.expect('Content-Type', /json/)
				.end(done);
		});

		it('should return a app for its id', function (done) {
			appModel.model(app).save(function (err, doc) {
				request(app)
					.get('/api/apps/' + doc._id)
					.set('Accept', 'application/json')
					.expect(200)
					.expect('Content-Type', /json/)
					.end(function (err, res) {
						if (err) {
							return done(err);
						}
						res.body.should.be.an.Object.and.have.properties(app);
						res.body._id.should.exist;
						done();
					});
			});
		});

	});

	describe('POST', function () {

		it('should create a new app and respond with 201 and the created app', function (done) {
			request(app)
				.post('/api/apps')
				.set('Accept', 'application/json')
				.send(app)
				.expect(201)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					res.body.should.be.an.Object.and.have.properties(app);
					res.body._id.should.exist;
					done();
				});
		});

	});

	describe('PUT', function () {

		it('should return an error if attempting a put without an id', function (done) {
			request(app)
				.put('/api/apps')
				.set('Accept', 'application/json')
				.send(app)
				.expect(404)
				.end(done);
		});

		it('should respond with an not found error for a not existing app id', function (done) {
			request(app)
				.put('/api/apps/cccccccccccccccccccccccc')
				.set('Accept', 'application/json')
				.expect(404)
				.expect('Content-Type', /json/)
				.end(done);
		});

		it('should update a app and respond with the updated app', function (done) {
			request(app)
				.post('/api/apps')
				.set('Accept', 'application/json')
				.send(app)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					app.name = 'Cat';
					// check if id is stripped on update
					app._id = 'malformed id string';
					request(app)
						.put('/api/apps/' + res.body._id)
						.set('Accept', 'application/json')
						.send(app)
						.expect(200)
						.expect('Content-Type', /json/)
						.end(function (err, res) {
							if (err) {
								return done(err);
							}
							res.body.should.be.an.Object.and.have.property('name', app.name);
							done();
						});
				});
		});

	});

	describe('DELETE', function () {

		it('should return an error if attempting a delete without an id', function (done) {
			request(app)
				.delete('/api/apps')
				.set('Accept', 'application/json')
				.expect(404)
				.end(done);
		});

		it('should respond with an not found error for a not existing app id', function (done) {
			request(app)
				.delete('/api/apps/cccccccccccccccccccccccc')
				.set('Accept', 'application/json')
				.expect(404)
				.expect('Content-Type', /json/)
				.end(done);
		});

		it('should delete a app and respond with 204', function (done) {
			request(app)
				.post('/api/apps')
				.set('Accept', 'application/json')
				.send(app)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					request(app)
						.delete('/api/apps/' + res.body._id)
						.set('Accept', 'application/json')
						.expect(204)
						.end(done);
				});
		});
	});
});
