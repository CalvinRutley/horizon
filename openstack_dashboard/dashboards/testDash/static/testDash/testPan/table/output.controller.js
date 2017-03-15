/**
 * Created by lbaerisw on 12/17/16.
 */
(function() {
    'use strict';

    angular
        .module('horizon.dashboard.testDash.output')
        .controller('OutController', OutController);

    OutController.$inject = [
        '$scope',
        '$q',
        'horizon.framework.widgets.toast.service',
        'horizon.app.core.images.resourceType',
        'horizon.framework.conf.resource-type-registry.service',
        'horizon.app.core.openstack-service-api.userSession',
        'horizon.framework.util.uuid.service'
    ];

    function OutController($scope, $q, toastService, imageResourceTypeCode, registry, userSession) {


        var ctrl = this;
        //table of events, needs to be ordered
        ctrl.eventsTable = [
            {
                tenantID:"a050e8fce5db46de98b557066a43c201",
                name:"Instance Two",
                body:"Launched Successfully",
                requestID:"t7ab407jfide46jj55a45e96m7782jki4",
                time:"13:35:22",
                date:"01/03/2017"
            }
        ];

        ctrl.updateTable = function(newEvent) {
            ctrl.eventsTable.unshift({tenantID: newEvent.tenantID, name: newEvent.name, body: newEvent.body,
                                      requestID: newEvent.requestID, time: newEvent.time, date: newEvent.date});
            //console.log(ctrl.eventsTable);
            $scope.$apply();
        };

        ctrl.responseHandler = function(response) {
            if(response.Message_Type == "Notification") {
                console.log(response.body);
                ctrl.updateTable(response.body);
            }

            else {
                var message = response.request.action;
                message += ': ';

                if(response.body.hasOwnProperty("message")) {
                    message += response.body.message;
                    console.log(response.request.action);

                    if(response.request.action == 'authenticate') {
                        console.log(message);
                        toastService.add('success', message);
                        ctrl.authenticated = true;
                    }
                    else if(response.request.action == 'subscription_create') {
                        console.log(message);
                        toastService.add('success', message);
                        ctrl.subscribed = true;
                    }
                }
                else {
                    message += response.body.error;
                    console.log(message);
                    toastService.add('error', message);
                }
            }
        }

        //testing variables and functions
        var session =  userSession.get();
        ctrl.opensuccess = 0;
        ctrl.msgeventtrigger = 0;
        ctrl.authString = '';
        ctrl.projectId = '';
        ctrl.uuid = '';
        ctrl.token = '';

        ctrl.success = function() {
            ctrl.opensuccess += 1;
        }

        ctrl.received = function() {
            ctrl.msgeventtrigger += 1;
        }

        ctrl.createString = function(string) {
            ctrl.authString = string;
        }

        ctrl.resourceType = registry.getResourceType(imageResourceTypeCode);

        /* Methods are not needed as some code below does it, but leaving there as a reference as this might be the
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

        */

        //websocket stuff
        ctrl.wsroute = '172.29.86.71'; //need to dynamically allocate
        ctrl.connection = 'ws://' + ctrl.wsroute + ':9000'; //need to dynamically allocate

        var ws = new WebSocket(ctrl.connection);
        ctrl.authenticated = false;
        ctrl.subscribed = false;

        var authenticate = function() {
            var authentication = {'action': 'authenticate',
                'headers': {'X-Auth-Token': ctrl.token, 'Client-ID': ctrl.uuid, 'X-Project-ID': ctrl.projectId}};
            ws.send(JSON.stringify(authentication));
            //console.log(JSON.stringify(authentication));
        }

        var subscribe = function() { //somehow have a parameter that allows to set different subscriptions? not priority
            var subscription = {'action': 'subscription_create',
                'headers': {'Client-ID': ctrl.uuid, 'X-Project-ID': ctrl.projectId},
                'body': {'queue_name': 'horizon_events_test', 'ttl': 3600}}; //could dynamically assign queue name
            ws.send(JSON.stringify(subscription));
        }

        //should these events be in the factory, or should the factory simply create the connection and return the WebSocket object?
        //called when connection is opened
        ws.onopen = function() {
            console.log('Websocket connection opened');

            $q.all((userSession.get()).then(function(data) {

            ctrl.projectId = data.project_id;
            ctrl.uuid = data.id;
            ctrl.token = data.token;

            authenticate();
            subscribe();

        }));
            ctrl.success();
        };


        ws.onclose = function(event) {
            console.log(event);
            console.log(event.reason);
            var reason = event.reason;
            console.log(reason);
            console.log('Connection closed because of: ' + reason);
            toastService.add('info', "The websocket connection has closed. Reason: " + reason);
        };

        ws.onerror = function() {
            console.log('Websocket error.');
            toastService.add('error', "Websocket error.");
        };

        ws.onmessage = function(event) {

            //test if message has been received
            ctrl.received();

            //to see contents in console
            console.log(event);

            //parse contents
            var response = JSON.parse(event.data);

            ctrl.responseHandler(response);

        };

    }

})();