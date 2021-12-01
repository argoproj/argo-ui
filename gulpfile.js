const gulp = require('gulp');
const less = require('gulp-less');
const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({browsers: ['last 2 versions']});
const minifyCSS = require('gulp-minify-css');
const rename = require("gulp-rename");

const config = {
    less: {
        input: './antd/styles/antd.less',
        output: './antd/build/css'
    }
};

function compileLess() {
    return gulp.src(config.less.input)
        .pipe(less({
            javascriptEnabled: true,
            plugins: [autoprefix]
        }))
        .pipe(minifyCSS())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest(config.less.output));
}

exports.compileLess = compileLess;
