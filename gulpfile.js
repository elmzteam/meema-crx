var gulp    = require('gulp'),
    sass    = require('gulp-ruby-sass');

gulp.task('sass', function(){
    gulp.src('./scss/app.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./css/'));
});

gulp.task('watch', function(){
    gulp.watch('./scss/**/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'watch']);