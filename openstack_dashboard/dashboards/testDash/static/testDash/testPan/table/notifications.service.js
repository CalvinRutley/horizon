/**
 * Created by lbaerisw on 4/4/17.
 */
(function() {
    'use strict';

    angular
        .module('Output')
        .factory('NotificationService', NotificationService);

    NotificationService.$inject = [
        '$rootScope'
    ];

    function NotificationService($rootScope) {
        var factory = {};

        //bindable members
        factory.updateTable = updateTable;
        factory.notificationHandler = notificationHandler;

        //$q.all([settings.getSetting('UUID')]).then(allowed);

        //function allowed(results) {
        //    console.log(results);
        //    ctrl.uuid2 = results[0];
        //    console.log(ctrl.uuid2);
        //}

        //table of events, needs to be ordered
        factory.eventsTable = [];


        function updateTable(newEvent) {
            factory.eventsTable.unshift({
                tenantID: newEvent.tenantID, name: newEvent.name, body: newEvent.body,
                requestID: newEvent.requestID, time: newEvent.time, date: newEvent.date
            });
            console.log(factory.eventsTable);
            $rootScope.$evalAsync();
        };


        //needs to be updated to contain conditional logic about which notifications to store etc
        function notificationHandler(response) {
            console.log(response.body);
            factory.updateTable(response.body);
        }

        /*

        //testing variables and functions
        var session = userSession.get();
        ctrl.opensuccess = 0;
        ctrl.msgeventtrigger = 0;
        ctrl.authString = '';
        ctrl.projectId = '';
        ctrl.uuid = '';
        ctrl.token = '';

        ctrl.success = function () {
            ctrl.opensuccess += 1;
        }

        ctrl.received = function () {
            ctrl.msgeventtrigger += 1;
        }

        ctrl.createString = function (string) {
            ctrl.authString = string;
        }

        ctrl.resourceType = registry.getResourceType(imageResourceTypeCode);

        /.* Methods are not needed as some code below does it, but leaving there as a reference as this might be the
         best way to do it, will need to check.

         function setProject(session) {
         ctrl.projectId = session.project_id;
         }

         function setToken(session) {
         ctrl.token = session.token;
         }

         function setUser(session) {
         ctrl.uuid = session.id;
         }

         *./

        //websocket stuff
        ctrl.wsroute = '172.29.86.71'; //need to dynamically allocate
        ctrl.connection = 'ws://' + ctrl.wsroute + ':9000'; //need to dynamically allocate

        var ws = new WebSocket(ctrl.connection);
        ctrl.authenticated = false;
        ctrl.subscribed = false;

        var authenticate = function () {
            var authentication = {
                'action': 'authenticate',
                'headers': {'X-Auth-Token': ctrl.token, 'Client-ID': ctrl.uuid, 'X-Project-ID': ctrl.projectId}
            };
            ws.send(JSON.stringify(authentication));
            //console.log(JSON.stringify(authentication));
        }

        var subscribe = function () { //somehow have a parameter that allows to set different subscriptions? not priority
            var subscription = {
                'action': 'subscription_create',
                'headers': {'Client-ID': ctrl.uuid, 'X-Project-ID': ctrl.projectId},
                'body': {'queue_name': 'horizon_events_test', 'ttl': 3600}
            }; //could dynamically assign queue name
            ws.send(JSON.stringify(subscription));
        }

        //should these events be in the factory, or should the factory simply create the connection and return the WebSocket object?
        //called when connection is opened
        ws.onopen = function () {

            console.log('Websocket connection opened');

            $q.all((userSession.get()).then(function (data) {

                ctrl.projectId = data.project_id;
                ctrl.uuid = data.id;
                ctrl.token = data.token;

                authenticate();
                subscribe();

            }));

            ctrl.success();
        };


        ws.onclose = function (event) {
            console.log(event);
            console.log(event.reason);
            var reason = event.reason;
            console.log(reason);
            console.log('Connection closed because of: ' + reason);
            toastService.add('info', "The websocket connection has closed. Reason: " + reason);
        };

        ws.onerror = function () {
            console.log('Websocket error.');
            toastService.add('error', "Websocket error.");
        };

        ws.onmessage = function (event) {

            //test if message has been received
            ctrl.received();

            //to see contents in console
            console.log(event);

            //parse contents
            var response = JSON.parse(event.data);

            ctrl.responseHandler(response);
        }

        */

        return factory;

    }
})();