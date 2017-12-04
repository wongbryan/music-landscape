var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es').default;
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var less = require('gulp-less');
// var webserver = require('gulp-webserver');

gulp.task('lib', function () {
    return gulp.src([
        'lib/tween.js/src/Tween.js',
        'bower_components/three.js/three.js',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/three.js/examples/js/modifiers/BufferSubdivisionModifier.js',
        'bower_components/three.js-examples/examples/js/controls/OrbitControls.js',
        'lib/Physijs/physi.js'
    ])
        .pipe(concat('lib.js'))
        .pipe(uglify())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
    return gulp.src([
        'js/data.js',
        'js/Loader.js',
        'js/Report.js',
        'js/ui.js',
        'js/Fruit.js',
        'js/Text.js',
        'js/Key.js',
        'js/CameraController.js',
        'js/Audio.js',
        'js/WebAudio.js',
        'js/BufferLoader.js',
        'js/Autoplay.js',
        'js/Cloud.js',
        'js/main.js',
    ])
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
    return gulp.src(['less/style.less'])
        .pipe(less())
        .pipe(rename('style.css'))
        .pipe(gulp.dest('css'));
})

gulp.task('watch', function() {
    gulp.watch('js/**', ['js']);
    gulp.watch('less/**', ['css']);
});

// gulp.task('serve', function () {
//     gulp.src('app')
//         .pipe(webserver({
//             livereload: true,
//             fallback: 'index.html'
//         }));
// });