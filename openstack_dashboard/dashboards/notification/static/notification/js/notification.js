/* Additional JavaScript for notification. */
(function () {
  'use strict';

  /**
   * @ngdoc module
   * @ngname horizon.dashboard.project
   * @description
   * Dashboard module to host project panels.
   */
  angular
    .module('horizon.dashboard.project', [
      'horizon.dashboard.project.containers',
      'horizon.dashboard.project.workflow'
    ])
    .config(config);

  config.$inject = [
    '$provide',
    '$windowProvider'
  ];

  /**
   * @name horizon.dashboard.project.basePath
   * @param {Object} $provide
   * @param {Object} $windowProvider
   * @description Base path for the project dashboard
   * @returns {undefined} Returns nothing
   */
  function config($provide, $windowProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'dashboard/project/';
    $provide.constant('horizon.dashboard.project.basePath', path);
  }

})();
