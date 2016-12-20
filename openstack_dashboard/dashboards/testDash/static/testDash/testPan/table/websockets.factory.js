/**
 * Created by lbaerisw on 12/14/16.
 */
(function(){
    'use strict';

    angular
        .module('events')
        .factory('webSockets', webSockets);

    function webSockets() {
        //websockets related functions in angular factory wrapper
        var wsroute = 'default'; //need way to assign this dynamically to allow for reuse
        var connection = 'ws://' + wsroute + ':80'; //should be port 80 by default?
        var ws = new WebSocket(connection);

        //should these events be in the factory, or should the factory simply create the connection and return the WebSocket object?
        //called when connection is opened
        ws.onopen = function() {
            //collect current user's credentials
            var token = 12345; //placeholder

            authenticate = function() {
                //send message to zaqar with credentials
            };

            subscribe = function() { //somehow have a parameter that allows to set different subscriptions? not priority
                //send message to
            };

        };

        ws.onclose = function() {
            //does anything need to be done here? try to reconnect? stop giving out the WS object?
        };

        ws.onmessage = function() {

        };

        var factory = {};

        factory.getWebSocket = function() {
            return ws;
        };

        return factory;

    }


})();