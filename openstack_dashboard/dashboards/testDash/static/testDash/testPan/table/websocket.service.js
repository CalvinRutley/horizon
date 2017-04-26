/**
 * Created by lbaerisw on 4/6/17.
 */
(function() {
  'use strict';

  angular.module('Output').factory('WebsocketService', WebsocketService);

  WebsocketService.$inject = [
    '$q',
    'horizon.app.core.openstack-service-api.userSession',
    'NotificationService',
    '$log'
  ];

  function WebsocketService($q, userSession, NotificationService, $log) {
    var factory = {};

    //need to be set
    factory.token = '';
    factory.uuid = '';
    factory.projectID = '';

    //should come from config
    factory.wsroute = '172.29.86.71';
    factory.wsport = '9000';
    factory.queues = ['horizon_events_test'];

    //status stuff
    factory.connection = 'ws://' + factory.wsroute + ':' + factory.wsport;
    factory.connected = false;
    factory.authenticated = false;
    factory.subscribed = false;
    factory.activeSubscriptions = [];
    factory.addZaqarQueue = addZaqarQueue;

    //'private' functions
    var ws = new WebSocket(factory.connection);

    function authenticate() {
      var authentication = {'action': 'authenticate',
          'headers': {'X-Auth-Token': factory.token, 'Client-ID': factory.uuid,
                      'X-Project-ID': factory.projectId}};
      ws.send(JSON.stringify(authentication));
    }

    function subscribe(queueName) {
      var subscription = {'action': 'subscription_create',
          'headers': {'Client-ID': factory.uuid, 'X-Project-ID': factory.projectId},
          'body': {'queue_name': queueName, 'ttl': 3600}};
      ws.send(JSON.stringify(subscription));
    }

    function subscribeAll() {
      for (var i = 0; i < factory.queues.length; i++) {
        subscribe(factory.queues[i]);
      }
    }

    function addZaqarQueue(queueName) {
      factory.queues.push(queueName);
    }

    function updateSubscriptions(subscription) {
      if (factory.activeSubscriptions.indexOf(subscription) === -1) {
        factory.activeSubscriptions.push(subscription);
      }
      $log.log(factory.activeSubscriptions);
    }

    function updateSubscribed() {
      if (factory.activeSubscriptions.length) {
        factory.subscribed = true;
      }
      else {
        factory.subscribed = false;
      }
    }

    function responseHandler(response) {
      if (response.Message_Type === "Notification") {
        NotificationService.notificationHandler(response);
      }
      else {
        var message = response.request.action;
        message += ': ';

        if (response.body.hasOwnProperty("message")) {
          message += response.body.message;

          if (response.request.action === 'authenticate') {
            $log.log(message);
            factory.authenticated = true;
          }
          else if (response.request.action === 'subscription_create') {
            $log.log(message);
            updateSubscriptions(message);
            updateSubscribed();
          }
        }
        else {
          message += response.body.error;
          $log.log(message);
        }
      }
    }

    //Websocket Events
    ws.onopen = function() {
      $log.log('Websocket connection opened.');
      factory.connected = true;

      $q.all((userSession.get()).then(function (data) {

        factory.projectId = data.project_id;
        factory.uuid = data.id;
        factory.token = data.token;

        authenticate();
        subscribeAll();
      }));
    };

    ws.onclose = function(event) {
      $log.log(event);
      var reason = event.reason;
      $log.log('Connection closed because of: ' + reason);
      factory.connected = false;
    };

    ws.onerror = function() {
      $log.log('Websocket error.');
    };

    ws.onmessage = function(event) {
      $log.log(event);
      var response = JSON.parse(event.data);
      responseHandler(response);
    };

    return factory;

  }

})();
