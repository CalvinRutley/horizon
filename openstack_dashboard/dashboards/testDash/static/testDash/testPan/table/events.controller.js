/**
 * Created by lbaerisw on 12/14/16.
 */
(function() {
    'use strict';

    angular
        .module('events')
        .controller('EventsController', EventsController);

    function EventsController(eventsTable, webSockets) {
        this.eventsTB = eventsTable.getEventsTable();
        this.webSocket = webSockets.getWebSocket();

        webSocket.onmessage = function(event) {

        };


    }

})();