/**
 * Created by lbaerisw on 12/17/16.
 */
(function() {
    'use strict';

    angular
        .module('Output')
        .controller('OutController', OutController);

    OutController.$inject = [
        '$scope',
        '$q',
        'horizon.framework.widgets.toast.service',
        'horizon.app.core.images.resourceType',
        'horizon.framework.conf.resource-type-registry.service',
        'horizon.app.core.openstack-service-api.settings',
        'horizon.app.core.openstack-service-api.userSession',
        'NotificationService',
        'WebsocketService'
    ];

    function OutController($scope, $q, toastService, imageResourceTypeCode, registry, settings, userSession, NotificationService, WebsocketService) {

        var ctrl = this;

        ctrl.notificationsTable = NotificationService.eventsTable;

    }

})();