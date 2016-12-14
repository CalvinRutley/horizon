/**
 * Created by crutley on 12/13/16.
 */
(function() {
  'use strict';

  angular
    .module('horizon.dashboard.testDash.testPan')
    .controller('MyController', MyController);

  MyController.$inject = [
    'horizon.framework.widgets.toast.service',
    '$http'
  ];

  function MyController(toast, $http) {
    var ctrl = this;

    toast.add('info', "Please browse our fresh local fruits!");

    $http.get('/static/testDash/data.json')
      .success(function(data) {
        ctrl.fruits = data;
      });
  }

})();