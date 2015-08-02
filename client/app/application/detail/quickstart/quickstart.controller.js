(function () {
  'use strict';

  /**
   * Register the edit controller as ApplicationQuickstartController
   */

  angular
    .module('austackApp.application.detail.quickstart')
    .controller('ApplicationQuickstartController', ApplicationQuickstartController);

  // add ApplicationQuickstartController dependencies to inject
  ApplicationQuickstartController.$inject = ['$state', '$http', 'application', 'Config'];

  /**
   * ApplicationQuickstartController constructor
   */
  function ApplicationQuickstartController($state, $http, application, Config) {
    var vm = this;

    // the current application to display
    vm.application = application;

    vm.ionicStep1 = '<script src="js/austack-variables.js"></script>';
    vm.ionicStep2 = [
      '<script src="lib/angular-jwt/dist/angular-jwt.js"></script>',
      '<script src="js/angular-austack.js"></script>'
    ].join('\n');
    vm.ionicStep3 = 'step 3 code here';
    vm.ionicStep4 = 'step 4 code here';

    vm.nodeStep1 = [
      'var cors = require(\'cors\');',
      'app.use(cors({ origin: \'*\' }));'
    ].join('\n');
    vm.nodeStep2 = [
      'var Austack = require(\'./austack-nodejs\');',
      'ustack.getApplicationJwt()',
      '  .then(function (applicationJwt) {',
      '    console.log(\'success get applicationJwt\', applicationJwt);',
      '  });'
    ].join('\n');
    vm.nodeStep3 = 'app.get(\'/me\', user.me);';
    vm.nodeStep4 = [
      'var Austack = require(\'../austack-nodejs\');',
      'exports.me = function (req, res) {',
      '  var userJwt = req.headers.authorization; ',
      '  Austack.validateUserJwt(userJwt).then(function () {',
      '    var profile = {',
      '      clientId: clientId,',
      '      userOtherInfo: \'some other userInfo dave want to add\'',
      '    };',
      '    console.log(\'success\', profile);',
      '    res.status(200).json(profile);',
      '  }).fail( function () {',
      '    console.log(\'not validate\');',
      '    res.status(401).json({ message: \'user force logout\' });',
      '  });',
      '}'
    ].join('\n');

    vm.downloadBackend = downloadBackend;
    vm.downloadClient = downloadClient;

    function downloadBackend() {
      var appId = vm.application._id;
      $http({
          url: Config.API_URL + 'sampleapps/' + appId + '/nodejs',
          method: 'GET',
          responseType: 'arraybuffer',
          cache: false
        })
        .success(function (data, status) {
          saveAs(new Blob([data], {
            type: 'application/octet-stream'
          }), 'nodejs-backend.zip');
        })
        .error(function (err, status) {
          console.log(err);
        });
    }

    function downloadClient() {
      var appId = vm.application._id;
      $http({
          url: Config.API_URL + 'sampleapps/' + appId + '/ionic',
          method: 'GET',
          responseType: 'arraybuffer',
          cache: false
        })
        .success(function (data, status) {
          saveAs(new Blob([data], {
            type: 'application/octet-stream'
          }), 'ionic-client.zip');
        })
        .error(function (err, status) {
          console.log(err);
        });
    }
  }
})();
