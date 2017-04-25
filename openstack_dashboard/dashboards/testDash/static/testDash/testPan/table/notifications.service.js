/**
 * Created by lbaerisw on 4/4/17.
 */
(function() {
  'use strict';

  angular
      .module('Output')
      .factory('NotificationService', NotificationService);

  NotificationService.$inject = [
    '$rootScope',
    '$log'
  ];

  function NotificationService($rootScope, $log) {
    var factory = {};

    //bindable members
    factory.updateTable = updateTable;
    factory.notificationHandler = notificationHandler;

    //TODO(Calvin): Move UUID stuff over to WS Service & reenable
    //$q.all([settings.getSetting('UUID')]).then(allowed);

    //function allowed(results) {
    //    console.log(results);
    //    ctrl.uuid2 = results[0];
    //console.log(ctrl.uuid2);
    //}

    factory.eventsTable = [];

    function updateTable(newEvent) {
      factory.eventsTable.unshift({
        tenantID: newEvent.tenantID, name: newEvent.name, body: newEvent.body,
        requestID: newEvent.requestID, time: newEvent.time, date: newEvent.date
      });
      $log.log(factory.eventsTable);
      $rootScope.$evalAsync();
    }

    //needs to be updated to contain conditional logic about which notifications to store etc
    function notificationHandler(response) {
      $log.log(response.body);
      factory.updateTable(response.body);
    }

    return factory;

  }
})();
