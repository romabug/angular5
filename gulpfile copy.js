//珍贵 https://segmentfault.com/q/1010000004234745?_ea=556298


//0rr   equire      
var gulp = require('gulp');
//sass  http://jingyan.baidu.com/album/14bd256e7f7d7fbb6d2612c4.html
var sass = require('gulp-sass');

var browserSync = require('browser-sync').create();

gulp.task('default',['watchme'], function() {
    // 将你的默认的任务代码放在这
    console.log('[    OKAY START    ]');

    // 以下配置参考   browserSync http://jingyan.baidu.com/article/c33e3f48f60620ea15cbb5f9.html
    //11 launch server, and browser sync
    browserSync.init({
        server: "./src"
    });

    //22 watch if change call browser reload
    gulp.watch("src/**/*.html").on("change", function(){
      browserSync.reload();
      console.log('--> browserSync');
     


    });

 

// browserSync.reload

});



(function() {  

 

})();



gulp.task('sass', function() {

   console.log('------> do sass');

   return gulp.src('src/css/*.scss')  //获取所需文件
   .pipe(sass())                      //调用scss模块
   .pipe( gulp.dest('src/css'));       //生成css 文件 


});






gulp.task('watchme', function() {
    // 将你的默认的任务代码放在这

    gulp.watch('src/**/*.*', function(event) {
        console.log('Watch<@@> File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
 
});