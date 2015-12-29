
//Initialize our Express Web Framework
var express = require ('express');
var app = express();

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
	console.log('A user has connected');

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
		}
		else {
			socket.emit('prompt-username', {
				message: 'User already Exists'
			})
		}
	});

	socket.on('disconnect', function(){
		console.log(username + ' has disconnected!');
		users.splice(users.indexOf(username), 1);
		io.emit('remove-user', {username: username});
	})
});

//combines views directory with current file
app.set('views', path.resolve(__dirname, 'client', 'views'));

app.use(express.static(path.resolve(__dirname, 'client')));

//set our home route
app.get('/', function(req, res){
	res.render('index.ejs');
});

//make our app listen for incoming requests on the port assigned above
http.listen(port, function(){
	console.log('server running on port:' + port);
});
