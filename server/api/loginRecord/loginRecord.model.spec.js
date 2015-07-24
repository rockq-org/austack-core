/* jshint unused:false */
'use strict';

var should = require('should');

var loginRecord = require('./loginRecord.model');
var loginRecordDefinition = loginRecord.definition;
var loginRecordSchema= loginRecord.schema;
var LoginRecord = loginRecord.model;

var loginRecordData = [
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

// Clear all loginRecords
function cleanup(done) {
	LoginRecord.remove().exec().then(function () { done();	});
}

describe('LoginRecord Model', function () {

	// Clear loginRecords before testing
	before(cleanup);

	// Clear loginRecords after testing
	after(cleanup);

// Check test conditions for loginRecord tests
	it('should start with no loginRecords', function (done) {
		LoginRecord.find({}, function (err, loginRecords) {
			loginRecords.should.have.length(0);
			done(err);
		});
	});

	describe('basic crud operations', function () {

		var loginRecordModel = new LoginRecord(loginRecordData[0]);

		// Clear loginRecords after running this suite
		after(cleanup);

		it('should insert a new loginRecord', function (done) {
			loginRecordModel.save(function (err, loginRecord) {
				loginRecord.should.have.properties(loginRecordModel);
				done(err);
			});
		});

		it('should insert a list of loginRecords', function (done) {
			LoginRecord.create(loginRecordData, function (err, loginRecord) {
				// slice err argument
				Array.prototype.slice.call(arguments, 1)
					.should.have.lengthOf(loginRecordData.length);
				done(err);
			});
		});


		it('should find a loginRecord by _id property', function (done) {
			LoginRecord.findById(loginRecordModel._id, function (err, loginRecord) {
				loginRecord.should.have.properties(loginRecordData[0]);
				done(err);
			});
		});

		it('should update a loginRecord', function (done) {
			loginRecordModel.name = 'foo';
			loginRecordModel.save(function (err) { done(err);	});
		});

		it('should remove a loginRecord', function (done) {
			loginRecordModel.remove(function (err) { done(err); });
		});
	}); // crud
});
