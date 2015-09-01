module.exports = function(config) {
  var options = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '.',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'jasmine',
      'fixture'
    ],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/sinon/pkg/sinon.js',
      'vendor/matchMedia/matchMedia.js',
      'vendor/matchMedia/matchMedia.addListener.js',
      'src/quartz.js',
      'test/quartz.spec.js',
      'test/fixtures/*.html'
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/fixtures/*.html': ['html2js']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome']

  };


  // additional configuration for sauce-labs
  if (process.env.TRAVIS) {
    var sauceConfig = require('./sauce.conf');
    options.browsers = Object.keys(sauceConfig.customLaunchers);
    options.captureTimeout = 180000;
    options.customLaunchers = sauceConfig.customLaunchers;
    options.sauceLabs = {
      build: 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')',
      startConnect: true,
      recordScreenshots: false,
      testName: 'quartz',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
    };
  }


  // additional options for coverage
  if (process.argv.indexOf('--coverage') !== -1) {
    options.singleRun = true;
    options.preprocessors['src/quartz.js'] = 'coverage';
    options.reporters.push('coverage');
    options.coverageReporter = {
      type : 'lcov',
      dir  : 'tmp/coverage'
    }
  }


  config.set(options);

};
