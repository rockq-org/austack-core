/* jshint unused:false */
'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var tenantModel = require('./tenant.model');

// Clear all tenants
function cleanup(done) {
	tenantModel.model.remove().exec().then(function () { done();	});
}

describe('/tenant', function () {

	var tenant;

	// reset tenant before each test
	beforeEach(function () {
		tenant = {
			name: 'Dog',
			info: 'Hello, this is dog.',
			active: true
		};
	});

	// Clear tenants before each test
	beforeEach(cleanup);

	// Clear tenants after each test
	afterEach(cleanup);

	describe('GET', function () {

		it('should respond with JSON array', function (done) {
			request(app)
				.get('/tenant')
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

		it('should respond with an error for a malformed tenant id parameter', function (done) {
			request(app)
				.get('/tenant/malformedid')
				.set('Accept', 'application/json')
				.expect(400)
				.expect('Content-Type', /json/)
				.end(done);
		});

		it('should respond with an not found error for a not existing tenant id', function (done) {
			request(app)
				.get('/tenant/cccccccccccccccccccccccc')
				.set('Accept', 'application/json')
				.expect(404)
				.expect('Content-Type', /json/)
				.end(done);
		});

		it('should return a tenant for its id', function (done) {
			tenantModel.model(tenant).save(function (err, doc) {
				request(app)
					.get('/tenant/' + doc._id)
					.set('Accept', 'application/json')
					.expect(200)
					.expect('Content-Type', /json/)
					.end(function (err, res) {
						if (err) {
							return done(err);
						}
						res.body.should.be.an.Object.and.have.properties(tenant);
						res.body._id.should.exist;
						done();
					});
			});
		});

	});

	describe('POST', function () {

		it('should create a new tenant and respond with 201 and the created tenant', function (done) {
			request(app)
				.post('/tenant')
				.set('Accept', 'application/json')
				.send(tenant)
				.expect(201)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					res.body.should.be.an.Object.and.have.properties(tenant);
					res.body._id.should.exist;
					done();
				});
		});

	});

	describe('PUT', function () {

		it('should return an error if attempting a put without an id', function (done) {
			request(app)
				.put('/tenant')
				.set('Accept', 'application/json')
				.send(tenant)
				.expect(404)
				.end(done);
		});

		it('should respond with an not found error for a not existing tenant id', function (done) {
			request(app)
				.put('/tenant/cccccccccccccccccccccccc')
				.set('Accept', 'application/json')
				.expect(404)
				.expect('Content-Type', /json/)
				.end(done);
		});

		it('should update a tenant and respond with the updated tenant', function (done) {
			request(app)
				.post('/tenant')
				.set('Accept', 'application/json')
				.send(tenant)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					tenant.name = 'Cat';
					// check if id is stripped on update
					tenant._id = 'malformed id string';
					request(app)
						.put('/tenant/' + res.body._id)
						.set('Accept', 'application/json')
						.send(tenant)
						.expect(200)
						.expect('Content-Type', /json/)
						.end(function (err, res) {
							if (err) {
								return done(err);
							}
							res.body.should.be.an.Object.and.have.property('name', tenant.name);
							done();
						});
				});
		});

	});

	describe('DELETE', function () {

		it('should return an error if attempting a delete without an id', function (done) {
			request(app)
				.delete('/tenant')
				.set('Accept', 'application/json')
				.expect(404)
				.end(done);
		});

		it('should respond with an not found error for a not existing tenant id', function (done) {
			request(app)
				.delete('/tenant/cccccccccccccccccccccccc')
				.set('Accept', 'application/json')
				.expect(404)
				.expect('Content-Type', /json/)
				.end(done);
		});

		it('should delete a tenant and respond with 204', function (done) {
			request(app)
				.post('/tenant')
				.set('Accept', 'application/json')
				.send(tenant)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					request(app)
						.delete('/tenant/' + res.body._id)
						.set('Accept', 'application/json')
						.expect(204)
						.end(done);
				});
		});
	});
});
