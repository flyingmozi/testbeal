const fs = require('fs');
const gulp = require('gulp');
const server = require('gulp-webserver');
const connect = require('gulp-connect');
const proxy = require('http-proxy-middleware');
const watch = require('gulp-watch');
const mini = require('gulp-clean-css');
const script = require('gulp-uglify');


//压缩css
gulp.task('minicss',()=>{
    gulp.src('./src/css/*.css')
    .pipe(mini())
    .pipe(gulp.dest('./dist/css'))
})
//压缩js

gulp.task('minijs',()=>{
    gulp.src('./src/js/*.js')
    .pipe(script())
    .pipe(gulp.dest('./dist/js'))
})

//服务开启

gulp.task('myserver',()=>{
    gulp.src('.')
    .pipe(server({
        host:'localhost',
        port:3000,
        livereload:true,
        middleware:(req,res)=>{
            if(req.url === '/api'){
                res.writeHead(200,{
                    'content-type':'text/plain;charset:utf8',
                    'access-control-allow-origin':'*',
                })
                res.end(fs.readFileSync('./src/data/data.json').toString())
            }
        }
    }))
})

gulp.task('newserver',()=>{
    connect.server({
        root:['.'],
        name:"list",
        port:8000,
        livereload:true,
        fallback:'./src/index.html',
        middleware:(app)=>{
            return [proxy('/api',{
                target:"http://localhost/3000",
                changeOrigin:true,
            })]
        }
    })
})

gulp.task('watch',()=>{
    gulp.watch('./src/css/index.css',['minicss'])
})

gulp.task('default',['minicss','minijs','myserver','newserver','watch'])