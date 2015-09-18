
var azure = require('azure');
var socket = require('socket.io');

var serviceBusService = require('./serviceBusService');

var topic = 'notifications';
var subscription = 'monitor';
var stopped = false;

var workerMain = function(workerId, workerManagerCallback)
{
    console.log('workerId ' + workerId + ' checking for messages...');

    serviceBusService.receiveSubscriptionMessage(topic, subscription, function (error, message) {

        if (error) {
            console.log('workerId ' + workerId + ' received error');
            console.log(error);
        }

        if (message) {
            console.log('workerId ' + workerId + ' received sb message');
            console.log(message);

            socket.emit('monitorMessageReceived', message);
        }

        workerManagerCallback(null, 'workerId ' + workerId + ' completed');

    });
}

module.exports = workerMain;