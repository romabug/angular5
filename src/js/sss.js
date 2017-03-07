

//2222222222
//22222222ddd232ee
//2222222222444ss
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
