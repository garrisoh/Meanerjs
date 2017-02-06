'use strict';

/**
 *
 */

angular.module('index').controller('LoginCtrl', ['$http', '$window', function($http, $window) {
	this.email = '';
	this.pass = '';
	this.errMsg = null;

	this.login = function(loginForm) {
		this.errMsg = null;
		if(loginForm.email.$invalid) {
			this.errMsg = 'Please enter your email';
			return;
		}

		if(loginForm.pass.$invalid) {
			this.errMsg = 'Please enter your password';
			return;
		}

		// Login
		var ctrl = this;
		$http.post('/api/login', {email: this.email, password: this.pass})
			.then(function(response) {
				$window.localStorage.setItem('token', response.data.token);
				$window.location = '/profile';
			}).catch(function(response) {
				if(response.data.message) ctrl.errMsg = response.data.message;
				else ctrl.errMsg = response.statusText;
			});
	};
}]);
