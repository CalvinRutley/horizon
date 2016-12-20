/**
 * Created by lbaerisw on 12/14/16.
 */
(function(){
    'use strict';

    angular
        .module('events')
        .factory('eventsTable', eventsTable);

    function eventsTable(webSockets) {
        //table of events here, accessible from different controllers
        var events = [
            {name:"instance1",event:"Blown up!"},
            {name:"network2",event:"Launched successfully!"} //example objects
        ];

        var factory = {};

        factory.getEventsTable = function() {
            return events;
        }
        //on message event, update table function
        factory.tableUpdate = function() {
            //events.push({name: newEvent.name, event: newEvent.event});
        }

        return factory;

    }

})();