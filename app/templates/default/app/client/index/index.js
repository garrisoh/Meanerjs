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
			})
			.state({
				name: 'login',
				url: '/login',
				templateUrl: 'login.html',
				controller: 'LoginCtrl as lctrl'
			})
			.state({
				name: 'forgot',
				url: '/forgot',
				templateUrl: 'forgot.html',
				controller: 'ForgotCtrl as fctrl'
			})
			.state({
				name: 'reset',
				url: '/reset/:token',
				templateProvider: function($stateParams, $http, $state) {
					return $http.get('/reset.html', {headers: {'Authorization': 'Bearer ' + $stateParams.token}})
								.then(function(response) {
									return response.data;
								}).catch(function(response) {
									$state.go('forgot');
								});
				},
				controller: 'ResetCtrl as rsctrl'
			})
			.state({
				name: 'register',
				url: '/register',
				templateUrl: 'register.html',
				controller: 'RegisterCtrl as rctrl'
			});
	}]);

