'use strict';

/**
 * Create a new express route.
 */

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.argument('name', {type: String, required: false});
		this.argument('cwd', {type: String, required: false});
	}

	initializing() {
		// Set contextRoot if working directory argument present
		if(this.options['cwd']) this.contextRoot = this.options['cwd'];

		// Initialize prompts based on arguments
		if(!this.options['name']) {
			this.prompts = [{
				type: 'input',
				name: 'name',
				message: 'Route name (ex. myroute)'
			}];
		} else {
			this.prompts = [];
		}
	}

	prompting() {
		// Get route name
		return this.prompt(this.prompts).then(function(answers) {
			if(answers.name) this.name = answers.name;
			else this.name = this.options['name'];
		}.bind(this));
	}

	writing() {
		// Create new route
		var destPath = path.join(this.contextRoot, this.name + '.js');
		this.fs.copy(this.templatePath('route.js'), destPath);
	}

	end() {
		this.log();
		this.log(chalk.magenta('To use your new route, add ') + chalk.cyan('app.use(\'/' + this.name + 
			'\', require(\'./' + this.name + '.js\'))') + chalk.magenta(' (or app.get/app.post) to your server.js file.'));
	}

};
