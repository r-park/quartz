var browserSync = require('browser-sync'),
    bump = require('gulp-bump'),
    concat = require('gulp-concat'),
    del = require('del'),
    eslint = require('gulp-eslint'),
    gulp = require('gulp'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    umd = require('gulp-umd');

var manifests = ['./bower.json', './package.json'];



gulp.task('bump', function(){
  return gulp.src(manifests)
    .pipe(bump({type: 'patch'}))
    .pipe(gulp.dest('./'));
});


gulp.task('bump:minor', function(){
  return gulp.src(manifests)
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});


gulp.task('clean:dist', function(done){
  del('./dist/*', done);
});


gulp.task('clean:target', function(done){
  del('./target/*', done);
});


gulp.task('matchmedia', function(){
  return gulp.src(['./vendor/matchMedia/matchMedia.js', './vendor/matchMedia/matchMedia.addListener.js'])
    .pipe(concat('match-media.js'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('copy', function(){
  return gulp.src(['./src/**/*.html', './src/**/*.js'])
    .pipe(gulp.dest('./target'));
});


gulp.task('headers', function(){
  var pkg = require('./package.json');
  var headerTemplate = '/* <%= name %> v<%= version %> - <%= date %> - <%= url %> */\n';
  var headerContent = {date: (new Date()).toISOString(), name: pkg.name, version: pkg.version, url: pkg.homepage};

  return gulp.src('./dist/quartz*.js')
    .pipe(header(headerTemplate, headerContent))
    .pipe(gulp.dest('./dist'));
});


gulp.task('lint', function(){
  return gulp.src('./src/quartz*.js')
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task('sass', function(){
  return gulp.src('./src/*.scss')
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'nested',
      precision: 10,
      sourceComments: false
    }))
    .pipe(gulp.dest('./target'));
});


gulp.task('sync', function(){
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


gulp.task('process', function(){
  var umdHelper = function(){ return 'Quartz'; };

  return gulp.src('./src/quartz.js')
    .pipe(umd({exports: umdHelper, namespace: umdHelper}))
    .pipe(gulp.dest('./dist'));
});


gulp.task('uglify', function(){
  return gulp.src('./dist/*.js')
    .pipe(rename(function(path){
      path.basename += ".min";
    }))
    .pipe(sourcemaps.init())
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(sourcemaps.write('./', {includeContent: true}))
    .pipe(gulp.dest('./dist'));
});


gulp.task('build', gulp.series('lint', 'clean:dist', 'process', 'matchmedia', 'uglify', 'headers'));


gulp.task('dist:patch', gulp.series('bump', 'build'));
gulp.task('dist:minor', gulp.series('bump:minor', 'build'));


gulp.task('default', gulp.series('clean:target', 'copy', 'sass', function watch(){
  gulp.watch('./src/**/*.scss', gulp.task('sass'));
  gulp.watch(['./src/**/*.html', './src/**/*.js'], gulp.task('copy'));
}));
