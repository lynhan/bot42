var Twit = require('twit'); //twitter library
var bot = new Twit(require('./config.js')); //include config file
var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.send('Hello World!');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

//keep connection alive
var stream = bot.stream('statuses/filter', { track: ['meaning of life'] })

stream.on('connect', function (request) {
	console.log('TRYING TO CONNECT');
})

stream.on('connected', function (response) {
	console.log('CONNECTED');
})

stream.on('tweet', function (tweet) {
	console.log('\nFOUND TWEET');
	console.log(tweet.text)

	if (tweet.text.match('meaning of life')) {
		console.log('REPLYING')
		reply = '@' + tweet.user.screen_name + " It's actually 42."
		console.log('REPLY: ', reply)
		bot.post('statuses/update', { status: reply }, function (error, data, response) {
			console.log(data.text)
				if (response) {
					console.log('REPLY SUCCESS')
				}
				if (error) {
					console.log('REPLY ERROR', error);
				}
			})
	}
})
