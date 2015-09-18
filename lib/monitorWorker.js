
var azure = require('azure');
var io = require('socket.io');
var EventEmitter = require('events').EventEmitter;
var eventEmitter = new EventEmitter();

var serviceBusService = require('./serviceBusService');
var SubscriptionQuery = require('./queries').SubscriptionQuery;
var SubscriptionMapper = require('./queries').SubscriptionMapper;

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

            var query = new SubscriptionQuery();
            query.get(topic, subscription, function(rawSubscription){

                var mapper = new SubscriptionMapper();
                var subscriptionResult = mapper.fromRaw(rawSubscription);

                eventEmitter.emit('subscriptionUpdated', subscriptionResult);
            });
        }

        workerManagerCallback(null, 'workerId ' + workerId + ' completed');

    });
}

module.exports = workerMain;