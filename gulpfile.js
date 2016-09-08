// Requires
var gulp = require('gulp'),
    fs = require('fs'),
    glob = require('glob'),
    path = require('path'),
    data = require('gulp-data'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer')
    twig = require('gulp-twig'),
    foreach = require('gulp-foreach'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create();


var sassFiles = {
    input: [
        'src/scss/**/*.scss'
    ],
    output: 'dist/css/'
};

var sassPaths = [
    //require("bourbon").includePaths
];

console.log(sassPaths);

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

function swallowError(error) {
    console.log(error.toString());
    this.emit('end');
}

/* SCSS */
gulp.task('sass', function() {
    return gulp.src(sassFiles.input)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', swallowError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(sassFiles.output))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

//gulp.task('sass-watch',['sass'],browserSync.reload);
gulp.task('sass-watch', ['sass']);


/* images */
gulp.task('images', function() {
    gulp.src('src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});


/* Twig Templates */
function getJsonData(file, cb) {
    glob("src/data/*.json", {}, function(err, files) {
        var data = {};
        if (files.length) {
            files.forEach(function(fPath) {
                var baseName = path.basename(fPath, '.json');
                data[baseName] = JSON.parse(fs.readFileSync(fPath));
            });
        }
        cb(undefined, data);
    });

}

gulp.task('twig', function() {
    return gulp.src('src/templates/pages/**/*')
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(data(getJsonData))
        .pipe(foreach(function(stream, file) {
            return stream
                .pipe(twig());
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('twig-watch', ['twig'], browserSync.reload);


/* Scripts */
gulp.task('scripts', function() {
    return gulp.src(['src/js/libs/*.js', 'src/js/*.js'])
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('scripts-watch', ['scripts'], browserSync.reload);


/* Build */
gulp.task('build', ['scripts', 'twig', 'images', 'sass']);

gulp.task('serve', ['build'], function() {

    browserSync.init({
        server: './dist'
    });

    gulp.watch("src/scss/**/*.scss", ['sass-watch']);
    gulp.watch("src/js/**/*.js", ['scripts-watch']);
    gulp.watch(['src/templates/**/*', 'src/data/*.json'], ['twig-watch']);

    gulp.watch("dist/**/*.html").on('change', browserSync.reload);
});
