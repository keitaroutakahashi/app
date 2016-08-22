// 共通
const gulp = require('gulp');
const plumber = require("gulp-plumber");
const source = require('vinyl-source-stream');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

// EJS
const ejs = require("gulp-ejs");

// PostCSS
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const postcssVars = require('postcss-simple-vars');
const postcssComment = require('postcss-inline-comment');

// JS
const browserify = require('browserify');
const babelify = require('babelify');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');

const path = {
	dist: 'dist/assets/',
	dev: 'dev/'
}



gulp.task('browserSync', () => {
	browserSync.init(null, {
		proxy: 'http://localhost:3000',
		port: 7000
	});
});


// EJS
gulp.task('ejs', () => {
	gulp.src(
		[path.dev + "ejs/**/*.ejs",'!' + path.dev + "ejs/**/_*.ejs"]
	)
	.pipe(plumber())
	.pipe(ejs(ejs,{"ext": ".html"}))
	.pipe(gulp.dest(path.dist))
});


// PostCSS
gulp.task('css', () => {
	const plugins = [
		postcssComment,
		postcssImport,
		postcssNested,
		postcssVars,
		autoprefixer,
		cssnano
	];
	return gulp.src(path.dev + 'css/app.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest(path.dist + 'css/'));
});


// JS
gulp.task('browserify', () => {
	browserify(path.dev + 'js/app.js', { debug: true })
		.transform(babelify)
		.bundle()
		.on("error", function (err) { console.log("Error : " + err.message); })
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(path.dist + 'js/'))
});


gulp.task('watch', () => {
	gulp.watch(path.dev + 'ejs/**/*.ejs',['ejs']);
	gulp.watch(path.dev + 'css/**/*.css',['css']);
	gulp.watch(path.dev + 'js/**/*.js',['js']);
});


gulp.task('default', ['watch', 'browserSync']);