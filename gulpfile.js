import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import del from 'del';
import autoprefixer from 'gulp-autoprefixer';
import imagemin from 'gulp-imagemin';

const paths =  {
  styles: {
    src: 'src/styles/**/*.sass',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/images/**/*.{jpg,jpeg,png}',
    dest: 'dist/img'
  }
};

const sass = gulpSass(dartSass);

export const styles = () => gulp.src(paths.styles.src)
  .pipe(sass({ outputStyle: 'compressed' }))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 4 version']
  }))
  .pipe(cleanCSS())
  .pipe(rename({
    basename: 'main',
    suffix: '.min'
  }))
  .pipe(gulp.dest(paths.styles.dest));

export const scripts = () => gulp.src(paths.scripts.src)
  .pipe(babel())
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(gulp.dest(paths.scripts.dest));

export const images = () => gulp.src(paths.images.src)
  .pipe(imagemin({ optimizationLevel: 5}))
  .pipe(gulp.dest(paths.images.dest));

export const watch = () => {
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
};

export const clean = async () => await del(['dist']);

const build = gulp.series(clean, gulp.parallel(images, styles, scripts));

export default build;