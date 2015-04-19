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
    cordovaLib = require('cordova-lib'),
    cordova = cordovaLib.cordova;

module.exports = function(options) {

    options = options || {};

    return through.obj(function(file, enc, cb) {

        mkdirp('.cordova', function() {
            cordova.create('.cordova', options.id, options.name);

            cb();
        });
    });
};
