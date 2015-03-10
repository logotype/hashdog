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
    del = require('del'),
    chmod = require('gulp-chmod'),
    rename = require("gulp-rename");

gulp.task('jshint', function () {
    return gulp.src('./src/**/*.js')
        .pipe(jshint({'esnext': true}))
        .pipe(jshint.reporter('default'));
});

gulp.task('clean:build', function (cb) {
    return del(['build/**'], cb);
});
gulp.task('clean:cli', ['cli'], function (cb) {
    return del(['build/hashdog-cli.js'], cb);
});

gulp.task('copy:data', ['clean:build'], function() {
    return gulp.src( [ './src/data/**/*' ], { "base" : "./src" })
        .pipe(gulp.dest('./build'));
});

gulp.task('babel', ['clean:build'], function() {
    return gulp.src(['./src/**/*.js'])
        .pipe(babel())
        .pipe(gulp.dest('./build'));
});

gulp.task('cli', ['babel'], function() {

    return gulp.src('./build/hashdog-cli.js')
        .pipe(rename('hashdog-cli'))
        .pipe(chmod(755))
        .pipe(gulp.dest('./build'));
});

gulp.task('default', ['jshint', 'clean:build', 'copy:data', 'babel', 'cli', 'clean:cli']);