(function () {
  'use strict';

  /**
   * Introduce the austackApp.application.list.edit module
   * and configure it.
   *
   * @requires 'ui.router',
   * @requires 'ngMaterial',
   * @requires austackApp.mongooseError
   * @requires austackApp.application.service
   */

  angular
    .module('austackApp.application.edit', [
      'ui.router',
      'ngMaterial',
      'austackApp.mongooseError',
      'austackApp.application.service'
    ])
    .config(configureApplicationListEdit);

  // inject configApplicationListEdit dependencies
  configureApplicationListEdit.$inject = ['$stateProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the application.list.edit state with the edit template
   * paired with the ApplicationEditController as 'edit' for the
   * 'detail@application.list' view.
   * 'application' is resolved as the application with the id found in
   * the state parameters.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configureApplicationListEdit($stateProvider) {
    // The edit state configuration.
    var editState = {
      name: 'application.edit',
      parent: 'application',
      url: '/:id/edit',
      authenticate: true,
      role: 'admin',
      views: {
        '': {
          templateUrl: 'app/application/edit/edit.html',
          controller: 'ApplicationEditController',
          controllerAs: 'edit',
          resolve: {
            application: resolveApplicationFromArray
          }
        }
      },
      ncyBreadcrumb: {
        label: '编辑 {{edit.application.name}}',
        parent: 'application.list'
      }
    };

    $stateProvider.state(editState);
  }

  // inject resolveApplicationDetailRoute dependencies
  resolveApplicationFromArray.$inject = ['applications', '$stateParams', '_'];

  /**
   * Resolve dependencies for the application.list.edit state. Get the application
   * from the injected Array of applications by using the '_id' property.
   *
   * @params {Array} applications - The array of applications
   * @params {Object} $stateParams - The $stateParams to read the application id from
   * @params {Object} _ - The lodash service to find the requested application
   * @returns {Object|null} The application whose value of the _id property equals $stateParams._id
   */
  function resolveApplicationFromArray(applications, $stateParams, _) {
    //	return Application.get({id: $stateParams.id}).$promise;
    return _.find(applications, {
      '_id': $stateParams.id
    });
  }

})();
