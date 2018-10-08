'use strict';
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const through = require('through2');
const gutil = require('gulp-util');
const {cordova} = require('cordova-lib');

module.exports = options => {
	let firstFile;

	return through.obj((file, enc, cb) => {
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

			const dir = options.dir || '.cordova';

			const config = {
				lib: {
					www: {
						template: true,
						url: firstFile.path
					}
				}
			};

			// Make sure the directory exists
			mkdirp.sync(dir);

			// Create the cordova project in the correct directory
			cordova.create(dir, options.id, options.name, config)
				.then(() => {
					// Continue
					cb(undefined, new gutil.File({
						base: firstFile.cwd,
						cwd: firstFile.cwd,
						path: path.join(firstFile.cwd, dir),
						stat: fs.statSync(path.join(firstFile.cwd, dir))
					}));
				})
				.catch(error => {
					cb(new gutil.PluginError('gulp-cordova-create', error.message));
				});
		}
	});
};
