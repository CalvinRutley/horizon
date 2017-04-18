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

        //need to be set
        factory.token = '';
        factory.uuid = '';
        factory.projectID = '';

        //should come from config
        factory.wsroute = '172.29.86.71';
        factory.wsport = '9000';
        factory.queues = ['horizon_events_test'];

        factory.connection = 'ws://' + factory.wsroute + ':' + factory.wsport;
        factory.authenticated = false;
        factory.subscribed = false;
        factory.activeSubscriptions = [];
        factory.authenticate = authenticate;
        factory.subscribe = subscribe;
        factory.subscribeAll = subscribeAll;
        factory.addZaqarQueue = addZaqarQueue;
        factory.updateSubscriptions = updateSubscriptions;
        factory.updateSubscribed = updateSubscribed;
        factory.responseHandler = responseHandler;
        var ws = new WebSocket(factory.connection);

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

        function updateSubscriptions(subscription) {
            if(!factory.activeSubscriptions.contains(subscription)) {
                factory.activeSubscriptions.push(subscription);
            }
        }

        function updateSubscribed() {
            if(factory.activeSubscriptions.length() >= 1) {
                factory.subscribed = true;
            }
            else {
                factory.subscribed = false;
            }
        }

        function responseHandler(response) {
            if (response.Message_Type == "Notification") {
                NotificationService.notificationHandler(response);
            }

            else {
                var message = response.request.action;
                message += ': ';

                if (response.body.hasOwnProperty("message")) {
                    message += response.body.message;
                    console.log(response.request.action);

                    if (response.request.action == 'authenticate') {
                        console.log(message);
                        //toastService.add('success', message);
                        factory.authenticated = true;
                    }
                    else if (response.request.action == 'subscription_create') {
                        console.log(message);
                        //toastService.add('success', message);
                        factory.updateSubscriptions(message);
                        factory.updateSubscribed();
                    }
                }
                else {
                    message += response.body.error;
                    console.log(message);
                    //toastService.add('error', message);
                }
            }
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
            factory.responseHandler(response);
        };

        //return the factory
        return factory;

    }

})();