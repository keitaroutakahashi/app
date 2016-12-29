import gulp from 'gulp';
import plumber from 'gulp-plumber';
import ejs from 'gulp-ejs'
import pleeease from 'gulp-pleeease';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import browserify from 'browserify';
import babelify from 'babelify';
import watchify from 'watchify';
import uglify from 'gulp-uglify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import bs from 'browser-sync';

const browserSync = bs.create();



const ejsPass = ["./dev/ejs/*.ejs", "./dev/ejs/**/*.ejs", "!"+"./dev/ejs/**/_*.ejs"];



gulp.task('ejs', () => {
  gulp.src(ejsPass)
    .pipe(plumber())
    .pipe(ejs('',{"ext": ".html"}))
    .pipe(gulp.dest('./dist/'));
});


gulp.task('scss', () => {
  gulp.src('./dev/scss/*.scss')
    .pipe(sass())
    .pipe(pleeease({
      autoprefixer:true,
      minifier: true,
      mqpacker: true
    }))
    .pipe(gulp.dest('./dist/assets/css/'));
});


gulp.task('js', () => {
  browserify({
    entries: ['dev/js/main.js'],
    transform: ['babelify'],
    debug: true,
    plugin: watchify,
  })
  .bundle()
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(uglify())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./dist/assets/js/'));
});


gulp.task('serve', () => {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: './dist/'
    }
  });
});



gulp.task('bs-reload', function (){
    browserSync.reload();
});


gulp.watch(["./dev/ejs/*.ejs", "./dev/ejs/**/*.ejs"], ['ejs']);
gulp.watch('./dev/scss/**/*.scss', ['scss']);
gulp.watch('./dev/js/**/*.js', ['js']);
gulp.watch('./dev/**', ['bs-reload']);


gulp.task('default', ['ejs', 'scss', 'js', 'serve']);


