/**
 * Created by crutley on 12/13/16.
 */
(function() {
  'use strict';

  angular
    .module('horizon.dashboard.testDash', [
      'horizon.dashboard.testDash.output'
    ])
    .config(config);

  config.$inject = ['$provide', '$windowProvider'];

  function config($provide, $windowProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'dashboard/testDash/';
    $provide.constant('horizon.dashboard.testDash.basePath', path);
  }

})();