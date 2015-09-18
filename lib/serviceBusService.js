var azure = require('azure');

var ConfigLoader = require('./configLoader').ConfigLoader;
var config = new ConfigLoader().load();
var serviceBusService = azure.createServiceBusService(config.sbEndpoint);

module.exports = serviceBusService;