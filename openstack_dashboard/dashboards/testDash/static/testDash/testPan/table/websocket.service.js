/**
 * Created by lbaerisw on 4/6/17.
 */
(function() {
    'use strict';

    angular.module('Output').factory('WebsocketService', WebsocketService);

    WebsocketService.$inject = [
        '$q',
        'horizon.app.core.openstack-service-api.userSession',
        'NotificationService'
    ];

    function WebsocketService($q, userSession, NotificationService) {
        var factory = {};

        factory.messages = 0;
        factory.authenticated = false;
        factory.subscribed = false;
        factory.wsroute = '172.29.86.71';
        factory.wsport = '9000';
        factory.connection = 'ws://' + factory.wsroute + ':' + factory.wsport;
        factory.queues = ['horizon_events_test'];
        factory.authenticate = authenticate;
        factory.subscribe = subscribe;
        factory.subscribeAll = subscribeAll;
        factory.addZaqarQueue = addZaqarQueue;
        var ws = new WebSocket(factory.connection);

        //need to be set
        factory.token = '';
        factory.uuid = '';
        factory.projectID = '';

        function authenticate() {
            var authentication = {'action': 'authenticate',
                'headers': {'X-Auth-Token': factory.token, 'Client-ID': factory.uuid, 'X-Project-ID': factory.projectId}};
            ws.send(JSON.stringify(authentication));
            console.log(JSON.stringify(authentication));
        }

        function subscribe(queueName) {
            var subscription = {'action': 'subscription_create',
                'headers': {'Client-ID': factory.uuid, 'X-Project-ID': factory.projectId},
                'body': {'queue_name': queueName, 'ttl': 3600}};
            ws.send(JSON.stringify(subscription));
        }

        function subscribeAll() {
            for(var i=0; i < factory.queues.length; i++) {
                factory.subscribe(factory.queues[i]);
            }
        }

        function addZaqarQueue(queueName) {
            factory.queues.push(queueName);
            console.log(factory.queues);
        }

        //Websocket Events
        ws.onopen = function() {
            console.log('Websocket connection opened');

            $q.all((userSession.get()).then(function (data) {

                factory.projectId = data.project_id;
                factory.uuid = data.id;
                factory.token = data.token;

                factory.authenticate();
                factory.subscribeAll();


            }));

        };

        ws.onclose = function(event) {
            console.log(event);
            console.log(event.reason);
            var reason = event.reason;
            console.log(reason);
            console.log('Connection closed because of: ' + reason);
            //toastService.add('info', "The websocket connection has closed. Reason: " + reason);
        };

        ws.onerror = function() {
            //console.log('Websocket error.');
            //toastService.add('error', "Websocket error.");
        };

        ws.onmessage = function(event) {
            console.log(event);
            var response = JSON.parse(event.data);
            NotificationService.responseHandler(response);
        };

        //return the factory
        return factory;

    }

})();