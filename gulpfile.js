var gulp = require('gulp');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var merge2 = require('merge2');

gulp.task('babel:client', function() {
  return merge2(
    gulp.src(['src/client/**/*', '!src/client/**/*.es6.js']),
    merge2(
      gulp.src('node_modules/babel/node_modules/babel-core/browser-polyfill.min.js'),
      gulp.src('src/client/**/*.es6.js')
        .pipe(babel())
        .pipe(rename(function(path) {
          path.basename = path.basename.replace('.es6', '');
        }))
    ).pipe(concat('index.js'))
  ).pipe(gulp.dest('public'));
});

gulp.task('babel:server', function() {
  return merge2(
    gulp.src(['src/server/**/*', '!src/server/**/*.es6.js']),
    gulp.src('src/server/**/*.es6.js')
      .pipe(babel({
        optional: 'runtime'
      }))
      .pipe(rename(function(path) {
        path.basename = path.basename.replace('.es6', '');
      }))
      .pipe(concat('index.js'))
  ).pipe(gulp.dest('lib'));
});

gulp.task('watch', ['babel:client', 'babel:server'], function() {
  gulp.watch('src/client/**/*.es6.js', ['babel:client']);
  gulp.watch('src/server/**/*.es6.js', ['babel:server']);
});

gulp.task('default', ['watch']);
gulp.task('build', ['babel:client', 'babel:server']);
