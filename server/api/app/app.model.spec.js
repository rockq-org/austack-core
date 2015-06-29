/* jshint unused:false */
'use strict';

var should = require('should');

var app = require('./app.model');
var appDefinition = app.definition;
var appSchema= app.schema;
var App = app.model;

var appData = [
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

// Clear all apps
function cleanup(done) {
	App.remove().exec().then(function () { done();	});
}

describe('App Model', function () {

	// Clear apps before testing
	before(cleanup);

	// Clear apps after testing
	after(cleanup);

// Check test conditions for app tests
	it('should start with no apps', function (done) {
		App.find({}, function (err, apps) {
			apps.should.have.length(0);
			done(err);
		});
	});

	describe('basic crud operations', function () {

		var appModel = new App(appData[0]);

		// Clear apps after running this suite
		after(cleanup);

		it('should insert a new app', function (done) {
			appModel.save(function (err, app) {
				app.should.have.properties(appModel);
				done(err);
			});
		});

		it('should insert a list of apps', function (done) {
			App.create(appData, function (err, app) {
				// slice err argument
				Array.prototype.slice.call(arguments, 1)
					.should.have.lengthOf(appData.length);
				done(err);
			});
		});


		it('should find a app by _id property', function (done) {
			App.findById(appModel._id, function (err, app) {
				app.should.have.properties(appData[0]);
				done(err);
			});
		});

		it('should update a app', function (done) {
			appModel.name = 'foo';
			appModel.save(function (err) { done(err);	});
		});

		it('should remove a app', function (done) {
			appModel.remove(function (err) { done(err); });
		});
	}); // crud
});
