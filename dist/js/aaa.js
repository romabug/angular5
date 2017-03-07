'use strict';


//1111111111111
//1111111111111
//1111111111111

var
  glob = require('glob'),  
  _ = require('lodash'),  
  fs = require('fs'),
  path = require('path'),
  jsbeautify = require('js-beautify').js_beautify,
  pkg = require('./package.json'),
  plugins = require('gulp-load-plugins')(),
  runSequence = require('run-sequence'),
  argv = require('yargs').argv,
  args = [],
  stamp = {
    pkg: pkg    
  },
  getBaseHref = function(selector) {
    var
      baseHref = pkg.build.baseHref.split('|'),
      selected = baseHref[0],
      baseHrefMatcher = [],
      regExpFindBaseHref;

    // console.log(baseHref);
    baseHref.forEach(function(val) {
      baseHrefMatcher.push('^' + val + '$');
    });

    regExpFindBaseHref = new RegExp(baseHrefMatcher.join('|'));
    selected = selector ? selector.match(regExpFindBaseHref)[0] : selected;

    return selected;
  },
  getDirectories = function(src) {
    return fs.readdirSync(src).filter(function(dir) {
      return fs.statSync(path.join(src, dir)).isDirectory();
    });
  },
  gulp = require('gulp');

// fix if could not be loaded by 'gulp-load-plugins'
plugins.gutil = require('gulp-util');
plugins.prefixer = require('gulp-autoprefixer');
plugins.gif = require('gulp-if');
plugins.tmpl = require('gulp-template');
plugins.reload = require('gulp-livereload');
plugins.prettify = require('gulp-jsbeautifier');
plugins.validateYaml = require('gulp-yaml-validate');

(function() {
  stamp.jsbeautifyrc = JSON.parse(fs.readFileSync('./.jsbeautifyrc').toString());
  // console.log(JSON.parse(stamp.jsbeautifyrc));
})();

(function() {
  //creaet bower override json
  var
    rjsVendorJSON = require('./src/js/rjs-vendor.json'),
    dirs = getDirectories('bower_components'),
    ignoreVendor = {};

  _.difference(dirs, Object.keys(rjsVendorJSON)).map(function(vendor) {
    ignoreVendor[vendor] = {
      "ignore": true
    };
  });

  fs.writeFileSync('./gulp/lib/bower-overrides.json', jsbeautify(JSON.stringify(_.assign(rjsVendorJSON, ignoreVendor)), stamp.jsbeautifyrc.js));
})();

(function() {
  //build ddff files before gulp tasks
  var
    replaceFiles = fs.readFileSync('./gulp/_bundle.js').toString(),
    rjsShimeConfig = fs.readFileSync('./src/js/rjs-shim.json').toString();

  replaceFiles = replaceFiles.replace('//=include rjs-shim.json', rjsShimeConfig);
  fs.writeFileSync('./gulp/bundle.js', jsbeautify(replaceFiles, stamp.jsbeautifyrc.js));

})();