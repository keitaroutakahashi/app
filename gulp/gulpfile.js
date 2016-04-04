var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');
var autoprefixer = require("gulp-autoprefixer");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint')
var plumber = require("gulp-plumber");


// js
gulp.task('js', function () {
  gulp.src('./src/js/*.js')
  	.pipe(plumber())
  	.pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

// sass
gulp.task('scss', function () {
  gulp.src('./src/scss/*.scss')
  	.pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(concat('app.css'))
    .pipe(minify())
    .pipe(gulp.dest('dist/css'))
});

gulp.task('default', function() {
	gulp.watch('./src/js/*.js',['js']);
	gulp.watch('./src/scss/*.scss',['scss']);
});