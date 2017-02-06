'use strict';

/**
 * TODO: What is ngdoc?  How do I document client and server side code?  Do I document html/scss?
 */

angular.module('profile').controller('ProfileCtrl', ['$http', '$window', function($http, $window) {
	this.fields = ['firstname', 'lastname', 'email'];
	this.labels = {firstname: 'First Name', lastname: 'Last Name', email: 'Email'};
	this.values = {firstname: '', lastname: '', email: ''};
	this.type = {firstname: 'text', lastname: 'text', email: 'email'};
	this.hover = '';
	this.edit = '';
	this.editText = '';

	this.errMsg = null;

	// Check if token exists, login if not
	var token = $window.localStorage.getItem('token');
	if(!token) $window.location = '/#!/login';

	// Get user data
	var ctrl = this;
	$http.get('/api/user', {headers: {'Authorization': 'Bearer ' + token}})
		.then(function(response) {
			ctrl.values.firstname = response.data.firstname;
			ctrl.values.lastname = response.data.lastname;
			ctrl.values.email = response.data.email;
		}).catch(function(response) {
			// Redirect to login if authentication fails
			$window.location = '/#!/login';
		});

	// Update user data
	this.save = function(form) {
		if(form.input.$invalid) {
			this.errMsg = 'Please enter a valid ' + this.labels[this.edit].toLowerCase();
			return;
		}

		// Send data to server
		var toSend = {};
		toSend[this.edit] = this.editText;
		$http.post('/api/user', toSend, {headers: {'Authorization': 'Bearer ' + token}})
			.then(function(response) {
				ctrl.values[ctrl.edit] = ctrl.editText;
				ctrl.editText = '';
				ctrl.edit = '';
				ctrl.errMsg = null;
			}).catch(function(response) {
				if(response.status === 403) $window.location = '/#!/login';
				else if(response.message) ctrl.errMsg = response.message;
				else ctrl.errMsg = response.statusText;
			});
	};

}]);
