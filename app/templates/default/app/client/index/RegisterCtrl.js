'use strict';

/**
 *
 */

angular.module('index').controller('RegisterCtrl', ['$http', '$window', function($http, $window) {
	// Initialize variables
	this.firstname = '';
	this.lastname = '';
	this.email = '';
	this.pass = '';
	this.passRep = '';
	this.errorMsg = null;

	// Password popover with criterion
	$('[name="pass"]').popover({
		content: 'Password must have at least:<br>8 characters<br>1 lowercase letter<br>1 uppercase letter<br>1 number or special character',
		html: true
	});

	// All fields (except passwords)
	var fieldNames = {
		'firstname': 'first name',
		'lastname': 'last name',
		'email': 'email'
	};

	// Register a new user
	this.register = function(registerForm) {
		// Clear any errors
		this.errorMsg = null;

		// Validate fields
		for(var field in fieldNames) {
			if(registerForm[field].$invalid) {
				this.errorMsg = 'Please enter a valid ' + fieldNames[field];
				return;
			}
		}

		// Validate password
		if(registerForm.pass.$invalid) {
			var errors = Object.keys(registerForm.pass.$error);
			if(errors.indexOf('required') > -1) this.errorMsg = 'Please enter a valid password';
			else this.errorMsg = errors[0];
			return;
		}

		// Validate repeated password
		if(registerForm.passRep.$invalid) {
			this.errorMsg = 'Password confirmation must equal password.';
			return;
		}

		// If valid, register
		var user = {
			firstname: this.firstname,
			lastname: this.lastname,
			email: this.email,
			password: this.pass
		};

		var ctrl = this;
		$http.post('/api/register', user)
			.then(function(response) {
				// Store token in local storage
				$window.localStorage.setItem('token', response.data.token);
				
				// Load profile page (or email validation)
				$window.location = '/profile.html';
			}).catch(function(response) {
				// Either the request didn't go through or server returned error
				if(response.data.message) ctrl.errorMsg = response.data.message;
				else ctrl.errorMsg = response.statusText;
			});
	};
}]);
