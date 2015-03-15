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
    rename = require("gulp-rename"),
    mocha = require('gulp-mocha'),
    $ = require('gulp-load-plugins')();

gulp.task('jshint', function () {
    return gulp.src('./src/**/*.js')
        .pipe($.jshint({'esnext': true}))
        .pipe($.jshint.reporter('default'));
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

gulp.task('transpile', ['clean:build'], function() {
    return gulp.src(['./src/**/*.js'])
        .pipe($.babel())
        .pipe(gulp.dest('./build'));
});

gulp.task('cli', ['transpile'], function() {
    return gulp.src('./build/hashdog-cli.js')
        .pipe(rename('hashdog-cli'))
        .pipe(chmod(755))
        .pipe(gulp.dest('./build'));
});

gulp.task('test', ['clean:cli'], function () {
    return gulp.src('./test/**/*.js', {read: false})
        .pipe($.mocha({
            recursive: true,
            compilers: require('babel/register'),
            reporter: 'spec'
        }));
});

gulp.task('perf', function () {
    return gulp.src(['./perf/**/*.js'])
        .pipe($.babel())
        .pipe(gulp.dest('./perfbuild'));
});

gulp.task('default', ['jshint', 'clean:build', 'copy:data', 'transpile', 'cli', 'clean:cli', 'test']);