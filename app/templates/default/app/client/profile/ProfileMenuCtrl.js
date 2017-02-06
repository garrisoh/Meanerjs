'use strict';

/**
 * TODO: What is ngdoc?  How do I document client and server side code?  Do I document html/scss?
 */

angular.module('profile').controller('ProfileMenuCtrl', ['$window', function($window) {
	// Logout - remove token and redirect to login page
	this.logout = function() {
		$window.localStorage.removeItem('token');
	};
}]);
