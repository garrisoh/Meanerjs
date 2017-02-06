'use strict';

/**
 *
 */

angular.module('index').controller('ForgotCtrl', ['$http', function($http) {
	this.email = '';
	this.errMsg = null;

	this.sendResetLink = function(forgotForm) {
		// Verify email
		this.errMsg = null;
		if(forgotForm.email.$invalid) {
			this.errMsg = 'Please enter your email';
			return;
		}

		// Send random password reset link
		var ctrl = this;
		$http.post('/api/reset', {email: this.email})
			.then(function(response) {
				ctrl.errMsg = 'Email sent';
				ctrl.email = '';
			}).catch(function(response) {
				if(response.data.message) ctrl.errMsg = response.data.message;
				else ctrl.errMsg = response.statusText;
			});
	};
}]);
