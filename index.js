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
    Q = require('q'),
    cordovaLib = require('cordova-lib'),
    cordova = cordovaLib.cordova;

module.exports = function(options) {

    options = options || {};

    return through.obj(function(file, enc, cb) {
        if(!file.isDirectory()) {
            cb(new gutil.PluginError('gulp-cordova-create', 'You can only pass in a folder.'));
            return;
        }

        var self = this,
            dir = '.cordova',
            config = {lib: {www: {url: file.path}}};

        mkdirp(dir, function() {
            Q.fcall(function() {
                cordova.create(dir, options.id, options.name, config);
            })
            .then(function() {
                self.push(new gutil.File({
                    base: file.cwd,
                    cwd: file.cwd,
                    path: path.join(file.cwd, dir),
                    stat: fs.statSync(path.join(file.cwd, dir))
                }));

                cb();
            });
        });
    });
};
