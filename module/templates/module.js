'use strict';

/**
 * 
 */

angular.module('<%- name %>', ['app', 'ui.router'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state({
				name: '<%- name %>',
				url: '/',
				templateUrl: '<%- name %>.html',
				controller: '<%- nameCaps %>Ctrl as <%- nameFirst %>ctrl'
			});
	}]);

