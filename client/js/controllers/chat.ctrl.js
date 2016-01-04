myApp.controller('chatController', ['$scope', 'Socket', function($scope, Socket){
	//connecting to Socket
	Socket.connect();
	// Users and messages arrays that will be displayed in the app
	$scope.users = [];
	$scope.messages = [];

	//requiring user to enter their username
	var promptUsername = function(message){
		bootbox.prompt(message, function(name){
			if(name != null){
				Socket.emit('add-user', {username: name})
			}
			else {
				promptUsername('You must enter a username!');
			}
		})
	};

	//sending message to display
	$scope.sendMessage = function(msg){
		if(msg != null && msg != '')
			Socket.emit('message', {message: msg})
		$scope.msg = '';
	};

	//prompting user to enter his/her name
	promptUsername("What is your name?");

	//receiving list of connected users
	Socket.emit('request-users', {});
	Socket.on('users', function(data){
		$scope.users = data.users;
	});

	// Receiving messages from other user
	Socket.on('message', function(data){
		$scope.messages.push(data);
	});

	//Notifying the a user has entered  the channel and adding him to array
	Socket.on('add-user', function(data){
		$scope.users.push(data.username);
		$scope.messages.push({username: data.username, message: 'has entered the channel'});
	});

	//Notifying the a user has left the channel and removing him/her from array
	Socket.on('remove-user', function(data){
		$scope.users.splice($scope.users.indexOf(data.username), 1);
		$scope.messages.push({username: data.username, message: 'has left the channel'});
	});

	//In case server rejects username in case it already exists
	Socket.on('prompt-username', function(data){
		promptUsername(data.message);
	});

	//when user navigates away from chat app, we want to user to be disconnected.
	$scope.$on('$locationChangeStart', function(event){
		Socket.disconnect(true);
	})
}]);