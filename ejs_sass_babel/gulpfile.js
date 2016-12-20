// import gulp from 'gulp';
// import pleeease from 'gulp-pleeease';

var gulp = require('gulp');
var pleeease = require('gulp-pleeease');

gulp.task('css', () => {
  gulp.src('./dev/scss/app.scss')
    .pipe(pleeease({
      "minifier": false,
      "sass": true
    }))
    .pipe(gulp.dest('./dist'));
})

gulp.task('default', ['css']);