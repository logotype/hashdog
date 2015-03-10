/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    babel = require('gulp-babel'),
    del = require('del');

gulp.task('clean:build', function (cb) {
    del(['build/**'], cb);
});

gulp.task('copy:data', ['clean:build'], function() {
    gulp.src( [ './src/data/**/*' ], { "base" : "./src" })
        .pipe(gulp.dest('./build'));
});

gulp.task('jshint', function () {
    return gulp.src('./src/**/*.js')
        .pipe(jshint({'esnext': true}))
        .pipe(jshint.reporter('default'));
});

gulp.task('babel', ['clean:build'], function() {
    gulp.src(['./src/**/*.js'])
        .pipe(babel())
        .pipe(gulp.dest('./build'));
});

gulp.task('default', ['jshint', 'clean:build', 'copy:data', 'babel']);