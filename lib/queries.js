var azure = require('azure');

var ConfigLoader = require('./configLoader').ConfigLoader;

var config = new ConfigLoader().load();
var serviceBusService = azure.createServiceBusService(config.sbEndpoint);

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

            if(subscriptions)
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
            finalizer.forEach(rawTopics, function(rawTopic){

                subscriptionsQuery.get(rawTopic.TopicName, function(rawSubscriptions){

                    var topic = new TopicMapper().fromRaw(rawTopic, rawSubscriptions);
                    topics.push(topic);

                    finalizer.completeTask();
                });

            }, function(){ // Finally func

                topics = topics.sort(function(a, b){
                    return a.created < b.created;
                });

                callback(topics);
            });
        });
    }
}

function Topic() {}
function Subscription(){}

function TopicMapper()
{
    this.fromRaw = function(rawTopic, rawSubscriptions)
    {
        var topic = new Topic();
        topic.name = rawTopic.TopicName;
        topic.created = Date.parse(rawTopic.CreatedAt);
        topic.sizeInBytes = parseInt(rawTopic.SizeInBytes);

        topic.subscriptions = [];
        rawSubscriptions.forEach(function(rawSubscription){

            var subscription = new SubscriptionMapper().fromRaw(rawSubscription);
            topic.subscriptions.push(subscription);
        });

        topic.subscriptions = topic.subscriptions.sort(function(a, b){
            return a.created < b.created;
        });

        return topic;
    }
}

function SubscriptionMapper()
{
    this.fromRaw = function(rawSubscription)
    {
        var subscription = new Subscription();
        subscription.name = rawSubscription.SubscriptionName;
        subscription.created = Date.parse(rawSubscription.CreatedAt);
        subscription.activeMessageCount = parseInt(rawSubscription.CountDetails['d2p1:ActiveMessageCount']);
        subscription.deadLetterMessageCount = parseInt(rawSubscription.CountDetails['d2p1:DeadLetterMessageCount']);
        return subscription;
    }
}

module.exports.Dependencies = Dependencies;
module.exports.OverviewQuery = OverviewQuery;

