'use strict';

/**
 * Link is a function that is called (once) when the directive is parsed.  Default inputs
 * are the scope, and any of the restrict options (element or attr by default).  Other
 * parameters are added depending on the value of the require key.  Requiring ngModel
 * causes this to pass the model controller for the element with the directive.  The
 * scope key overrides the default scope (global) and allows you to define variables
 * whose values are equal to those given as attributes in the html.  Here, scope.conf
 * is set to 'value' with the directive 'validate-confirm="value"' in the html tag.
 *
 * The link function is only called once, but we want to update the validity any time the
 * ngModel changes.  To do this, we use the model controller's $parsers variable to push
 * a new function that is evaluated when the model changes.  It accepts the value of the
 * ngModel at that time and expects that value to either be modified or passed through.  
 * Since we don't want to change the model value, only access it, we return the value
 * unchanged.  However, we also check to see if the value is equal to the value of conf 
 * and if not set the validity of this element to false.
 */

angular.module('index').directive('validateConfirm', function() {
	return {
		require: 'ngModel',
		scope: {
			conf: '=validateConfirm'
		},
		link: function(scope, elem, attr, mCtrl) {
			mCtrl.$parsers.push(function(value) {
				if(value !== scope.conf) mCtrl.$setValidity('confirm', false);
				else mCtrl.$setValidity('confirm', true);
				return value;
			});
		}
	};
});
