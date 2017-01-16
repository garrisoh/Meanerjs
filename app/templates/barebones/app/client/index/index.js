'use strict';

/**
 * This module is used to define the page module and perform routing functions.
 */

// Create home module and setup routing
angular.module('index', ['app', 'ui.router'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state({
				name: 'home',
				url: '/',
				templateUrl: 'home.html',
				controller: 'HomeCtrl as hctrl'
			});
	}]);

