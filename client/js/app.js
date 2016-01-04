//Module
var myApp = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'btford.socket-io']);

/**
 * Routes
 */
myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider.when('/home', {templateUrl: 'sections/home.html', controller: 'homeController'});
	$routeProvider.when('/about', {templateUrl: 'sections/about.html', controller: 'aboutController'});
	$routeProvider.when('/contact', {templateUrl: 'sections/contact.html', controller: 'contactController'});
	$routeProvider.when('/chat', {templateUrl: 'sections/chat.html', controller: 'chatController'});

	//if no valid routes are found, redirect to home
	$routeProvider.otherwise({redirectTo: '/home'});

	//html5Mode keeps angular app from getting hash tag
	$locationProvider.html5Mode({enabled: true, requireBase: false});
}]);

