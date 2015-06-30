/* jshint unused:false */
'use strict';

var should = require('should');

var application = require('./application.model');
var applicationDefinition = application.definition;
var applicationSchema= application.schema;
var Application = application.model;

var applicationData = [
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

// Clear all applications
function cleanup(done) {
	Application.remove().exec().then(function () { done();	});
}

describe('Application Model', function () {

	// Clear applications before testing
	before(cleanup);

	// Clear applications after testing
	after(cleanup);

// Check test conditions for application tests
	it('should start with no applications', function (done) {
		Application.find({}, function (err, applications) {
			applications.should.have.length(0);
			done(err);
		});
	});

	describe('basic crud operations', function () {

		var applicationModel = new Application(applicationData[0]);

		// Clear applications after running this suite
		after(cleanup);

		it('should insert a new application', function (done) {
			applicationModel.save(function (err, application) {
				application.should.have.properties(applicationModel);
				done(err);
			});
		});

		it('should insert a list of applications', function (done) {
			Application.create(applicationData, function (err, application) {
				// slice err argument
				Array.prototype.slice.call(arguments, 1)
					.should.have.lengthOf(applicationData.length);
				done(err);
			});
		});


		it('should find a application by _id property', function (done) {
			Application.findById(applicationModel._id, function (err, application) {
				application.should.have.properties(applicationData[0]);
				done(err);
			});
		});

		it('should update a application', function (done) {
			applicationModel.name = 'foo';
			applicationModel.save(function (err) { done(err);	});
		});

		it('should remove a application', function (done) {
			applicationModel.remove(function (err) { done(err); });
		});
	}); // crud
});
