import gulp from 'gulp';
import plumber from 'gulp-plumber';
import ejs from 'gulp-ejs'
import pleeease from 'gulp-pleeease';
import sass from 'gulp-sass';

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
})


gulp.task('watch', () => {
  gulp.watch(["./dev/ejs/*.ejs", "./dev/ejs/**/*.ejs"], ['ejs']);
  gulp.watch('./dev/scss/**/*.scss', ['scss']);
});

gulp.task('default', ['ejs', 'scss', 'watch']);


