/**
 * Created by lbaerisw on 12/17/16.
 */
(function() {
  'use strict';
  angular
      .module('Output')
      .controller('OutController', OutController);

  OutController.$inject = [
    'NotificationService',
    'WebsocketService'
  ];

  function OutController(NotificationService, WebsocketService) {

    var ctrl = this;
    ctrl.notificationsTable = NotificationService.eventsTable;

  }

})();
