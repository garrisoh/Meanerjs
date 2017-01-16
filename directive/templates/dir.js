'use strict';

/**
 * 
 */

angular.module('<%- module %>').directive('<%- name %>', function() {
	return {
		template: '<h1>Look at my awesome <%= name %> directive!</h1>',
		restrict: 'EACM'
	};
});
