/* jshint unused:false */
'use strict';

var should = require('should');

var tenant = require('./tenant.model');
var tenantDefinition = tenant.definition;
var tenantSchema= tenant.schema;
var Tenant = tenant.model;

var tenantData = [
	{
		name: 'Dog',
		info: 'Hello, this is dog.',
		active: true
	}, {
		name: 'Bugs Bunny',
		info: 'Famous Bunny.',
		active: true
	}, {
		name: 'Nyan Cat',
		info: 'No comment.',
		active: false
	}
];

// Clear all tenants
function cleanup(done) {
	Tenant.remove().exec().then(function () { done();	});
}

describe('Tenant Model', function () {

	// Clear tenants before testing
	before(cleanup);

	// Clear tenants after testing
	after(cleanup);

// Check test conditions for tenant tests
	it('should start with no tenants', function (done) {
		Tenant.find({}, function (err, tenants) {
			tenants.should.have.length(0);
			done(err);
		});
	});

	describe('basic crud operations', function () {

		var tenantModel = new Tenant(tenantData[0]);

		// Clear tenants after running this suite
		after(cleanup);

		it('should insert a new tenant', function (done) {
			tenantModel.save(function (err, tenant) {
				tenant.should.have.properties(tenantModel);
				done(err);
			});
		});

		it('should insert a list of tenants', function (done) {
			Tenant.create(tenantData, function (err, tenant) {
				// slice err argument
				Array.prototype.slice.call(arguments, 1)
					.should.have.lengthOf(tenantData.length);
				done(err);
			});
		});


		it('should find a tenant by _id property', function (done) {
			Tenant.findById(tenantModel._id, function (err, tenant) {
				tenant.should.have.properties(tenantData[0]);
				done(err);
			});
		});

		it('should update a tenant', function (done) {
			tenantModel.name = 'foo';
			tenantModel.save(function (err) { done(err);	});
		});

		it('should remove a tenant', function (done) {
			tenantModel.remove(function (err) { done(err); });
		});
	}); // crud
});
