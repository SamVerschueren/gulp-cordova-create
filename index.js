'use strict';

/**
 * Creates a new cordova project in the current directory.
 *
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  18 April 2015
 */

// module dependencies
var mkdirp = require('mkdirp'),
    through = require('through2'),
    gutil = require('gulp-util'),
    cordovaLib = require('cordova-lib'),
    cordova = cordovaLib.cordova;

module.exports = function(options) {

    options = options || {};

    return through.obj(function(file, enc, cb) {

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

            cb();
        });
    });
};
