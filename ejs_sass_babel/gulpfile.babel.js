import gulp from 'gulp';
import plumber from 'gulp-plumber';
import ejs from 'gulp-ejs';
import htmlhint from 'gulp-htmlhint';
import pleeease from 'gulp-pleeease';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import browserify from 'browserify';
import babelify from 'babelify';
import watchify from 'watchify';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import bs from 'browser-sync';


const browserSync = bs.create();
const ejsPass = ["./dev/ejs/*.ejs", "./dev/ejs/**/*.ejs", "!"+"./dev/ejs/**/_*.ejs"];
const path = {
  dev: './dev/',
  dist: './dist/assets/',
}


gulp.task('ejs', () => {
  gulp.src(ejsPass)
    .pipe(plumber())
    .pipe(ejs('',{"ext": ".html"}))
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())
    .pipe(gulp.dest('./dist/'));
});


gulp.task('scss', () => {
  gulp.src(`${path.dev}scss/*.scss`)
    .pipe(sass())
    .pipe(pleeease({
      autoprefixer:true,
      minifier: true,
      mqpacker: true
    }))
    .pipe(gulp.dest(`${path.dist}css/`));
});


gulp.task('js', () => {
  browserify({
    entries: [`${path.dev}js/main.js`],
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
  .pipe(gulp.dest(`${path.dist}js/`));
});


// サーバー立ち上げ
gulp.task('serve', () => {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: './dist/'
    }
  });
});


// ブラウザリロード
gulp.task('bs-reload', () => {
    browserSync.reload();
});


// jsプラグイン圧縮用コマンド
gulp.task('js-concat', () => {
  gulp.src(`${path.dev}js/lib/**`)
    .pipe(plumber())
    .pipe(concat('lib.js'))
    .pipe(uglify('lib.js'))
    .pipe(gulp.dest(`${path.dist}js/`));
});


gulp.watch([`${path.dev}ejs/*.ejs`, `${path.dev}ejs/**/*.ejs`], ['ejs']);
gulp.watch(`${path.dev}scss/**/*.scss`, ['scss']);
gulp.watch(`${path.dev}js/**/*.js`, ['js']);
gulp.watch(`${path.dev}**`, ['bs-reload']);

gulp.task('default', ['ejs', 'scss', 'js', 'serve']);



