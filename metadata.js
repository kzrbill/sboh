
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

function Dependencies()
{
    this.topicsQuery = new TopicsQuery();
}

function OverviewQuery(dependencies)
{   
    var topicsQuery = dependencies.topicsQuery;

    this.get = function(callback)
    {
        topicsQuery.get(function(rawTopics){

            var topics = [];
            rawTopics.forEach(function(rawTopic){

                var topic = new TopicFactory().fromRaw(rawTopic);
                topics.push(topic);
            });

            callback(topics);
        });
    }
}

function Topic()
{
}

function TopicFactory()
{
    this.fromRaw = function(rawTopic)
    {
        var topic = new Topic();
        topic.name = rawTopic.TopicName;
        topic.sizeInBytes = rawTopic.SizeInBytes;
        return topic;
    }
}

var dependencies = new Dependencies();
var overviewQuery = new OverviewQuery(dependencies);

overviewQuery.get(function(overview){
    console.log('overview');
    console.log(overview);
});




