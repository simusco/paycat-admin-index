const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('gulp-webpack');
const named = require('vinyl-named');
const uglifyjs = require('gulp-uglifyjs');
const rename = require('gulp-rename');
const usemin = require('gulp-usemin');
const livereload = require('gulp-livereload');
const webserver = require('gulp-webserver');

gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass({outputStyle:'compact'}).on('error',sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'IE 7'],
            cascade: false
        }))
        .pipe(gulp.dest('./css'))
        .pipe(livereload());
});

gulp.task('webpack',function () {
    return gulp.src('./js/admin/admin.js')
        .pipe(named())
        .pipe(webpack({
            watch:false,
            module: {
                loaders:[
                    {
                        test: /\.js$/,
                        loader: 'babel-loader',
                        exclude: /(node_modules|bower_components)/,
                        query:{presets: ['es2015'],plugins: ['transform-runtime']}
                    }
                ]
            }
        }))
        .pipe(gulp.dest('./js'))
        .pipe(livereload());
});

gulp.task('uglify:js', ['webpack'], function() {
    return gulp.src('./js/*.js')
        .pipe(uglifyjs({
            mangle: false
        }))
        .pipe(rename(function (path) {
            path.extname = '.min.js';
        }))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('copy:html',function () {
    return gulp.src('./views/**/*.html')
        .pipe(gulp.dest('./dist/views'));
});

gulp.task('copy:images',function () {
    return gulp.src('./images/**/*')
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('copy:css',function () {
    return gulp.src('./css/*.css')
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('usemin',function () {
    return gulp.src('./*.html')
        .pipe(usemin())
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['sass', 'uglify:js', 'copy:html', 'copy:images', 'copy:css', 'usemin']);

gulp.task('default',function () {
    gulp.src('./')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true,
            port: 9090
        }));

    gulp.watch('./sass/*.scss', ['sass']);
    gulp.watch('./js/admin/**/*.js', ['webpack']);
    gulp.watch(['./views/**/*','./images/**/*'], function (path) {
        livereload.changed(path);
    });
});