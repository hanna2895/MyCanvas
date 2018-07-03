const gulp = require('gulp');
const less = require('gulp-less');
const browserSync = require('browser-sync').create();

gulp.task('less', function(){
  return gulp.src('public/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('public/css'))
    // .pipe(browserSync.reload({
    //   stream: true
    // }))
})

// gulp.task('browserSync', function(){
//   browserSync.init(null,{
//     proxy: 'http://localhost:3000',
//   })
// })

gulp.task('watch', ['less'], function(){ // browserSync needs to go in the square brackets here if I put it back in
  gulp.watch('public/less/*.less', ['less']);
  gulp.watch('views/**/*.ejs').on('change', browserSync.reload);
})
