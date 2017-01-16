'use strict';

/**
 * Main application generator.  There are three options - barebones, default, and custom.
 * 
 * Barebones comes with no developer tools and only the most basic libraries/frameworks included.  The
 * starting application is nearly blank.
 *
 * Default comes with Grunt configured to perform some basic tasks.  It also uses Sass for css
 * styling.  The starting application includes a multi-page user authentication.
 *
 * Custom allows complete customization of developer tools and additional commonly used
 * libraries/frameworks.  It also allows selection between the barebones starting application and the
 * user authentication application.
 */

var Generator = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var wiredep = require('wiredep');

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.option('skip-install');
	}

	prompting() {
		// Get name of application and type to generate
		return new Promise(function(resolve, reject) {
			this.log(yosay(chalk.green('Welcome to the leaner, meaner MEAN stack generator!')));
			resolve();
		}.bind(this)).then(this.prompt.bind(this, [{
			type: 'input',
			name: 'name',
			message: 'Your project name',
			default: this.appname
		}, {
			type: 'list',
			name: 'gentype',
			message: 'What type of application would you like to generate?',
			choices: ['Barebones', 'Default', 'Custom'],
			default: 'Default'
		}])).then(function(answers) {
			this.name = answers.name;
			this.gentype = answers.gentype;

			// Delegate remaining prompts to helper methods
			switch(answers.gentype) {
				case 'Barebones':
					this._barebones_prompts();
					break;
				case 'Custom':
					this._custom_prompts();
					break;
				default:
					this._default_prompts();
					break;
			}
		}.bind(this));
	}

	_barebones_prompts() {
		this.log(chalk.magenta('Barebones applications come with JQuery, Bootstrap, and UI-Router.'));

		// Setup package.json dependencies
		this.pdependencies = JSON.stringify({
			'body-parser': '^1.15.2',
			'express': '^4.14.0',
			'mongodb': '^2.2.16'
		}, null, 2).replace(/\n/g, '\n  ');
		this.pdevDependencies = JSON.stringify({}, null, 2).replace(/\n/g, '\n  ');

		// Setup bower.json w/ angular, jquery, bootstrap
		this.bdependencies = JSON.stringify({
			'angular': '^1.6.0',
			'jquery': '^3.1.1',
			'bootstrap': '^3.3.7',
			'angular-ui-router': '^0.3.2'
		}, null, 2).replace(/\n/g, '\n  ');
		this.boverrides = JSON.stringify({
			'bootstrap': {
				'main': [
					'dist/js/bootstrap.js',
					'dist/css/bootstrap.css',
					'less/bootstrap.less'
				]
			}
		}, null, 2).replace(/\n/g, '\n  ');

	}

	_default_prompts() {
		this.log('Default prompts coming soon');
	}

	_custom_prompts() {
		this.log('Custom prompts coming soon');
	}

	writing() {
		// Create package.json and bower.json.  After done, start install.
		this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), {
			name: this.name,
			dependencies: this.pdependencies,
			devDependencies: this.pdevDependencies
		});
		this.fs.copyTpl(this.templatePath('_bower.json'), this.destinationPath('bower.json'), {
			name: this.name,
			dependencies: this.bdependencies,
			overrides: this.boverrides
		});
		this.fs.writeJSON(this.destinationPath('.yo-rc.json'), {}, null, 2);

		// Create directory structure
		this.fs.copy(this.templatePath('config.json'), this.destinationPath('config.json'));
		if(this.gentype === 'Barebones') {
			this.fs.copyTpl(this.templatePath('barebones'), this.destinationRoot(), {
				name: this.name
			});
		}
	}

	install() {
		// Install dependencies and wire them up
		if (!this.options['skip-install']) {
			this.installDependencies({
				npm: true,
				bower: true,
				callback: function() {
					wiredep({src: this.destinationPath('**/*.html')});
				}.bind(this)
			});
		}
	}

	end() {
		if(this.gentype === 'Barebones') {
			this.log();
			this.log(chalk.magenta('To start the application, run ') + chalk.cyan('node app/server/server.js') + 
				chalk.magenta(' and navigate to ') + chalk.cyan('http://localhost:9000/') + chalk.magenta(' in your browser.'));
		}
	}
};
