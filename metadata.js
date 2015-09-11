
var azure = require('azure');
var jsonfile = require('jsonfile');

var file = 'sec.config.json'
var config = jsonfile.readFileSync(file);
 

var serviceBusService = azure.createServiceBusService(config.sbEndpoint);

/**
* Returns a list of topics.
*
* @param {object}             [options]                                 The request options.
* @param {int}                [options.top]                             The number of topics to fetch.
* @param {int}                [options.skip]                            The number of topics to skip.
* @param {Function(error, listtopicsresult, response)} callback         `error` will contain information
*                                                                       if an error occurs; otherwise `listtopicsresult` will contain
*                                                                       the list of topics.
*                                                                       `response` will contain information related to this operation.
* @return {undefined}
*/
// ServiceBusService.prototype.listTopics = function (optionsOrCallback, callback) {
//   this._listResources('/$Resources/Topics', topicResult, null, optionsOrCallback, callback);
// };

/*
error: Error: 401 - Manage claim is required for this operation. TrackingId:9e3291d2-ff58-40e3-8185-97d3972d4654_G24,TimeStamp:9/11/2015 7:25:33 PM
result: null
response: [object Object]
*/

// 1. Create API with all current topics and subscriptions, and current messages in quques.
// 2. Use these to handshake on sockets, to listen for message events by looking at 'monitoring' queues.




function TopicsQuery()
{
    this.get = function(topicsFoundCallback, errorCallback)
    {
        serviceBusService.listTopics(function(error, topics, response){

            if (error) {
                errorCallback(error);
                return;
            }

            if(topics)
            {
                topicsFoundCallback(topics);
                return;
            }
        });
    }
}

function Finalizer()
{
    var _totalTasks = 0;
    var _completeTasksCallCount = 0;
    var _finallyFunc = function(){}; 

    this.forEach = function(tasks, actionFunc, finallyFunc)
    {
        _totalTasks = tasks.length;
        _finallyFunc = finallyFunc;

        tasks.forEach(function(task){
            actionFunc(task);
        });
    }

    this.completeTask = function()
    {
        _completeTasksCallCount++;
        if (_completeTasksCallCount >= _totalTasks) {

            _finallyFunc();
            _completeTasksCallCount = 0;
        }
    }
}

function Dependencies()
{
    this.topicsQuery = new TopicsQuery();
    this.subscriptionsQuery = new SubscriptionsQuery();
}

function SubscriptionsQuery()
{
    this.get = function(topic, subscriptionsFoundCallback, errorCallback)
    {
        serviceBusService.listSubscriptions(topic, function(error, subscriptions, response){

            if (error) {
                errorCallback(error);
                return;
            }

            if(topics)
            {
                subscriptionsFoundCallback(subscriptions);
                return;
            }
        });
    }
}

function OverviewQuery(dependencies)
{   
    var topicsQuery = dependencies.topicsQuery;
    var subscriptionsQuery = dependencies.subscriptionsQuery;

    this.get = function(callback)
    {
        topicsQuery.get(function(rawTopics){

            var topics = [];
            var finalizer = new Finalizer();
            finalalizer.forEach(rawTopics, function(rawTopics){

                subscriptionsQuery.get(rawTopic.TopicName, function(rawSubscriptions){

                    var topic = new TopicMapper().fromRaw(rawTopic, rawSubscriptions);
                    topics.push(topic);

                    finalizer.completeTask();
                });

            }, function(){ // Final function when all tasks marked as complete

                callback(topics);
            });

            
        });
    }
}

function Topic()
{
}

function Subscription()
{
}

function TopicMapper()
{
    this.fromRaw = function(rawTopic, rawSubscriptions)
    {
        var topic = new Topic();
        topic.name = rawTopic.TopicName;
        topic.sizeInBytes = rawTopic.SizeInBytes;

        topic.subscriptions = [];
        rawSubscriptions.forEach(function(rawSubscription){
            topic.subscriptions.push(new SubscriptionMapper().fromRaw(rawSubscription));
        });

        return topic;
    }
}

function SubscriptionMapper()
{
    this.fromRaw = function(rawSubscription)
    {
        var subscription = new Subscription();
        subscription.name = subscription.SubscriptionName;
        return subscription;
    }
}

var dependencies = new Dependencies();
var overviewQuery = new OverviewQuery(dependencies);

overviewQuery.get(function(overview){
    console.log('overview');
    console.log(overview);
});




