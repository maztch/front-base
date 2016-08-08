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
    //cleancss = require('gulp-clean-css'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    twig = require('gulp-twig'),
    foreach = require('gulp-foreach'),
    browserSync = require('browser-sync').create();


var sassFiles = {
  input: true,
  output: 'expanded'
};

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};


gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist/'
        }
    });
});

gulp.task('bs-reload', function () {
   browserSync.reload();  
});

/* SCSS */
gulp.task('sass', function () {
  return gulp.src(['src/scss/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    //.pipe(sourcemaps.write('./dist/css/maps'))
    .pipe(gulp.dest('dist/css/'))
    .pipe(autoprefixer(autoprefixerOptions));
    //.pipe(browserSync.reload({stream:true}));
});

gulp.task('sass-watch',['sass'],browserSync.reload);

/* Twig Templates */
function getJsonData (file, cb) {
    glob("src/data/*.json", {}, function(err, files) {
        var data = {};
        if (files.length) {
            files.forEach(function(fPath){
                var baseName = path.basename(fPath, '.json');
                data[baseName] = JSON.parse(fs.readFileSync(fPath));
            });
        }
        cb(undefined, data);
    });

}
gulp.task('twig',function(){
    return gulp.src('src/templates/urls/**/*')
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(data(getJsonData))
        .pipe(foreach(function(stream,file){
            return stream
                .pipe(twig());
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('twig-watch',['twig'],browserSync.reload);


/* Scripts */
gulp.task('scripts', function(){
  return gulp.src(['src/js/libs/*.js','src/js/*.js'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('scripts-watch',['scripts'],browserSync.reload);


/* Build */
gulp.task('build',['sass','scripts','twig']);

gulp.task('serve',['build','browser-sync'],function(){
    gulp.watch("src/scss/**/*.scss", ['sass-watch']);
    gulp.watch("src/js/**/*.js", ['scripts-watch']);
    gulp.watch(['src/templates/**/*','src/data/*.json'],['twig-watch']);
});
