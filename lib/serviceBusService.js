// var azure = require('./legacy/azure-sdk-for-node-0.7.5-May2013/lib/azure');
var azure = require('azure');

var ConfigLoader = require('./configLoader').ConfigLoader;
var config = new ConfigLoader().load();
var serviceBusService = azure.createServiceBusService(config.sbEndpoint);

module.exports = serviceBusService;