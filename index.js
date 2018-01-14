var express = require('express');
var request = require('request');
var jsonHandler = require('./jsonHandler');
const bodyParser = require('body-parser');

var clientId = '3055224084.234147642579';
var clientSecret = '20fd767707ccda964700d969a629ad07';

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const PORT=4390;

app.listen(PORT, function() {
  console.log("Server listening on : http://localhost:%s", PORT);
});

app.get('/', function(req, res) {
  res.send('Ngrok is working! Path Hit: ' + req.url);
});

app.get('/oauth', function(req, res) {
  if(!req.query.code) {
    res.status(500);
    res.send({"Error": "Looks like we're not getting a code."});
    console.log("Looks like we're not getting a code.");
  } else {
    request({
      url: 'https://slack.com/api/oauth.access',
      qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret},
      method: 'GET'
  }, function(error, response, body) {
      if(error) {
        console.log(error);
      }
      else {
        res.json(body)
      }
    })  
  }
});


app.post('/list', function(req, res) {
  res.send("All environments for the team are: " + jsonHandler.listAll());
});

app.post('/take', function(req, res) {
  jsonHandler.addUser(req.body.user_name, req.body.text, function(reply) {
      res.json(
          {
              response_type: 'in_channel',
              text: reply
          }
      );
  });
});

app.post('/add', function(req, res) {
  jsonHandler.addEnv(req.body.user_name, req.body.text, function(reply) {
    res.json(
      {
        response_type: 'in_channel',
        text: reply
      }
    )
  });
});

app.post('/release', function(req, res) {
  jsonHandler.releaseUser(req.body.user_name, req.body.text, function (reply) {
      res.json(
          {
              response_type: 'in_channel',
              text: reply
          }
      )
  });
});

app.post('/available', function(req, res) {
  res.send("Currently available envs are: " + jsonHandler.listAvailable());
});

app.post('/info', function(req, res) {
  res.json(
    {
      'text': 'qa1 is clustered. Nonprod is slow. What else is new??',
      "attachments": [
        {
          'text': 'Oh..you wanted to know about `' + req.body.text + '`???'
        }
      ]
    }
  );
});

