var express = require('express');
var app = express();

var Dependencies = require('./queries').Dependencies;
var OverviewQuery = require('./queries').OverviewQuery;

app.use(express.static('public'));

app.set('json spaces', 4);
app.get('/api', function (req, res) {

  var dependencies = new Dependencies();
  var overviewQuery = new OverviewQuery(dependencies);

  overviewQuery.get(function(overview){
      res.json(overview);
  });
});

var server = app.listen(process.env.PORT || 3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
