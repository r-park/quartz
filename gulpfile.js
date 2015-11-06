var browserSync = require('browser-sync'),
    del = require('del'),
    gulp = require('gulp'),
    sass = require('gulp-sass');


gulp.task('sass', function compileSass(){
  return gulp.src('./src/*.scss')
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'nested',
      precision: 10,
      sourceComments: false
    }))
    .pipe(gulp.dest('./assets'));
});


gulp.task('sync', function server(){
  browserSync
    .create()
    .init({
      browser: "firefox",
      files: ['assets/*', '*.html'],
      port: 7000,
      server: {
        baseDir: '.'
      }
    });
});


gulp.task('default', gulp.series('sass', function watch(){
  gulp.watch('./src/**/*.scss', gulp.task('sass'));
}));
