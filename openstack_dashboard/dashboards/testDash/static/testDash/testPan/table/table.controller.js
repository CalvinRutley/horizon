/**
 * Created by crutley on 12/13/16.
 */
(function() {
  'use strict';

  angular
    .module('horizon.dashboard.testDash.testPan')
    .controller('MyController', MyController);

  function MyController() {
    var ctrl = this;

    //toast.add('info', "Please browse our fresh local fruits!");
    //toast.add('Arrival', "This is just to see how they arrive"); //so adding another one, cause strange issues, no color
                                                                 //box, and no automatic removal of the notification
    ctrl.fruits = [
            { id: 4019, name: "apple", inStock: 75},
            { id: 4232, name: "banana", inStock: 120},
            { id: 4610, name: "cantaloupe", inStock: 98},
            { id: 4872, name: "durian", inStock: 4}
        ];

/*
    $http.get('/static/testDash/data.json')
      .success(function(data) {
        ctrl.fruits = data;
      });
*/
  }

})();