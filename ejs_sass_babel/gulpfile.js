// 共通
const gulp = require('gulp');
const plumber = require("gulp-plumber");
const source = require('vinyl-source-stream');
const browserSync = require('browser-sync');

// EJS
const ejs = require("gulp-ejs");

// Sass
const sass = require('gulp-sass');
const minify = require('gulp-minify-css');
const autoprefixer = require("gulp-autoprefixer");
const concat = require('gulp-concat');

// JS
const browserify = require('browserify');
const babelify = require('babelify');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');
const streamify = require('gulp-streamify');
const buffer = require('vinyl-buffer'); // here

const path = {
	dist: 'dist/assets/',
	dev: 'dev/'
}


// BrowserSync
gulp.task("browserSync", function () {
  browserSync({
    notify: false,
    server: {
        baseDir: 'dist/'
    },
    startPath: '/',
  });

  gulp.watch(path.dist + '**/', function() {
    browserSync.reload();
  });
});


// EJS
gulp.task('ejs', () => {
	gulp.src(
		[path.dev + "ejs/**/*.ejs",'!' + path.dev + "ejs/**/_*.ejs"]
	)
	.pipe(plumber())
	.pipe(ejs(ejs,{"ext": ".html"}))
	.pipe(gulp.dest('dist/'))
});


// Sass
gulp.task('scss', () => {
  gulp.src(path.dev + 'scss/**/*.scss')
  	.pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ["last 2 versions", "Android >= 4","ios_saf >= 8"]
    }))
    .pipe(concat('app.css'))
    .pipe(minify())
    .pipe(gulp.dest(path.dist + 'asset/css'))
});


// JS
gulp.task('js', () => {
	browserify(path.dev + 'js/app/app.js', { debug: true })
		.transform(babelify)
		.bundle()
		.on("error", function (err) {
      console.log(err.message); 
      console.log(err.stack);
    })
		.pipe(source('bundle.js'))
    .pipe(streamify(uglify()))
		.pipe(gulp.dest(path.dist + 'js/'))
});


gulp.task('watch', () => {
	gulp.watch(path.dev + 'ejs/**/*.ejs',['ejs']);
	gulp.watch(path.dev + 'css/**/*.css',['scss']);
	gulp.watch(path.dev + 'js/**/*.js',['js']);
});


gulp.task('default', ['watch', 'browserSync']);