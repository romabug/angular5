'use strict';

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

//stamp
argv.production = argv.production || argv.minify;

stamp.production = argv.production;
stamp.routePrefix = pkg.build.html5mode ? '' : '#!';

//--build='oa', --build='oas'
if (_.isString(argv.build) && getBaseHref(argv.build) === argv.build) {
  stamp.buildDir = stamp.serveDir = stamp.baseHref = argv.build;
} else {
  stamp.buildDir = stamp.serveDir = stamp.baseHref = getBaseHref();
}

//serve setting
stamp.hostname = 'localhost';
stamp.port = '2015';

if (argv.ip) {
  stamp.hostname = require('dev-ip')()[0] || stamp.hostname;
  stamp.host = '//' + stamp.hostname + ':' + stamp.port + '/' + stamp.buildDir + '/';
} else {
  stamp.host = '';
}

// stamp.serviceUrl = pkg.build.service.name + '/' + pkg.build.service.version;
stamp.serviceUrl = pkg.build.service.name;

if (argv.api) {
  // _api host
  stamp.apiDir = pkg.build.service.name;
  stamp._apiHostname = stamp.hostname;
  stamp._apiPort = stamp.port * 3;
  stamp.serviceUrl = '//' + stamp._apiHostname + ':' + stamp._apiPort + '/' + stamp.serviceUrl;
}

stamp.prelaunch = argv.prelaunch;
if (argv.production) {
  if (!argv.build) {
    stamp.baseHref = getBaseHref('oa');
  }
  stamp.production = argv.production;
}

stamp.bundledjs = process.cwd() + '/src/js/rjs-bundle.json';

//pass args
args = [gulp, plugins, argv, stamp];

require('./gulp/clean').apply(null, args);

if (argv.login || argv.production) {
  require('./gulp/build-login').apply(null, [].concat(args).concat([runSequence]));
}
require('./gulp/copy').apply(null, [].concat(args).concat([runSequence]));
require('./gulp/bundle').apply(null, [].concat(args).concat([runSequence]));
require('./gulp/build').apply(null, [].concat(args).concat([runSequence]));
require('./gulp/lint').apply(null, args);
//
require('./gulp/test').apply(null, [].concat(args).concat([runSequence]));
require('./gulp/watch').apply(null, args);
//
require('./gulp/serve').apply(null, [].concat(args).concat([runSequence]));


/////////////////////////////////////////
// Are you sure you know what you doing ?
/////////////////////////////////////////
require('./gulp/format').apply(null, args);

/////////////////////////////////////////
//defualt
/////////////////////////////////////////
gulp.task('default', ['build']);
