'use strict';

/**
 * Creates and configures a new ui-router route.  Creates a new controller and view and
 * links them to a new state in the module's configuration file.
 */

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var path = require('path');
var fs = require('fs');

module.exports = class extends Generator {
	prompting() {
		// Get view and controller names
		return this.prompt([{
			type: 'input',
			name: 'routeName',
			message: 'Route state name (ex. myroute)'
		}, {
			type: 'input',
			name: 'routeUrl',
			message: 'Route url (ex. /myroute)'
		}, {
			type: 'input',
			name: 'viewName',
			message: 'View name (ex. myview)'
		}, {
			type: 'input',
			name: 'ctrlName',
			message: 'Controller name (ex. MyControllerNameCtrl)'
		}, {
			type: 'input',
			name: 'instName',
			message: 'Controller instance name (ex. mctrl)'
		}, {
			type: 'list',
			name: 'module',
			message: 'Which module do you want to add the controller to?',
			choices: fs.readdirSync(this.destinationPath('app/client')).filter(function(f) {
				var p = this.destinationPath('app/client');
				return fs.statSync(path.join(p, f)).isDirectory();
			}.bind(this)),
			store: true
		}]).then(function(answers) {
			this.routeName = answers.routeName;
			this.routeUrl = answers.routeUrl;
			this.viewName = answers.viewName;
			this.ctrlName = answers.ctrlName;
			this.instName = answers.instName;
			this.module = answers.module;

			// Get templateUrl relative to the module in case view is in a subdirectory
			var modulePath = this.destinationPath('app/client/' + this.module);
			this.templateUrl = path.relative(modulePath, path.join(this.contextRoot, this.viewName + '.html'));

			// Compose view and controller
			this.composeWith(require.resolve('../view'), {name: this.viewName, cwd: this.contextRoot});
			this.composeWith(require.resolve('../controller'), {name: this.ctrlName, module: this.module, cwd: this.contextRoot});
		}.bind(this));
	}

	writing() {
		// Add state to route file
		var routePath = this.destinationPath('app/client/' + this.module + '/' + this.module + '.js');
		if(this.fs.exists(routePath)) {
			this.log(chalk.magenta('Adding route to ' + this.module + ' module\'s ' + this.module + '.js file.'));
			var routeFile = this.fs.read(routePath);
			var splt = routeFile.split('$stateProvider');
			splt[splt.length-1] = '\n\t\t\t.state({\n\t\t\t\t' +
				'name: \'' + this.routeName + '\',\n\t\t\t\t' +
				'url: \'' + this.routeUrl + '\',\n\t\t\t\t' +
				'templateUrl: \'' + this.templateUrl + '\',\n\t\t\t\t' + 
				'controller: \'' + this.ctrlName + ' as ' + this.instName + '\'\n\t\t\t' +
			'})' + splt[splt.length-1];
			routeFile = splt.join('$stateProvider');
			fs.writeFileSync(routePath, routeFile);
		} else {
			this.log(chalk.yellow('Warning: could not find route file ' + this.module + '.js for module' + this.module + '.  Be sure to add your new route to the $stateProvider in the module\'s configuration.'));
		}
	}

	end() {
		this.log();
		this.log(chalk.magenta('To use your new route, add ui-sref="' + this.routeName + '" to an <a> tag or call $state.go(\'' + this.routeName + '\') from Javascript.'));
	}
};
