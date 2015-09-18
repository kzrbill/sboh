
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);
    


var Dependencies = require('./lib/queries').Dependencies;
var OverviewQuery = require('./lib/queries').OverviewQuery;

app.use(express.static('public'));

app.set('json spaces', 4);
app.get('/api', function (req, res) {

  // Next: pass in service bus as global depency
  var dependencies = new Dependencies();
  var overviewQuery = new OverviewQuery(dependencies);

  overviewQuery.get(function(overview){
      res.json(overview);
  });
});

// TODO: start workers to listen to all topics with subscritpion name
// 'monitoring' and complete messages with a raised event when have.

var usersConnected = 0;

var EventEmitter = require('events').EventEmitter;
var eventEmitter = new EventEmitter();

io.on('connection', function(socket){
  
  usersConnected++;
  io.emit('message', 'server says: user connected (' + usersConnected + ')');
  console.log('client connected');

  socket.on('disconnect', function(){
    usersConnected--;
    io.emit('message', 'server says: user disconnected (' + usersConnected + ')');
    console.log('client disconnected');
  });

  eventEmitter.on('subscriptionUpdated', function(subscription){
    io.emit('subscriptionUpdated', subscription);
  });
});


// module.exports.startWorkers = startWorkers;
require('./lib/monitorWorkerFarm').startWorkers(2);

var port = process.env.PORT || 3000;
http.listen(port, function () {
    console.log('listening on port ' + port);
});

