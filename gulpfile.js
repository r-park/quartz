var browserSync = require('browser-sync'),
    bump = require('gulp-bump'),
    del = require('del'),
    gulp = require('gulp'),
    header = require('gulp-header'),
    pkg = require('./package.json'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    umd = require('gulp-umd');

var manifests = ['./bower.json', './package.json'];


gulp.task('bump', function(){
  return gulp.src(manifests)
    .pipe(bump())
    .pipe(gulp.dest('./'));
});


gulp.task('bump:minor', function(){
  return gulp.src(manifests)
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});


gulp.task('clean', function clean(done){
  del('./target/*', done);
});


gulp.task('copy', function copy(){
  return gulp.src(['./src/**/*.html', './src/**/*.js'])
    .pipe(gulp.dest('./target'));
});


gulp.task('sass', function compileSass(){
  return gulp.src('./src/*.scss')
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'nested',
      precision: 10,
      sourceComments: false
    }))
    .pipe(gulp.dest('./target'));
});


gulp.task('serve', function server(){
  browserSync
    .create()
    .init({
      browser: "firefox",
      files: ['target/**/*'],
      port: 7000,
      server: {
        baseDir: '.'
      }
    });
});


gulp.task('build', function(){
  var headerTemplate = '/* <%= name %> v<%= version %> - <%= date %> */\n';
  var headerContent = {name: pkg.name, version: pkg.version, date: new Date()};
  var umdHelper = function(){ return 'mason'; };

  gulp.src('./src/mason.js')
    .pipe(umd({exports: umdHelper, namespace: umdHelper}))
    .pipe(header(headerTemplate, headerContent))
    .pipe(gulp.dest('./dist'))
    .pipe(sourcemaps.init())
    .pipe(uglify({mangle: true}))
    .pipe(sourcemaps.write('./', {includeContent: true}))
    .pipe(rename('mason.min.js'))
    .pipe(header(headerTemplate, headerContent))
    .pipe(gulp.dest('./dist'));
});


gulp.task('default', gulp.series('clean', 'copy', 'sass', function watch(){
  gulp.watch('./src/**/*.scss', gulp.task('sass'));
  gulp.watch(['./src/**/*.html', './src/**/*.js'], gulp.task('copy'));
}));
