'use strict';

/**
 *
 */

angular.module('index').controller('IndexCtrl', ['$window', function($window) {
	if($window.localStorage.getItem('token')) $window.location = '/profile';
}]);
