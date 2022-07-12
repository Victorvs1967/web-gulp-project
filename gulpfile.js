import gulp from 'gulp'; // main gulp functions
import gulpSass from 'gulp-sass'; // sass preprocessor for gulp
import dartSass from 'sass'; // core sass preprocessor
import babel from 'gulp-babel'; // babel preprocessor
import concat from 'gulp-concat'; // concatenate files
import uglify from 'gulp-uglify'; // optimise js files
import rename from 'gulp-rename'; // rename files with options
import cleanCSS from 'gulp-clean-css'; // remove trash from css files
import autoprefixer from 'gulp-autoprefixer'; // add support old browsers
import imagemin from 'gulp-imagemin'; // compress images
import del from 'del'; // delete files

// directories structure
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

// for styles 
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

// for scripts
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