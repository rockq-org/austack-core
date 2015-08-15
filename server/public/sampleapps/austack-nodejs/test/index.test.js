var Austack = require('../index.js');

describe('Austack nodejs sdk', function () {
  var appJwt = '';

  before(function (done) {
    Austack.init({
      clientId: 'dcfcda8154d9df04e66f4fcb',
      apiBaseURL: 'http://localhost:9001/api',
      clientSecret: 'b68b2b2f6dbce8cbe6c12cc6',
    });
    Austack.getApplicationJwt()
      .then(function (result) {
        appJwt = result;
        console.log('success get appJwt ', appJwt);
        done();
      });
  });
  after(function (done) {
    Austack.getApplicationJwt()
      .then(function (result) {
        console.log('TODO: delete all test data');
        done();
      });
  });

  it('createNewUser', function () {
    var data = {
      mobile: '18959264509'
    };

    return Austack.createNewUser(data);
  });

  it('getUserDetail', function () {
    var data = {
      mobile: '18959264509'
    };

    return Austack.getUserDetail(data);
  });


});