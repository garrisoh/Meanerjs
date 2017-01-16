'use strict';

/**
 * Creates a new Angular module to represent a new page.
 */

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var path = require('path');
var wiredep = require('wiredep');

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.argument('name', {type: String, required: false});
		this.argument('cwd', {type: String, required: false});
	}

	initializing() {
		// Set contextRoot if given working directory argument
		if(this.options['cwd']) this.contextRoot = this.options['cwd'];

		// Setup prompts based on arguments
		if(!this.options['name']) {
			this.prompts = [{
				type: 'input',
				name: 'name',
				message: 'Module name (ex. mymodule)'
			}];
		} else {
			this.prompts = [];
		}
	}

	prompting() {
		// Get module name
		return this.prompt(this.prompts).then(function(answers) {
			if(answers.name) this.name = answers.name;
			else this.name = this.options['name'];
		}.bind(this));
	}

	writing() {
		// Copy and template all files
		var nameCaps = this.name.charAt(0).toUpperCase() + this.name.slice(1);
		this.fs.copyTpl(this.templatePath('index.html'), this.destinationPath('app/client/' + this.name + '/index.html'), {
			name: this.name,
			nameCaps: nameCaps
		});
		this.fs.copy(this.templatePath('module.html'), this.destinationPath('app/client/' + this.name + '/' + this.name + '.html'));
		this.fs.copy(this.templatePath('module.css'), this.destinationPath('app/client/' + this.name + '/' + this.name + '.css'));
		this.fs.copyTpl(this.templatePath('module.js'), this.destinationPath('app/client/' + this.name + '/' + this.name + '.js'), {
			name: this.name,
			nameCaps: nameCaps,
			nameFirst: this.name.charAt(0)
		});
		this.fs.copyTpl(this.templatePath('ModuleCtrl.js'), this.destinationPath('app/client/' + this.name + '/' + nameCaps + 'Ctrl.js'), {
			name: this.name,
			nameCaps: nameCaps
		});
	}

	install() {
		// Wire bower dependencies
		wiredep({
			cwd: this.destinationRoot(),
			src: this.destinationPath('app/client/' + this.name + '/index.html')
		});
	}

	end() {
		this.log();
		this.log(chalk.magenta('To use your new module, add href="/' + this.name + '" to a link in an existing module.'));
	}

};
