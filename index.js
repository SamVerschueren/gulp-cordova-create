'use strict';

/**
 * Creates a new cordova project in the current directory.
 *
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  18 April 2015
 */

// module dependencies
var path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    through = require('through2'),
    gutil = require('gulp-util'),
    cordovaLib = require('cordova-lib'),
    cordova = cordovaLib.cordova;

module.exports = function(options) {

    options = options || {};

    return through.obj(function(file, enc, cb) {

        var self = this;

        if(!file.isDirectory()) {
            cb(new gutil.PluginError('gulp-cordova-create', 'You can only pass in a folder.'));
            return;
        }

        var config = {
            lib: {
                www: {
                    url: file.path
                }
            }
        };

        mkdirp('.cordova', function() {
            cordova.create('.cordova', options.id, options.name, config);

            self.push(new gutil.File({
                base: file.cwd,
                cwd: file.cwd,
                path: path.join(file.cwd, '.cordova'),
                stat: fs.statSync(path.join(file.cwd, '.cordova'))
            }));

            cb();
        });
    });
};
