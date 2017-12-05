var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es').default;
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var order = require("gulp-order");
// var webserver = require('gulp-webserver');

gulp.task('lib', function () {
    return gulp.src([
        'bower_components/three.min.js/index.js',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/tween.js/index.js',
        'bower_components/physi.js/index.js',
        'bower_components/three.js-examples/examples/js/controls/OrbitControls.js'
    ])
        .pipe(concat('lib.js'))
        .pipe(uglify())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {

    return gulp.src('js/*.js')
        .pipe(order([
            'js/recorder.js',
            'js/Report.js',
            'js/Autoplay.js',
            'js/data.js',
            'js/Loader.js',
            'js/ui.js',
            'js/Fruit.js',
            'js/Text.js',
            'js/Key.js',
            'js/CameraController.js',
            'js/Audio.js',
            'js/WebAudio.js',
            'js/BufferLoader.js',
            'js/Cloud.js',
            'js/main.js'
        ]))
        .pipe(concat('bundle.js'))
        // .pipe(uglify())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
    return gulp.src(['scss/style.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('style.css'))
        .pipe(gulp.dest('css'));
})

gulp.task('watch', function() {
    gulp.watch('js/**', ['js']);
    gulp.watch('scss/**', ['css']);
});

// gulp.task('serve', function () {
//     gulp.src('app')
//         .pipe(webserver({
//             livereload: true,
//             fallback: 'index.html'
//         }));
// });