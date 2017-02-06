'use strict';

/**
 *
 */

angular.module('index').directive('validatePassword', function() {
	return {
		require: 'ngModel',
		link: function(scope, elem, attr, mCtrl) {
			mCtrl.$parsers.push(function(value) {
				if(value.length < 8) mCtrl.$setValidity('Password must be at least 8 characters', false);
				else mCtrl.$setValidity('Password must be at least 8 characters', true);

				if(!/[a-z]/.test(value)) mCtrl.$setValidity('Password must contain at least 1 lowercase character', false);
				else mCtrl.$setValidity('Password must contain at least 1 lowercase character', true);

				if(!/[A-Z]/.test(value)) mCtrl.$setValidity('Password must contain at least 1 uppercase character', false);
				else mCtrl.$setValidity('Password must contain at least 1 uppercase character', true);

				if(!/[^a-zA-Z]/.test(value)) mCtrl.$setValidity('Password must contain at least 1 number (0-9) or special character (ex. !, @, $)', false);
				else mCtrl.$setValidity('Password must contain at least 1 number (0-9) or special character (ex. !, @, $)', true);

				return value;
			});
		}
	};
});
