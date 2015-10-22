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

			// Make sure the directory exists
			mkdirp(dir, function () {
				// Create the cordova project in the correct directory
				cordova.create(dir, options.id, options.name, config).then(function () {
					// Pass in the cordova project directory to the next step
					self.push(new gutil.File({
						base: firstFile.cwd,
						cwd: firstFile.cwd,
						path: path.join(firstFile.cwd, dir),
						stat: fs.statSync(path.join(firstFile.cwd, dir))
					}));

					// Continue
					cb();
				}).catch(function (err) {
					cb(new gutil.PluginError('gulp-cordova-create', err.message));
				});
			});
		}
	});
};
