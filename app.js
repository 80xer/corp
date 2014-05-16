
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
app.use(express.bodyParser({keepExtensions:true,uploadDir:path.join(__dirname,'/files')}));

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

app.post('/uploadAddress', function (req, res) {
  var fs = require('fs');

  fs.readFile(req.files.openAddress.path, function (err, data) {
    var filePath = __dirname + '/files/' + req.files.openAddress.name;
    fs.writeFile(filePath, data, function (err) {
      if (err) {
        throw err;
      } else {
        fs.unlink(req.files.openAddress.path, function (err) {
          if (err) throw err;
        });
        res.redirect('back');
      }
    });
  });
});

app.get('/getAddress', function (req, res) {
  var fs = require('fs');
  var arr = [];

  function readLines(input, func) {
    var remaining = '';

    input.on('data', function(data) {
      remaining += data;
      var index = remaining.indexOf('\n');
      while (index > -1) {
        var line = remaining.substring(0, index);
        remaining = remaining.substring(index + 1);
        arr.push(line);
        index = remaining.indexOf('\n');
      }
    });

    input.on('end', function() {
      if (remaining.length > 0) {
        arr.push(remaining);
      }
      res.send(arr);
    });
  }

  function func(data) {
    console.log('Line: ' + data);
  }

  var input = fs.createReadStream(__dirname + '/files/mail.txt');
  readLines(input, func);
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

app.get('/files/logo.png', function (req, res) {
  res.sendfile(__dirname + '/files/logo.png');
})

app.post('/sendYooriEmail', function (req, res) {
  var nodemailer = require("nodemailer");
  var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
      user: "thisground.office@gmail.com",
      pass: "eltmrmfkdnsem"
    }
  });

  var toto = req.body.emailTo.toString().split(',');
  var len = toto.length;
  var mailOptions;

  var sign = '<div>' +
    '<div dir="ltr">' +
    '<img src=​"http://thisground.com/files/logo.png" width=​"96" height=​"30">​' +
    '<br>' +
    '<div></div>' +
    '<div></div>'

  for (var i = 0; i < len; i++) {
    var index = toto[i].indexOf('<');
    var name = toto[i];
    var to = toto[i];

    if (index > -1) {
      name = toto[i].substring(0, index);
      to = toto[i].substring(index + 1, toto[i].length - 1);
    }


    mailOptions = {
      from: "YooriKim<YooriKim@thisground.com>", // sender address
      to: to,
      subject: req.body.emailSubject.replace(/\$name/g, name),
      text: req.body.emailBody.replace(/\$name/g, name),
      html: req.body.emailHTML.replace(/\$name/g, name) + sign,
      attachments: [{
        filename: "logo.png",
        filePath: "/files/",
        cid: "logo@thisground.com" //same cid value as in the html img src
      }]
    };

    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
        console.log(error);
      }else{
        console.log("Message sent: " + response.message);
        res.send('sent email');
      }

      // if you don't want to use this transport object anymore, uncomment following line
      //smtpTransport.close(); // shut down the connection pool, no more messages
    });
  }

});

app.post('/sendYuriEmail', function (req, res) {
  var email     = require("emailjs/email");
  var server     = email.server.connect({
    user:    "thisground.office",
    password:"eltmrmfkdnsem",
//    user:    "eedonge",
//    password:"@leh@8080",
    host:    "smtp.gmail.com",
    ssl:     true
  });

  var toto = req.body.emailTo.toString().split(',');
  var len = toto.length;

  for (var i = 0; i < len; i++) {
    var index = toto[i].indexOf('<');
    var name = toto[i];

    if (index > -1) {
      name = toto[i].substring(0, index);
    }

    // send the message and get a callback with an error or details of the message that was sent
    server.send({
      text: req.body.emailBody.replace(/\$name/g, name),
      from: req.body.emailFrom,
      to: toto[i],
      cc: "",
      subject: req.body.emailSubject.replace(/\$name/g, name),
      attachment:
        [
          {data:req.body.emailHTML.replace(/\$name/g, name) + '<div>' +
            '<div dir="ltr">' +
            '<img src=​"http://www.thisground.com/files/logo.png" width=​"96" height=​"30">​' +
            '<br>' +
            '<div></div>' +
            '<div></div>', alternative:true}
        ]
    }, function (err, message) {
      if (err) {
        console.log('error send email');
        console.log(err);
      } else {
//        console.log(message);
        res.send('sended email');
      }
    });
  }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
