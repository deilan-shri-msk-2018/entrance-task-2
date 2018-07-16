"use strict";

var gulp = require("gulp");
var uglify = require("gulp-uglify");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");
var run = require("run-sequence");
var del = require("del");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");

gulp.task("style", function () {
  gulp.src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: [
          "last 2 versions"
        ]
      }),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("scripts:app", function () {
  return gulp.src("src/js/index.js")
    .pipe(gulp.dest("build/js"))
    .pipe(uglify())
    .pipe(rename("index.min.js"))
    .pipe(gulp.dest("build/js"));
});

gulp.task("scripts:vendor", function () {
  return gulp.src("node_modules/picturefill/dist/picturefill.min.js")
    .pipe(gulp.dest("build/js"));
});

gulp.task("images", function () {
  return gulp.src("build/img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      })
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("symbols", function () {
  return gulp.src("src/img/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("serve", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("src/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("src/*.html", ["html:update"]);
  gulp.watch("src/js/**/*.js", ["scripts:update"]);
  gulp.watch("src/img/*.svg", ["symbols:update"]);
});

gulp.task("html", function () {
  return gulp.src("src/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("normalize", function () {
  return gulp.src("node_modules/normalize.css/normalize.css")
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("normalize.min.css"))
    .pipe(gulp.dest("build/css"))
});

gulp.task("html:update", ["html"], function (done) {
  server.reload();
  done();
});

gulp.task("scripts:update", ["scripts:app"], function (done) {
  server.reload();
  done();
});

gulp.task("symbols:update", function (done) {
  run("symbols", "html", function() {
    server.reload();
    done();
  });
});

gulp.task("copy", function () {
  return gulp.src([
      "src/fonts/**/*.{woff,woff2}",
      "src/img/**.{jpg,png}",
      "src/js/**",
      "src/*.html"
    ], {
      base: "./src"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("build", function (done) {
  run(
    "clean",
    "copy",
    "normalize",
    "style",
    "scripts:vendor",
    "scripts:app",
    "images",
    "symbols",
    "html",
    done);
});