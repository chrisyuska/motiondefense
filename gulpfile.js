'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-clean-css');

gulp.task('sass', function () {
  return gulp.src([
      './sass/*.scss'
    ])
    .pipe(sass({
        includePaths: [
          './sass',
          './sass/components',
          './vendor/sass',
          './vendor/sass/components'
        ]
      }).on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('watch', function () {
  gulp.watch([
      './sass/*.scss',
      './sass/**/*.scss',
      './vendor/sass/*.scss',
      './vendor/sass/**/*.scss'
    ], ['sass']);
});

gulp.task('minify-css', function() {
  return gulp.src('./css/*.css')
    .pipe(minify({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['sass','watch', 'minify-css']);
