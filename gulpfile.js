//详细gulp  教程 http://www.cnblogs.com/2050/p/4198792.html
//https://segmentfault.com/q/1010000004234745?_ea=556298
//多插件 https://github.com/hxbo/gulp-project-template/blob/master/gulpfile.js
//引入gulp及各种组件;   

var gulp = require('gulp'),
    uglify = require('gulp-uglify'), //js 文件压缩
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    del = require('del'),
    fileinclude = require('gulp-file-include'),
    contentIncluder = require('gulp-content-includer'),
    rename = require('gulp-rename'),
    //压缩html   minifyHtml = require("gulp-minify-html");
    //JS代码检查  jshint = require("gulp-jshint");
    //文件合并    concat = require("gulp-concat");
    //图片压缩    imagemin = require('gulp-imagemin'),



    //   imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    //   imageminOptipng = require('imagemin-optipng'),
    browserSync = require('browser-sync').create();

////
//设置各种输入输出文件夹的位置;

var srcScript = ['./src/js/*.js',
        './bower_components/jquery/dist/jquery.min.js'
    ],

    dstScript = './dist/js',

    srcCss = './src/css/*.css',

    dstCSS = './dist/css',

    //  srcSass = './src/sass/assets/stylesheets/bootstrap/*.scss',
    srcSass = [
    // './src/sass/*.scss','./src/sass/**/*.scss',
     './src/css/main.scss' 
    ],

    dstSass = './dist/css',

    srcImage = './src/img/**/*.*',

    dstImage = './dist/img',

    srcHtml = './src/*.html',

    dstHtml = './dist';


//处理JS文件:压缩,然后换个名输出;

//命令行使用gulp script启用此任务;

  gulp.task('script', function() {

 return   gulp.src(srcScript)
     //   .pipe(concat('all.js'))
        //  .pipe(uglify()) js打乱
        .pipe(gulp.dest(dstScript));
    //合并后的文件名
 
});


//处理CSS文件:压缩,然后换个名输出;

//命令行使用gulp css启用此任务;

gulp.task('css', function() {

  return  gulp.src(srcCss)

    .pipe(minifyCSS())

    .pipe(gulp.dest(dstCSS));

});


//SASS文件输出CSS,天生自带压缩特效;

//命令行使用gulp sass启用此任务;

gulp.task('sass', function() {

    gulp.src(srcSass)

    .pipe(sass({
        //  outputStyle: 'compressed'
    }))

    .pipe(gulp.dest(dstSass));

});


//图片压缩任务,支持JPEG、PNG及GIF文件;

//命令行使用gulp jpgmin启用此任务;

gulp.task('imgmin', function() {

    var jpgmin = imageminJpegRecompress({

            accurate: true, //高精度模式

            quality: "high", //图像质量:low, medium, high and veryhigh;

            method: "smallfry", //网格优化:mpe, ssim, ms-ssim and smallfry;

            min: 70, //最低质量

            loops: 0, //循环尝试次数, 默认为6;

            progressive: false, //基线优化

            subsample: "default" //子采样:default, disable;

        }),

        pngmin = imageminOptipng({

            optimizationLevel: 4

        });

    gulp.src(srcImage)

    .pipe(imagemin({

        use: [jpgmin, pngmin]

    }))

    .pipe(gulp.dest(dstImage));

});


//把所有html页面扔进dist文件夹(不作处理);

//命令行使用gulp html启用此任务;

gulp.task('html', function() {

    return gulp.src('./src/home.html')
        .pipe(contentIncluder({
            includerReg: /<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(dstHtml));
 
    // return gulp.src(srcHtml)
    //       .pipe(gulp.dest('dstHtml'));


});



gulp.task('htmltpl', function() {

    return gulp.src('./src/html-tpl/*.html')
      
        .pipe(gulp.dest('./dist/html-tpl/'));
 
 
});







//服务器任务:以dist文件夹为基础,启动服务器;

//命令行使用gulp server启用此任务;

gulp.task('server', function() {

    browserSync.init({

        server: "./dist"

    });

});



gulp.task('testConcat', function() {
    gulp.src(srcScript)
        .pipe(concat('all.js')) //合并后的文件名
        .pipe(gulp.dest('dist/js'));



});




// gulp.src(srcHtml)
//     .pipe(concat('index.html')) //合并后的文件名
//     .pipe(gulp.dest('dist/'));



//监控改动并自动刷新任务;

//命令行使用gulp auto启动;

gulp.task('auto', function() {

    gulp.watch(srcScript, ['script']);

    gulp.watch(srcCss, ['css']);

    gulp.watch(['./src/css/*.scss',
        './src/sass/*.scss',
        './src/sass/**/*.scss'], ['sass']);

    //   gulp.watch(srcImage, ['imgmin']);

    gulp.watch(srcHtml, ['html']);
    gulp.watch('./src/html-tpl/*.html', ['htmltpl']);


    gulp.watch('./src/**/*.*', function(event) {
        console.log('->>' + event.path + ' --> ' + event.type + ', run tasks...');
    });

    // 同下面 gulp.watch('./src/**/*.*').on('change', browserSync.reload);
    gulp.watch('./src/**/*.*', function() {

        setTimeout(function() {
            browserSync.reload();
        }, 500);

    });

    // src 目录 另外写法
    // gulp.watch(
    //   [
    //     'src/scss/**/*.scss',
    //     '!src/scss/**/__*.scss',
    //     '!src/scss/login/**/*.scss'
    //   ], ['build:scss'] );

});


gulp.task('clean', function() {
    //or  del('dist/**/');
    return del.sync('dist/**/');
    console.log('i am cleaning.........')
});



//    srcImage = './src/img/*.*',
 //   dstImage = './dist/img',

gulp.task("copyimage", function() {

  gulp.src(srcImage)
  .pipe( gulp.dest(dstImage));

});





//gulp默认任务(集体走一遍,然后开监控);

gulp.task('default', ['clean'], function() {
    console.log('@@------------> game start------------>');


    setTimeout(function() {
        gulp.start('script', 'sass', 'css', 'copyimage', 'html','htmltpl', 'server', 'auto');
    }, 2000);




});