//matches the destination of URI to the partial that is currently being used. For instance, when using about partial,
// andriy3x1000.com/about is rendered
myApp.controller('navController', ['$scope', '$location', function($scope, $location){
	$scope.isActive = function(destination){
		return destination === $location.path;
	}
}]);