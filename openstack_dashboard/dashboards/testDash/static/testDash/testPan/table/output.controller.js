
(function() {
  'use strict';

  angular
    .module('horizon.dashboard.testDash.output')
    .controller('OutController', OutController);

  function OutController() {
    var ctrl = this;

      ctrl.eventsTable = [
            {
                name:"instance1",
                body:"Blown up!"
            },
            {
                name:"network2",
                body:"Launched successfully!"
            } //example objects
        ];

      ctrl.fruits = [
            { id: 4019, name: "apple", inStock: 75},
            { id: 4232, name: "banana", inStock: 120},
            { id: 4610, name: "cantaloupe", inStock: 98},
            { id: 4872, name: "durian", inStock: 4}
        ];
  }

})();