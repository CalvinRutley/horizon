/**
 * Created by lbaerisw on 12/17/16.
 */
(function() {
    'use strict';

    angular
        .module('horizon.dashboard.testDash.output')
        .controller('OutController', OutController);

    OutController.$inject = [
        'horizon.framework.widgets.toast.service'
    ];

    function OutController(toast) {

        var ctrl = this;
        //table of events, needs to be ordered
        ctrl.eventsTable = [
            {
                name:"Instance Two",
                body:"Launched Successfully",
                time:"13:35:22",
                date:"2017:01:19"
            }
        ];

        ctrl.updateTable = function(newEvent) {
            console.log(newEvent.name);
            ctrl.eventsTable.push({name: newEvent.name, body: newEvent.body, time: newEvent.time, date: newEvent.date});
            console.log(ctrl.eventsTable);
        };

        //testing variables and functions
        ctrl.opensuccess = 0;
        ctrl.msgeventtrigger = 0;
        ctrl.authString = '';

        ctrl.success = function() {
            ctrl.opensuccess += 1;
        }

        ctrl.received = function() {
            ctrl.msgeventtrigger += 1;
        }

        ctrl.createString = function(string) {
            ctrl.authString = string;
        }

        //websocket stuff
        var wsroute = '172.29.86.71'; //need to dynamically allocate
        var connection = 'ws://' + wsroute + ':9000'; //need to dynamically allocate
        var ws = new WebSocket(connection);

        //should these events be in the factory, or should the factory simply create the connection and return the WebSocket object?
        //called when connection is opened
        ws.onopen = function() {
            ctrl.success();
            var client_id = '7254b2c6-a30c-478d-8b12-46bf71fbc41e'; //need to figure out how to dynamically get
            var project_id = 'c3ca2ccaeafa4267a84cc0164e66c874'; //replace as needed
            var authtoken = 'gAAAAABYk65lk9WUV1wCvvTwAI_SvTIEq2PUxmo-as7VMpfCg2vLyoZfP2mJXjn1dgYYphnieSB2mL8wCGp-DzWM5Gwr9v8CnvTVSeA3gzFrpx5MXe2nSDj6RzlZxp730hAm1XWhMDcrTd9rg3M00EfVpk4BQ4tIWNELHbqfboOOCjJsz0-a3ls';

            ctrl.success();
            authenticate();
            ctrl.success();
            subscribe();
            ctrl.success();

            function authenticate() {
                var authentication = {'action': 'authenticate',
                    'headers': {'X-Auth-Token': authtoken, 'Client-ID': client_id, 'X-Project-ID': project_id}};
                ws.send(JSON.stringify(authentication));

            };

            function subscribe() { //somehow have a parameter that allows to set different subscriptions? not priority
                var subscription = {'action': 'subscription_create',
                    'headers': {'Client-ID': client_id, 'X-Project-ID': project_id},
                    'body': {'queue_name': 'horizon_events_test', 'ttl': 3600}}; //could dynamically assign queue name
                ws.send(JSON.stringify(subscription));
            };
        };

        ws.onclose = function(event) {
            console.log(event);
            var reason = JSON.parse(event.reason);
            console.log(reason);
            console.log('connection closed');
            toast.add('info', "The websocket connection has closed.");
        };

        ws.onerror = function() {
            console.log('websocket error');
            toast.add('error', "Websocket error.");
        };

        ws.onmessage = function(event) {

            //test if message has been received
            ctrl.received();

            //to see contents in console
            console.log(event);

            //parse contents
            var response = JSON.parse(event.data);

            //This entire bit will move into its own function for cleaner code
            if(response.Message_Type == "Notification") {
                console.log(response.body);
                ctrl.updateTable(response.body);
            }

            else {
                var message = response.request.action;
                message += ': ';
                if(response.body.hasOwnProperty("message")) {
                    message += response.body.message;
                    console.log(message);
                    toast.add('success', message);
                }
                else {
                    message += response.body.error;
                    console.log(message);
                    toast.add('error', message);
                }
            }
        };

    }

})();