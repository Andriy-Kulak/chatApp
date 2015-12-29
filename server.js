
//Initialize our Express Web Framework
var express = require ('express');
var app = express();
//twilio
var client = require('twilio')('AC4425f2869cdbcc1072e9d1a3881628c3','d29a607128be30c8172ade7485779021');


//native NodeJS
var path = require('path');

var http = require('http').Server(app);
var io = require('socket.io')(http);

//go on localhost:8081 to see page
var port =  8081;

//Set our view engine to EJS, and set the directory our views will be stored in
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'client', 'views'));


//when client connects with socket io
var users = [];
io.on('connection', function(socket){
	var username = '';
	console.log("A user has connected");

	socket.on('request-users', function(){
		socket.emit('users', {users: users});
	});

	//Emitting messages to all users
	socket.on('message', function(data){
		io.emit('message', {username: username, message: data.message});
	});

	socket.on('add-user', function(data){

		if(users.indexOf(data.username) == -1){
			io.emit('add-user', {
				username: data.username
			});
			username = data.username;
			users.push(data.username);
		} else {
			socket.emit('prompt-username', {
				message: 'User already Exists. Please try again! :-)'
			})
		}
	});

	socket.on('disconnect', function(){
		console.log('A user has disconnected!');
		users.splice(users.indexOf(username), 1);
		io.emit('remove-user', {username: username});
	})
});

//combines views directory with current file
app.set('views', path.resolve(__dirname, 'client', 'views'));

app.use(express.static(path.resolve(__dirname, 'client')));

//Home Route
// Important:: The '*' is intended for when user refreshes page on the application.
app.get('/', function(req, res){
	res.render('index.ejs');
});

app.get('/twilio', function(req, res){
	client.sendMessage({
		to: '+17182072478',
		from: '+19292442285',
		body: 'Hello Andriy'
	}, function(err, data){
		if(err) {
			console.log(err);
		}
		console.log(data);
	});
});



//make our app listen for incoming requests on the port assigned above
http.listen(port, function(){
	console.log('server running on port:' + port);
});
