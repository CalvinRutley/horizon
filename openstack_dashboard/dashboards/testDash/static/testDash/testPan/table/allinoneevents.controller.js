/**
 * Created by lbaerisw on 12/17/16.
 */
(function() {
    'use strict';

    angular
        .module('horizon.dashboard.testDash.allInOneEvents')
        .controller('AllInOneController', AllInOneController);

    function AllInOneController() {

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

        this.updateTable = function(event) {
            eventsTable.push({name: 'newEvent.name',event:'newEvent.event'});
        };

        //var wsroute = 'localhost'; //need to dynamically allocate
        //var connection = 'ws://' + wsroute + ':9000'; //need to dynamically allocate
        //var ws = new WebSocket(connection);

        //should these events be in the factory, or should the factory simply create the connection and return the WebSocket object?
        //called when connection is opened
        //ws.onopen = function() {
        //    var client_id = e7514e0109104e3e8ac331de19e04c56; //need to figure out how to dynamically get
        //    var project_id = 8f93d41e7fae4de8ac4e8613d2e598ae; //replace as needed
        //    var authtoken = 'enter value from keystone auth here'

        //    authenticate = function() {
        //            var authentication = {'action': 'authenticate',
        //                                  'headers': {'X-Auth-Token': authtoken, 'Client-ID': client_id, 'X-Project-ID': project_id}};

        //        ws.send(authentication); //placeholder
        //    };

        //    subscribe = function() { //somehow have a parameter that allows to set different subscriptions? not priority
        //        var subscription = {'action': 'subscription_create',
        //                            'headers': {'Client-ID': client_id, 'X-Project-ID': project_id},
        //                            'body': {'queue_name': 'horizon_events', 'ttl': 3600}}; //could dynamically assign queue name
        //        ws.send(JSON.stringify(subscription));
        //    };
        //
        // authenticate;
        // subscribe;

        //};

        //ws.onclose = function() {
        //    console.log('connection closed'); //need to handle connection close?
        //};

        //ws.onerror = function() {
        //    console.log('websocket error'); //need to handle errors?
        //};

        //ws.onmessage = function(event) {
        //    var newEvent = JSON.parse(event.data);
        //    updateTable(newEvent);
        //};


        //var ctrl = this;

        //ctrl.fruits = [
        //    { id: 4019, name: "apple", inStock: 75},
        //    { id: 4232, name: "banana", inStock: 120},
        //    { id: 4610, name: "cantaloupe", inStock: 98},
        //    { id: 4872, name: "durian", inStock: 4}
        //]


        //var self = this;
        //var data = [{name: "Moroni", age: 50} /*,*/];
        //self.tableParams = new NgTableParams({}, { dataset: data});

    }

})();