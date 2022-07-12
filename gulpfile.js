import gulp from 'gulp'; // main gulp functions
import gulpSass from 'gulp-sass'; // sass preprocessor for gulp
import dartSass from 'sass'; // core sass preprocessor
import babel from 'gulp-babel'; // babel preprocessor
import concat from 'gulp-concat'; // concatenate files
import uglify from 'gulp-uglify'; // optimise js files
import rename from 'gulp-rename'; // rename files with options
import cleanCSS from 'gulp-clean-css'; // remove trash from css files
import autoprefixer from 'gulp-autoprefixer'; // add prefixes to support old browsers
import imagemin from 'gulp-imagemin'; // compress images
import del from 'del'; // delete files
import sourcemaps from 'gulp-sourcemaps'; // view source files
import htmlmin from 'gulp-htmlmin'; // optimise html files
import size from 'gulp-size'; // view files size
import newer from 'gulp-newer'; // watch for newer files
import browserSync from 'browser-sync'; // realtime html server
import pug from 'gulp-pug'; // pug preprocessor

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
  },
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  },
  pug: {
    src: 'src/*.pug',
    dest: 'src/'
  }
};

// Static Server
const browser_sync = () => {
  browserSync.init({
    server: {
      baseDir: "dist/"
    }
  });
};

const views = () => gulp.src(paths.pug.src)
  .pipe(pug({
    doctype: 'html',
    pretty: true,
  }))
  .pipe(size({
    showFiles: true
  }))
  .pipe(gulp.dest(paths.pug.dest));

// for styles 
const sass = gulpSass(dartSass);

export const styles = () => gulp.src(paths.styles.src)
  .pipe(sourcemaps.init())
  .pipe(sass({ outputStyle: 'compressed' }))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 4 version']
  }))
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(rename({
    basename: 'main',
    suffix: '.min'
  }))
  .pipe(sourcemaps.write('./'))
  .pipe(size({
    showFiles: true
  }))
  .pipe(gulp.dest(paths.styles.dest))
  .pipe(browserSync.stream());


// for scripts
export const scripts = () => gulp.src(paths.scripts.src)
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(sourcemaps.write('./'))
  .pipe(size({
    showFiles: true
  }))
  .pipe(gulp.dest(paths.scripts.dest))
  .pipe(browserSync.stream());

export const images = () => gulp.src(paths.images.src)
  .pipe(newer(paths.images.dest))
  .pipe(imagemin({
    progressive: true,
    optimizationLevel: 5
  }))
  .pipe(size({
    showFiles: true
  }))
  .pipe(gulp.dest(paths.images.dest))
  .pipe(browserSync.stream());

export const html = () => gulp.src(paths.html.src)
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(size({
    showFiles: true
  }))
  .pipe(gulp.dest(paths.html.dest))
  .pipe(browserSync.stream());

export const watch = () => {
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.pug.src, views);
  gulp.watch(paths.html.src, html);
  browser_sync();
};

export const clean = async () => await del(['dist/**', '!dist/img']);
export const build = gulp.series(clean, views, html, gulp.parallel(images, styles, scripts), watch);

export default build;