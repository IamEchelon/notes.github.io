const gulp = require('gulp');
const clean = require('gulp-clean')
const elm = require('gulp-elm');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const image = require('gulp-image');
const audiocontext = require('startaudiocontext');


// Main Tasks


gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
});

gulp.task('clean', () => {
    return gulp.src('dist', { read: false })
        .pipe(clean())

});

gulp.task('image', () => {
    gulp.src('src/images/*')
        .pipe(image({
            svgo: false
        }))
        .on('error', notify.onError((error) => {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(plumber())
        .pipe(gulp.dest('dist/images'));
});


gulp.task('elm-init', elm.init);

gulp.task('elm', ['elm-init'], () => {
    return gulp.src('src/elm/*.elm')
        .pipe(elm.bundle('notes.js', {
            debug: true
        }))
        .on('error', notify.onError((error) => {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(plumber())
        .pipe(gulp.dest('dist/js/'))
        .pipe(browserSync.stream());
});

gulp.task('babel', () => {
    return gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .on('error', notify.onError((error) => {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream());
});


gulp.task('stylus', () => {
    return gulp.src('src/**/*.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true
        }))
        .on('error', notify.onError((error) => {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(plumber())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('html', function () {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});


// WATCH


gulp.task('watch', () => {
    gulp.watch('src/**/*.elm', ['elm']);
    gulp.watch('src/**/*.js', ['babel']);
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/**/*.styl', ['stylus']);
});


// DEFAULT


gulp.task('default', ['image', 'stylus', 'elm', 'babel', 'html', 'watch', 'browser-sync']);