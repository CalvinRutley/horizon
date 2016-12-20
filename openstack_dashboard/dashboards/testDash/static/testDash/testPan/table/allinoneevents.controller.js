/**
 * Created by lbaerisw on 12/17/16.
 */
(function() {
    'use strict';

    angular
        .module('allInOneEvents')
        .controller('AllInOneController', AllInOneController);

    function AllInOneController() {

        //table of events, needs to be ordered
        this.eventsTable = [
            {name:"instance1",event:"Blown up!"},
            {name:"network2",event:"Launched successfully!"} //example objects
        ];

        this.updateTable = function(event) {
            eventsTable.push({name: 'newEvent.name',event:'newEvent.event'});
        };

        var wsroute = 'localhost'; //to allow for reuse, should just use OPENSTACK_HOST value? If empty use localhost?
        var connection = 'ws://' + wsroute + ':80'; //should be port 80 by default? or port 443 if secure connection?
        var ws = new WebSocket(connection);

        //should these events be in the factory, or should the factory simply create the connection and return the WebSocket object?
        //called when connection is opened
        ws.onopen = function() {
            var client_id = 'placeholder' //need to figure out how to dynamically get
            var project_id = 'placeholder' //need to figure out how to dynamically get

            //authenticate = function() {
                //ws.send(authentication); //placeholder
            //};

            subscribe = function() { //somehow have a parameter that allows to set different subscriptions? not priority
                var subscription = {'action': subscription_create,
                                    'headers': {'Client-ID': placeholder, 'X-Project-ID': placeholder},
                                    'body': {'queue_name': 'horizon_events', 'ttl': 3600}};
                ws.send(JSON.stringify(subscription));
            };

            subscribe;

        };

        ws.onclose = function() {
            console.log('connection closed'); //need to handle connection close?
        };

        ws.onerror = function() {
            console.log('websocket error'); //need to handle errors?
        };

        ws.onmessage = function(event) {
            var newEvent = JSON.parse(event.data);
            updateTable(newEvent);
        };

    }

})();