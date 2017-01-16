'use strict';

/**
 * 
 */

angular.module('<%- module %>').filter('<%- name %>', function() {
	return function(x) {
		return x + ' is pretty cool';
	};
});
