'use strict';

/**
 * Creates a new Angular filter and links the filter to the module's html file.
 */

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var path = require('path');
var fs = require('fs');

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.argument('name', {type: String, required: false});
		this.argument('module', {type: String, required: false});
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
				message: 'Filter name (ex. myFilterName)'
			}];
		} else {
			this.prompts = [];
		}

		if(!this.options['module']) {
			this.prompts = this.prompts.concat([{
				type: 'list',
				name: 'module',
				message: 'Which module do you want to add the filter to?',
				choices: fs.readdirSync(this.destinationPath('app/client')).filter(function(f){
					var p = this.destinationPath('app/client');
					return fs.statSync(path.join(p, f)).isDirectory();
				}.bind(this)),
				store: true
			}]);
		}
	}

	prompting() {
		// Get module and filter names
		return this.prompt(this.prompts).then(function(answers) {
			if(answers.name) this.name = answers.name;
			else this.name = this.options['name'];

			if(answers.module) this.module = answers.module;
			else this.module = this.options['module'];
		}.bind(this));
	}

	writing() {
		// Create new filter
		var destPath = path.join(this.contextRoot, this.name + '.js');
		this.fs.copyTpl(this.templatePath('filt.js'), destPath, {
			module: this.module,
			name: this.name
		});

		// If index.html file exists in module folder, add script src
		var indexPath = this.destinationPath('app/client/' + this.module + '/index.html')
		if(this.fs.exists(indexPath)) {
			this.log(chalk.magenta('Linking filter to ' + this.module + ' module\'s index.html file.'));
			var index = this.fs.read(indexPath);
			var splt = index.split('</body>');
			splt[0] = splt[0] + '\t<script src="' + 
				path.relative(this.destinationPath('app/client/' + this.module), destPath) + '"></script>\n\t';
			index = splt.join('</body>');
			fs.writeFileSync(indexPath, index);
		} else {
			this.log(chalk.yellow('Warning: Could not find an index.html file for module ' + this.module + '.  Be sure to link your filter script to the relevant html file.'));
		}
	}

	end() {
		this.log();
		this.log(chalk.magenta('Pipe stuff into your new filter like this: {{ stuff | ' + this.name + '}}'));
	}

};
