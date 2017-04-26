/**
 * Created by crutley on 12/13/16.
 */
(function() {
  'use strict';

  angular
    .module('horizon.dashboard.testDash', [
      'Output'
    ])
    .config(config);

  config.$inject = ['$provide', '$windowProvider', '$routeProvider'];

  function config($provide, $windowProvider, $routeProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'testDash/';
    $provide.constant('horizon.dashboard.testDash.basePath', path);

    $routeProvider.when('/testDash', {
      templateUrl: path + 'testPan/table/table.html'
    });

  }

})();
