var Q = require('q');
var appJSON = require('./app.json');
var request = require('superagent');
var apiBaseURL = appJSON.apiBaseURL;
var clientId = appJSON.clientId;
var clientSecret = appJSON.clientSecret;

var Austack = {
    applicationJwt: '',
    validateUserJwt: validateUserJwt,
    getApplicationJwt: getApplicationJwt,
};
module.exports = Austack;

function validateUserJwt(userJwt) {
    var d = Q.defer();

    Austack.getApplicationJwt()
        .then(function(applicationJwt) {
            console.log('start validateUserJwt applicationJwt', applicationJwt);
            request.post(apiBaseURL + '/loginRecords/validateJwt')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + applicationJwt)
                .send({
                    userJwt: userJwt
                })
                .end(function(err, res) {
                    if (err) {
                        console.log(err);
                        console.dir(res);
                        return d.reject(err);
                    }

                    console.log('validateUserJwt', userJwt);
                    d.resolve(userJwt);
                });
        });

    return d.promise;
}

function getApplicationJwt() {
    var d = Q.defer();
    if (Austack.applicationJwt && Austack.applicationJwt != '') {
        d.resolve(Austack.applicationJwt);
        return d.promise;
    }

    request.post(apiBaseURL + '/auth/application')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
            clientId: clientId,
            clientSecret: clientSecret
        })
        .end(function(err, res) {
            if (err) {
                return d.reject(err);
            }
            var applicationJwt = res.body.token;
            console.log('get applicationJwt', applicationJwt);
            Austack.applicationJwt = res.body.token;
            d.resolve(Austack.applicationJwt);
        });

    return d.promise;
}