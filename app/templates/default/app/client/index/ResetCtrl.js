'use strict';

/**
 *
 */

angular.module('index').controller('ResetCtrl', ['$http', '$location', '$state', function($http, $location, $state) {
	this.pass = '';
	this.passRep = '';
	this.errMsg = null;

	$('[name=pass]').popover({
		content: 'Password must have at least:<br>8 characters<br>1 lowercase letter<br>1 uppercase letter<br>1 number or special character',
		html: true
	});

	this.resetPassword = function(resetForm) {
		// Verify passwords
		this.errMsg = null;
		if(resetForm.pass.$invalid) {
			var errors = Object.keys(resetForm.pass.$error);
			if(errors.indexOf('required') > -1) this.errMsg = 'Please enter a valid password';
			else this.errMsg = errors[0];
			return;
		}

		if(resetForm.passRep.$invalid) {
			this.errMsg = 'Password confirmation must equal password';
			return;
		}

		// Reset password
		var ctrl = this;
		$http.post('/api/reset', {password: this.pass}, {headers: {'Authorization': 'Bearer ' + $location.path().split('/').pop()}})
			.then(function(response) {
				$state.go('login');
			}).catch(function(response) {
				if(response.data.message) ctrl.errMsg = response.data.message;
				else ctrl.errMsg = response.statusText;
			});
	};
}]);
