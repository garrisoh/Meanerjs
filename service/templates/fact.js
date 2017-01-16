'use strict';

/**
 * 
 */

angular.module('<%- module %>').factory('<%- name %>', function() {
	// Some private stuff (singleton)
	var privateStuff = 1;

	// You can return an object or function.
	// If you return a function you can use it as a standard function or with the new keyword.
	return {
		getStuff: function() {
			return privateStuff;
		}
	};
});
