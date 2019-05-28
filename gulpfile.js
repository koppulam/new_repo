/* eslint-disable global-require */

const gulp = require('gulp');
const a11y = require('gulp-accessibility');
const fs = require('fs');
const path = require('path');
const convert = require('muban-convert-hbs').default;
const async = require('async');
const glob = require('glob');
const rename = require('gulp-rename');
// const concat = require('gulp-concat');
// const purge = require('gulp-css-purge');
// const cssnano = require('gulp-cssnano');
// const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const pixrem = require('gulp-pixrem');
const pxtorem = require('postcss-pxtorem');
const postcss = require('gulp-postcss');
const PROJECT_CONFIG = require('./project-config.js');

sass.compiler = require('node-sass');

gulp.task('sass', () => {
    return gulp.src(['./src/hbs-app/fe-components/components.scss'])
        // .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        // .pipe(cssnano())
        // .pipe(sourcemaps.write('.'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./www-root/css/'));
});

// gulp.task('cssOpt', function() {
//   return gulp
//         .src(['./www-root/css/bundle.*.css']) //input css
//         .pipe(concat('main.min.css')) //merge into single css file - remove if you want to process output into separate files
//         .pipe(purge({
//             trim : true,
//             shorten : true,
//             verbose : true
//         }))
//         .pipe(gulp.dest('./www-root/css/')) //output folder
// });

// gulp.task('fontSizeConversion', () => {
//     const processors = [
//         pxtorem({
//             rootValue: 10,
//             propList: ['font-size'],
//             replace: true,
//             mediaQuery: true
//         })
//     ];

//     gulp.src(['./www-root/css/bundle.globalHeader.css', './www-root/css/bundle.globalReactComponents.css'])
//         // To convert current rem values to px 1rem = 16px
//         .pipe(pixrem({
//             rootValue: '16px',
//             replace: true,
//             mediaQuery: true
//         }))
//         // To convert current px values to rem 1rem = 10px
//         .pipe(postcss(processors))
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest('./www-root/css/'));
// });

gulp.task('sass:watch', () => {
    gulp.watch(['./src/hbs-app/fe-components/**/*.scss', './src/vue-app/**/*.scss', './src/stylesheets/**/*.scss'], ['sass']);
});

gulp.task('ADA', () => {
    return gulp.src(`./${PROJECT_CONFIG.WEB_ROOT}/**/*.html`)
        .pipe(a11y({
            force: true
        }))
        .on('error', console.log)
        .pipe(a11y.report({ reportType: 'txt' }))
        .pipe(gulp.dest(`./${PROJECT_CONFIG.WEB_ROOT}/reports/txt`));
});

gulp.task('copyFiles', () => {
    return gulp.src([`./${PROJECT_CONFIG.WEB_ROOT}/**/*.*`, `!./${PROJECT_CONFIG.WEB_ROOT}/**/*.html`])
        .pipe(gulp.dest(`${PROJECT_CONFIG.AEM_SRC}`));
    // destination to be updated
});

gulp.task('copyChunkFiles', () => {
    return gulp.src([`./${PROJECT_CONFIG.WEB_ROOT}/js/bundle.*`])
        .pipe(gulp.dest(`${PROJECT_CONFIG.AEM_CHUNK_SRC}`));
    // destination to be updated
});

gulp.task('copyGlobalBundledJsFiles', () => {
    return gulp.src([`./${PROJECT_CONFIG.WEB_ROOT}/js/bundle.global*.*`])
        .pipe(gulp.dest(`${PROJECT_CONFIG.AEM_GLOBAL_SRC}`));
    // destination to be updated
});

gulp.task('copyGlobalBundledCssFiles', () => {
    return gulp.src([`./${PROJECT_CONFIG.WEB_ROOT}/css/bundle.global*.*`])
        .pipe(gulp.dest(`${PROJECT_CONFIG.AEM_GLOBAL_SRC}`));
    // destination to be updated
});

gulp.task('copyGlobalVendorJsFiles', () => {
    return gulp.src([`./${PROJECT_CONFIG.WEB_ROOT}/js/bundle.vendor*.*`])
        .pipe(gulp.dest(`${PROJECT_CONFIG.AEM_GLOBAL_SRC}`));
    // destination to be updated
});

gulp.task('copyGlobalVendorCssFiles', () => {
    return gulp.src([`./${PROJECT_CONFIG.WEB_ROOT}/css/bundle.vendor*.*`])
        .pipe(gulp.dest(`${PROJECT_CONFIG.AEM_GLOBAL_SRC}`));
    // destination to be updated
});

gulp.task('copyGlobalResourceFiles', () => {
    return gulp.src([`./${PROJECT_CONFIG.WEB_ROOT}/resources/**/*.*`, `!./${PROJECT_CONFIG.WEB_ROOT}/resources/images/*.*`])
        .pipe(gulp.dest(`${PROJECT_CONFIG.AEM_GLOBAL_SRC}/resources`));
    // destination to be updated
});

/**
 * Task:: htlConvert:
 *
 * Task to create a .htl file parallel to its corresponding .hbs file.
 * All hbs files under hbs-app folder will have a corresponding .htl file
 * after running this task
 *
 * TODO: Convert/Create these files on the fly when a developer modifies
 * 		 a hbs file.
 */
gulp.task('htlConvert', () => {
    glob(`./${PROJECT_CONFIG.HANDLEBARS_DIR}/**/*.hbs`, (err, files) => {
        if (err) {
            // If the `nonull` option is set, and nothing
            // was found, then files is ["**/*.js"]
            // err is an error object or null.
            console.error(err);
            console.error('Error in converting hbs to htl files!');
        }

        // files is an array of filepaths with .hbs extensions inder root directory provided.
        async.forEachOf(files, (filePath, index, callback) => {
            fs.writeFile(`${path.dirname(filePath)}/${path.parse(filePath).name}${PROJECT_CONFIG.REQUIRED_MARKUP_FORMAT}`,
                convert(fs.readFileSync(filePath, 'utf-8'), PROJECT_CONFIG.REQUIRED_MARKUP_FORMAT.substring(1)),
                (err) => {
                    if (err) {
                        console.error(`Error while writing to ${path.parse(filePath).name}${PROJECT_CONFIG.REQUIRED_MARKUP_FORMAT}`);
                        callback(err);
                    } else {
                        callback();
                    }
                });
        }, err => {
            if (err) {
                console.error(err.message);
            } else {
                console.info('==============================================================');
                console.info('\tAll hbs files have a corresponding htl file');
                console.info('==============================================================');
            }
        });
    });
});

gulp.task('default', ['ADA']);
