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
        done();
      });
  });

  it('createNewUser', function (done) {
    var data = {
      mobile: '18959264502'
    };

    Austack.createNewUser(data)
      .then(function (user) {
        console.log(user);
        done();
      })
      .catch(function (err) {
        done();
      })
  });
});