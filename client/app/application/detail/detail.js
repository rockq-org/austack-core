(function () {
  'use strict';

  /**
   * Introduce the austackApp.application.list.detail submodule
   * and configure it.
   *
   * @requires ui.router
   * @requires angularMoment
   */

  angular
    .module('austackApp.application.detail', [
      'ui.router',
      'angularMoment'
    ])
    .config(configureApplicationListDetail);

  // inject configApplicationRoutes dependencies
  configureApplicationListDetail.$inject = ['$stateProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the 'application.detail' state with the detail template
   * paired with the ApplicationDetailController as 'detail' for the
   * 'sidenav' sub view.
   * 'application' is resolved as the application with the id found in
   * the state parameters.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configureApplicationListDetail($stateProvider) {
    // The detail state configuration
    var detailState = {
      name: 'application.detail',
      parent: 'application',
      url: '/:id',
      authenticate: true,
      role: 'admin',
      views: {
        '': {
          templateUrl: 'app/application/detail/detail.html',
          controller: 'ApplicationDetailController',
          controllerAs: 'detail'
        }
      },
      ncyBreadcrumb: {
        label: '{{detail.application.name}}',
        parent: 'application.list'
      },
      resolve: {
        application: resolveApplicationFromArray
      }
    };

    $stateProvider.state(detailState);
  }

  // inject resolveApplicationFromArray dependencies
  resolveApplicationFromArray.$inject = ['applications', '$stateParams', '_'];

  /**
   * Resolve dependencies for the application.detail state
   *
   * @params {Array} applications - The array of applications
   * @params {Object} $stateParams - The $stateParams to read the application id from
   * @returns {Object|null} The application whose value of the _id property equals $stateParams._id
   */
  function resolveApplicationFromArray(applications, $stateParams, _) {
    return _.find(applications, {
      '_id': $stateParams.id
    });
  }

})();
