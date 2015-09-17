
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


var usersConnected = 0;

io.on('connection', function(socket){
  
  usersConnected++;
  io.emit('message', 'server says: user connected (' + usersConnected + ')');

  socket.on('disconnect', function(){
    usersConnected--;
    io.emit('message', 'server says: user disconnected (' + usersConnected + ')');
  });
});

http.listen(process.env.PORT || 3000, function () {
    console.log('listening');
});

