/*!
 * hashdog
 * https://github.com/logotype/hashdog.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
var gulp = require('gulp'),
    del = require('del'),
    $ = require('gulp-load-plugins')();

gulp.task('eslint', function () {
    return gulp.src(['./src/**/*.js'])
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failOnError());
});

gulp.task('build:library', function() {
    del(['build/**']);
    return gulp.src(['./src/**/*.js', '!./src/hashdog-cli.js'])
        .pipe($.babel())
        .pipe($.uglify())
        .pipe(gulp.dest('./build'));
});

gulp.task('build:cli', ['build:library'], function() {
    return gulp.src('./src/hashdog-cli.js')
        .pipe($.babel())
        .pipe($.chmod(755))
        .pipe(gulp.dest('./bin'));
});

gulp.task('test', ['build:cli'], function () {
    return gulp.src('./test/**/*.js', {read: false})
        .pipe($.mocha({
            recursive: true,
            compilers: require('babel-core/register'),
            reporter: 'spec'
        }));
});

gulp.task('perf', function () {
    return gulp.src(['./perf/**/*.js'])
        .pipe($.babel())
        .pipe($.uglify())
        .pipe(gulp.dest('./perfbuild'));
});

gulp.task('default', ['eslint', 'build:library', 'build:cli', 'test', 'perf']);