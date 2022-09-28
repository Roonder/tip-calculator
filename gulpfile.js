const { src, dest, watch, parallel } = require("gulp"); // src identificar, dest guardar
// CSS
const sass = require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
//Javascript
const terser = require('gulp-terser-js');

function css (done) {
    src('src/scss/**/*.scss') // Identificar el archivo SASS
        .pipe(sourcemaps.init()) // Inicializa el sourcemap para guardar las referencias
        .pipe(plumber()) // Previene el detenimiento del workflow
        .pipe(sass()) // Compilar SASS
        .pipe(postcss([autoprefixer(), cssnano()])) // Comprime y mejora el rendimiento de nuestro CSS
        .pipe(sourcemaps.write('.')) // Almacena el map y con el punto lo guardamos en el mismo lugar
        .pipe(dest('build/css')); // Almacenar CSS
    done();
}
function js(done) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser()) // Minificar el codigo de JS
        .pipe(sourcemaps.write('.')) // Guarda el mapa de datos
        .pipe(dest('build/js'));
    done();
}

function dev (done) {
    watch("src/scss/**/*.scss", css);
    watch("src/js/**/*.js", js);

    done();
}

exports.css = css;
exports.js = js;
exports.dev = parallel(js, dev);