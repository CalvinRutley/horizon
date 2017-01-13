/**
 * Created by lbaerisw on 12/17/16.
 */
(function() {
    'use strict';

    angular
        .module('horizon.dashboard.testDash.output')
        .controller('OutController', OutController);

    function OutController() {

        var ctrl = this;
        //table of events, needs to be ordered
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

        ctrl.updateTable = function(newEvent) {
            ctrl.eventsTable.push({name: newEvent.name, body: newEvent.body});
        };

        ctrl.opensuccess = 0;
        ctrl.connclosed = 0;
        ctrl.authString = '';
        ctrl.receivedString = '';

        ctrl.success = function() {
            ctrl.opensuccess += 1;
        }

        ctrl.close = function() {
            ctrl.connclosed += 1;
        }

        ctrl.createString = function(string) {
            ctrl.authString = string;
        }

        ctrl.createReceivedString = function(nstring) {
            ctrl.receivedString = nstring;
        }


        var wsroute = '172.29.86.71'; //need to dynamically allocate
        var connection = 'ws://' + wsroute + ':9000'; //need to dynamically allocate
        var ws = new WebSocket(connection);

        //should these events be in the factory, or should the factory simply create the connection and return the WebSocket object?
        //called when connection is opened
        ws.onopen = function() {
            ctrl.success();
            var client_id = 'a050e8fce5db46de98b557066a43c201'; //need to figure out how to dynamically get
            var project_id = 'c3ca2ccaeafa4267a84cc0164e66c874'; //replace as needed
            var authtoken = 'gAAAAABYeRxwxIMhmOGQw_Wb8W7E0IuBePBOT3gdFlib1t3PEwkjQS7F-qVKHDomVvAxn5CQi6MnakrHBBrOnaW3UxcVSamAS2W0NuykUqjIxmfsBAfed31jphuueE1SHBRWRTFmsxElZgdNTSbJiwi1VoZkx0NBGD9gZw8w_1j9uMegKZf57JI';

            ctrl.success();
            authenticate();
            ctrl.success();
            subscribe();
            ctrl.success();

            function authenticate() {
                var authentication = {'action': 'authenticate',
                    'headers': {'X-Auth-Token': authtoken, 'Client-ID': client_id, 'X-Project-ID': project_id}};


                //console.log(JSON.stringify(authentication));
                ctrl.createString(JSON.stringify(authentication));
                ws.send(JSON.stringify(authentication));

            };

            function subscribe() { //somehow have a parameter that allows to set different subscriptions? not priority
                var subscription = {'action': 'subscription_create',
                    'headers': {'Client-ID': client_id, 'X-Project-ID': project_id},
                    'body': {'queue_name': 'horizon_events_test', 'ttl': 3600}}; //could dynamically assign queue name
                ws.send(JSON.stringify(subscription));
            };
        };

        ws.onclose = function() {
            ctrl.close();
            console.log('connection closed'); //need to handle connection close?
        };

        ws.onerror = function() {
            console.log('websocket error'); //need to handle errors?
        };

        ws.onmessage = function(event) {
            var newEvent = JSON.parse(event.data);
            ctrl.createReceivedString(newEvent);
            ctrl.updateTable(newEvent.body);
        };

    }

})();