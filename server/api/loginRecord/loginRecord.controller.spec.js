/* jshint unused:false */
'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var loginRecordModel = require('./loginRecord.model');

// Clear all loginRecords
function cleanup(done) {
	loginRecordModel.model.remove().exec().then(function () { done();	});
}

describe('/api/loginRecords', function () {

	var loginRecord;

	// reset loginRecord before each test
	beforeEach(function () {
		loginRecord = {
			name: 'Dog',
			info: 'Hello, this is dog.',
			active: true
		};
	});

	// Clear loginRecords before each test
	beforeEach(cleanup);

	// Clear loginRecords after each test
	afterEach(cleanup);

	describe('GET', function () {

		it('should respond with JSON array', function (done) {
			request(app)
				.get('/api/loginRecords')
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

		it('should respond with an error for a malformed loginRecord id parameter', function (done) {
			request(app)
				.get('/api/loginRecords/malformedid')
				.set('Accept', 'application/json')
				.expect(400)
				.expect('Content-Type', /json/)
				.end(done);
		});

		it('should respond with an not found error for a not existing loginRecord id', function (done) {
			request(app)
				.get('/api/loginRecords/cccccccccccccccccccccccc')
				.set('Accept', 'application/json')
				.expect(404)
				.expect('Content-Type', /json/)
				.end(done);
		});

		it('should return a loginRecord for its id', function (done) {
			loginRecordModel.model(loginRecord).save(function (err, doc) {
				request(app)
					.get('/api/loginRecords/' + doc._id)
					.set('Accept', 'application/json')
					.expect(200)
					.expect('Content-Type', /json/)
					.end(function (err, res) {
						if (err) {
							return done(err);
						}
						res.body.should.be.an.Object.and.have.properties(loginRecord);
						res.body._id.should.exist;
						done();
					});
			});
		});

	});

	describe('POST', function () {

		it('should create a new loginRecord and respond with 201 and the created loginRecord', function (done) {
			request(app)
				.post('/api/loginRecords')
				.set('Accept', 'application/json')
				.send(loginRecord)
				.expect(201)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					res.body.should.be.an.Object.and.have.properties(loginRecord);
					res.body._id.should.exist;
					done();
				});
		});

	});

	describe('PUT', function () {

		it('should return an error if attempting a put without an id', function (done) {
			request(app)
				.put('/api/loginRecords')
				.set('Accept', 'application/json')
				.send(loginRecord)
				.expect(404)
				.end(done);
		});

		it('should respond with an not found error for a not existing loginRecord id', function (done) {
			request(app)
				.put('/api/loginRecords/cccccccccccccccccccccccc')
				.set('Accept', 'application/json')
				.expect(404)
				.expect('Content-Type', /json/)
				.end(done);
		});

		it('should update a loginRecord and respond with the updated loginRecord', function (done) {
			request(app)
				.post('/api/loginRecords')
				.set('Accept', 'application/json')
				.send(loginRecord)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					loginRecord.name = 'Cat';
					// check if id is stripped on update
					loginRecord._id = 'malformed id string';
					request(app)
						.put('/api/loginRecords/' + res.body._id)
						.set('Accept', 'application/json')
						.send(loginRecord)
						.expect(200)
						.expect('Content-Type', /json/)
						.end(function (err, res) {
							if (err) {
								return done(err);
							}
							res.body.should.be.an.Object.and.have.property('name', loginRecord.name);
							done();
						});
				});
		});

	});

	describe('DELETE', function () {

		it('should return an error if attempting a delete without an id', function (done) {
			request(app)
				.delete('/api/loginRecords')
				.set('Accept', 'application/json')
				.expect(404)
				.end(done);
		});

		it('should respond with an not found error for a not existing loginRecord id', function (done) {
			request(app)
				.delete('/api/loginRecords/cccccccccccccccccccccccc')
				.set('Accept', 'application/json')
				.expect(404)
				.expect('Content-Type', /json/)
				.end(done);
		});

		it('should delete a loginRecord and respond with 204', function (done) {
			request(app)
				.post('/api/loginRecords')
				.set('Accept', 'application/json')
				.send(loginRecord)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					request(app)
						.delete('/api/loginRecords/' + res.body._id)
						.set('Accept', 'application/json')
						.expect(204)
						.end(done);
				});
		});
	});
});
