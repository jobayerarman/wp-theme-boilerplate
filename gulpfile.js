/**
 * Gulpfile.
 *
 * Gulp with WordPress.
 *
 * Implements:
 *      1. Live reloads browser with BrowserSync.
 *      2. CSS: Less to CSS conversion, error catching, Autoprefixing,
 *         CSS minification.
 *      3. JS: Concatenates & uglifies Custom JS files.
 *      4. Images: Minifies PNG, JPEG, GIF and SVG images.
 *      5. Watches files for changes in CSS or JS.
 *      6. Watches files for changes in PHP.
 *      7. InjectCSS instead of browser page reload.
 *      8. Generates .pot file for i18n and l10n.
 *
 * @author Ahmad Awais (@ahmadawais)
 * @author Jobayer Arman (@jobayerarman)
 * @version 1.0.3
 */

/**
 * Configuration.
 *
 * Project Configuration for gulp tasks.
 *
 * In paths you can add <<glob or array of globs>>. Edit the variables as per your project requirements.
 */

// START Editing Project Variables.
// Project related.
var project              = 'WPThemeBoilerplate';                      // Project Name.
var projectURL           = 'http://localhost/wp-theme-boilerplate';  // Project URL. Could be something like localhost:8888.
var productURL           = './';                                      // Theme/Plugin URL. Leave it like it is, since our gulpfile.js lives in the root folder.

// Translation related.
var text_domain          = 'wp-theme-boilerplate';                    // Your textdomain here.
var destFile             = 'wp-theme-boilerplate.pot';                // Name of the transalation file.
var packageName          = 'wp-theme-boilerplate';                    // Package name.
var bugReport            = 'http:// jobayerarman.github.io/';         // Where can users report bugs.
var lastTranslator       = 'Jobayer Arman <carbonjha@gmail.com>';     // Last translator Email ID.
var team                 = 'Jobayer Arman <carbonjha@email.com>';     // Team's Email ID.
var translatePath        = './languages'                              // Where to save the translation files.

// Style related.
var styleSRC             = './assets/src/less/main.less';             // Path to main .less file.
var styleDestination     = './assets/css/';                           // Path to place the compiled CSS file.

// JS Custom related.
var scriptSRC            = './assets/src/js/*.js';                    // Path to JS custom scripts folder.
var scriptDestination    = './assets/js/';                            // Path to place the compiled JS custom scripts file.
var scriptFile           = 'script';                                  // Compiled JS custom file name.

// Images related.
var imagesSRC            = './assets/src/img/**/*.{png,jpg,gif,svg}'; // Source folder of images which should be optimized.
var imagesDestination    = './assets/img/';                           // Destination folder of optimized images. Must be different from the imagesSRC folder.

// Watch files paths.
var styleWatchFiles      = './assets/src/less/**/*.less';             // Path to all *.scss files inside css folder and inside them.
var scriptWatchFiles     = './assets/src/js/*.js';                    // Path to all custom JS files.
var projectPHPWatchFiles = './**/*.php';                              // Path to all PHP files.


// Browsers you care about for autoprefixing.
// Browserlist https://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
  'android >= 4',
  'bb >= 10',
  'chrome >= 34',
  'ff >= 30',
  'ie >= 9',
  'ie_mob >= 10',
  'ios >= 7',
  'opera >= 23',
  'safari >= 7',
];
// STOP Editing Project Variables.

/**
 * Load Plugins.
 *
 * Load gulp plugins and assing them semantic names.
 */
var gulp         = require('gulp');                  // Gulp of-course
var gutil        = require('gulp-util');             // Utility functions for gulp plugins

// CSS related plugins.
var less         = require('gulp-less');             // Gulp pluign for Sass compilation.
var cssmin       = require('gulp-cssmin');           // Minifies CSS files.
var autoprefixer = require('gulp-autoprefixer');     // Autoprefixing magic.

// JS related plugins.
var jshint       = require('gulp-jshint');           // JSHint plugin for gulp
var concat       = require('gulp-concat');           // Concatenates JS files
var uglify       = require('gulp-uglify');           // Minifies JS files

// Image realted plugins.
var imagemin     = require('gulp-imagemin');         // Minify PNG, JPEG, GIF and SVG images with imagemin.

// Utility related plugins.
var browserSync  = require('browser-sync').create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
var del          = require('del');                   // Delete files and folders
var gulpSequence = require('gulp-sequence');         // Run a series of gulp tasks in order
var errorHandler = require('gulp-plumber-notifier'); // Plumber then notify
var reload       = browserSync.reload;               // For manual browser reload.
var rename       = require('gulp-rename');           // Renames files E.g. style.css -> style.min.css
var size         = require('gulp-size');             // Logs out the total size of files in the stream and optionally the individual file-sizes
var sort         = require('gulp-sort');             // Recommended to prevent unnecessary changes in pot-file.
var wpPot        = require('gulp-wp-pot');           // For generating the .pot file.




/**
 * Task: `browser-sync`.
 *
 * Live Reloads, CSS injections, Localhost tunneling.
 *
 * This task does the following:
 *    1. Sets the project URL
 *    2. Sets inject CSS
 *    3. You may want to stop the browser from openning automatically
 */
gulp.task( 'browser-sync', function() {
  browserSync.init( {

    // Project URL.
    proxy: projectURL,

    // `true` Automatically open the browser with BrowserSync live server.
    // `false` Stop the browser from automatically opening.
    open: false,

    // Inject CSS changes.
    // Commnet it to reload browser for every CSS change.
    injectChanges: true,

    // The small pop-over notifications in the browser are not always needed/wanted
    notify: false,
  });
});


/**
 * Task: `styles`.
 *
 * Compiles LESS, Autoprefixes it and Minifies CSS.
 *
 */
gulp.task('styles', function () {
  return gulp.src( styleSRC )
    .pipe( errorHandler() )

    .pipe( less() )
    .pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )
    .pipe( gulp.dest( styleDestination ) )
    .pipe( browserSync.stream() ) // Reloads style.css if that is enqueued.
    .pipe( size({
      showFiles: true
    }) )

    .pipe( rename( { suffix: '.min' } ) )
    .pipe( cssmin({
      keepSpecialComments: false
    }))
    .pipe( gulp.dest( styleDestination ) )
    .pipe( browserSync.stream() ) // Reloads style.min.css if that is enqueued.
    .pipe( size({
      showFiles: true
    }) );
});


/**
  * Task: `scripts`.
  *
  * Concatenate and uglify custom JS scripts.
  *
  */
gulp.task( 'scripts', function() {
  return gulp.src( scriptSRC )
    .pipe( errorHandler() )

    .pipe( jshint() )
    .pipe( jshint.reporter('jshint-stylish') )

    .pipe( concat( scriptFile + '.js' ) )
    .pipe( gulp.dest( scriptDestination ) )
    .pipe( size({
      showFiles: true
    }) )

    .pipe( rename( {
      basename: scriptFile,
      suffix: '.min'
    }))
    .pipe( uglify() )
    .pipe( gulp.dest( scriptDestination ) )
    .pipe( size({
      showFiles: true
    }) );
});


/**
  * Task: `images`.
  *
  * Minifies PNG, JPEG, GIF and SVG images.
  *
  */
gulp.task( 'images', function() {
  gulp.src( imagesSRC )
  .pipe( imagemin( {
    interlaced: true,
    progressive: true,
    optimizationLevel: 5, // 0-7 low-high
    svgoPlugins: [{removeViewBox: false}]
  } ) )
  .pipe(gulp.dest( imagesDestination ));
});


/**
  * WP POT Translation File Generator.
  *
  * * This task does the following:
  *     1. Gets the source of all the PHP files
  *     2. Sort files in stream by path or any custom sort comparator
  *     3. Applies wpPot with the variable set at the top of this file
  *     4. Generate a .pot file of i18n that can be used for l10n to build .mo file
  */
gulp.task( 'translate', function () {
 return gulp.src( projectPHPWatchFiles )
   .pipe( sort() )
   .pipe( wpPot( {
      domain        : text_domain,
      destFile      : destFile,
      package       : packageName,
      bugReport     : bugReport,
      lastTranslator: lastTranslator,
      team          : team
   } ))
   .pipe( gulp.dest( translatePath ) );
});


/**
 * Default Gulp task
 */
gulp.task( 'default', gulpSequence( 'styles', 'scripts', 'images' ) );

/**
  * Watch Tasks.
  *
  * Watches for file changes and runs specific tasks.
  */
gulp.task( 'serve', ['styles', 'scripts', 'browser-sync'], function () {
  gulp.watch( projectPHPWatchFiles, reload ); // Reload on PHP file changes.
  gulp.watch( styleWatchFiles, [ 'styles' ] ); // Reload on SCSS file changes.
  gulp.watch( scriptWatchFiles, [ 'scripts', reload ] ); // Reload on script file changes.
});
