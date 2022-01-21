const {src, dest, watch, series, parallel} = require("gulp");
const prompts = require("prompts");
const notify = require("gulp-notify");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const fs = require("fs");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const del = require("del");
const yargs = require("yargs/yargs");
const {hideBin} = require("yargs/helpers");
const args = yargs(hideBin(process.argv)).argv;

const themeName = args.env ? args.env : 'material_base';
const themePath = `web/themes/${themeName}`;

const paths = {
  assets: `${themePath}/public/assets`,
  css: `${themePath}/public/css`,
  js: `${themePath}/public/js`,
  mainJs: `${themePath}/js/base.js`,
  nodeModules: "./node_modules",
  styles: `${themePath}/scss/**/*`,
  scripts: `${themePath}/js/**/*`
};

async function nodeModulesToAssets() {
  const npmAssets = [
    "node_modules/@fortawesome/fontawesome-pro/**/css/*",
    "node_modules/@fortawesome/fontawesome-pro/**/webfonts/*",
  ];
  await del(paths.assets + "/**");
  return src(npmAssets, {base: "node_modules"})
    .pipe(dest(paths.assets))
    .pipe(
      notify({
        title: "Copy",
        message: "<%= file.relative %> to " + paths.assets
      })
    );
}

function mainJsTask() {
  return src(paths.mainJs)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.js));
}

function componentJsTask() {
  return src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.js));
}


async function themeTask(done) {
  const {theme} = await prompts({
    type: "text",
    name: "theme",
    message: "Enter theme name:"
  });

  const newPath = "web/themes/" + theme;

  await fs.readFile("composer.json", "utf8", async function (err, data) {
    if (err) {
      return console.log(err);
    }
    const result = data.replace(/project_name/g, theme);
    await fs.writeFile("composer.json", result, "utf8", function (err) {
      if (err) {
        return console.log(err);
      }
    });
  });

  done();
}

function watchJsTask() {
  watch([paths.scripts], mainJsTask);
}

exports.assets = nodeModulesToAssets;
exports.watch = parallel(watchJsTask);
exports.theme = themeTask;
exports.default = series(
  nodeModulesToAssets,
  mainJsTask,
  componentJsTask,
);
