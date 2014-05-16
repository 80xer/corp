
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 11111);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/views/' + 'index.html');
});

app.get('/yuri', function (req, res) {
  res.sendfile(__dirname + '/views/' + 'yuri.html');
});

app.post('/sendEmail', function (req, res) {
  var email     = require("emailjs/email");
  var server     = email.server.connect({
    user:    "thisground.office",
    password:"eltmrmfkdnsem",
//    user:    "eedonge",
//    password:"@leh@8080",
    host:    "smtp.gmail.com",
    ssl:     true
  });

// send the message and get a callback with an error or details of the message that was sent
  server.send({
    text:    req.body.emailBody + '\n\nfrom ' + req.body.emailFrom,
    from:    req.body.emailFrom,
    to:      "<thisground.office+fromCorpPage@gmail.com>",
    cc:      "",
    subject: "회사소개사이트를 통해 보낸 메일 - " + req.body.emailSubject
  }, function(err, message) {
    if (err) {
      console.log('error send email');
      console.log(err);
    } else {
      console.log(message);
      res.send('sended email');
    }
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
