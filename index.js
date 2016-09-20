'use strict';

/**
 * Creates a new cordova project in the current directory.
 *
 * @author Sam Verschueren	  <sam.verschueren@gmail.com>
 * @since  18 April 2015
 */

// module dependencies
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var through = require('through2');
var gutil = require('gulp-util');
var cordova = require('cordova-lib').cordova.raw;
var Q = require('q');
var extend = require('extend');

module.exports = function (options) {
	var firstFile;

	return through.obj(function (file, enc, cb) {
		if (!file.isDirectory()) {
			// Quit if the file provided is not a directory. In the future we can maybe
			// store all the files in a temporary directory and pass the temporary directory
			// to the cordova create command
			cb(new gutil.PluginError('gulp-cordova-create', 'You can only pass in a folder.'));
			return;
		}

		if (firstFile === undefined) {
			firstFile = file;

			options = options || {};

			var self = this;
			var dir = options.dir || '.cordova';
			var config = {lib: {www: {url: firstFile.path}}};
			var buildJsonPath = dir  + path.sep + 'build.json';

			/**
			 * Returns a promise to update the build config
			 */
			function buildConfig(){
				return Q.fcall(function(){
					return fs.existsSync(buildJsonPath);
				})
				// Get the current contents of build.json
				.then(function(exists){
					if (exists){
						return JSON.parse(fs.readFileSync(buildJsonPath));
					}
					return {};
				})
				// Replace / Merge config with specified config
				.then(function(buildConfig){
					return extend(true, buildConfig, options.buildConfig);
				})
				// Save the new config
				.then(function(buildConfig){
					return fs.writeFileSync(buildJsonPath, JSON.stringify(buildConfig, null, '  '));
				});
			}

			Q.fcall(function(){
				return mkdirp.sync(dir);
			})
			// Create the cordova project
			.then(function(){
				return cordova.create(dir, options.id, options.name, config);
			})
			.then(function(){
				// Pass in the cordova project directory to the next step
				self.push(new gutil.File({
					base: firstFile.cwd,
					cwd: firstFile.cwd,
					path: path.join(firstFile.cwd, dir),
					stat: fs.statSync(path.join(firstFile.cwd, dir))
				}));
			})
			// Decide if we need to create/update a build.json file
			.then(function(){
				if(options.buildConfig != null){
					return buildConfig();
				}
			})
			.then(function(){
				cb();
			})
			// Create the cordova project
			.catch(function (err) {
				cb(new gutil.PluginError('gulp-cordova-create', err.message));
			});
		}
	});
};
