'use strict';

/**
 * Creates a new html partial.
 */

var Generator = require('yeoman-generator');
var path = require('path');

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
				message: 'View name (ex. myview)'
			}];
		} else {
			this.prompts = [];
		}
	}

	prompting() {
		// Get view name
		return this.prompt(this.prompts).then(function(answers) {
			if(answers.name) this.name = answers.name;
			else this.name = this.options['name'];
		}.bind(this));
	}

	writing() {
		// Create new view
		var destPath = path.join(this.contextRoot, this.name + '.html');
		this.fs.copy(this.templatePath('tmp.html'), destPath);
	}

};
