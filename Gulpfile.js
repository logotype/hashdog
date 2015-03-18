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

gulp.task('build:library', function() {
    del(['build/**']);
    return gulp.src(['./src/**/*.js', '!./src/hashdog-cli.js'])
        .pipe($.jshint({'esnext': true}))
        .pipe($.jshint.reporter('default'))
        .pipe($.babel())
        .pipe(gulp.dest('./build'));
});

gulp.task('build:cli', ['build:library'], function() {
    return gulp.src('./src/hashdog-cli.js')
        .pipe($.jshint({'esnext': true}))
        .pipe($.jshint.reporter('default'))
        .pipe($.babel())
        .pipe(chmod(755))
        .pipe(gulp.dest('./bin'));
});

gulp.task('test', ['build:cli'], function () {
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

gulp.task('default', ['build:library', 'build:cli', 'test']);