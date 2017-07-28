/**
 * Gulpfile.
 *
 * Gulp Workflow for WordPress Theme.
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
 * @author Jobayer Arman (@jobayerarman)
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
var project              = 'wp-theme-boilerplate';                    // Project Name
var theme                = 'wp_theme_boilerplate';                    // Theme Name
var package              = 'wp-theme-boilerplate';                    // Package Name
var projectURL           = 'http://wptheme.dev';                      // Project URL
var productURL           = './';                                      // Theme URL. Gulpfile.js lives in the root folder
var build                = './buildtheme/';                           // Files that you want to package into a zip go here
var buildInclude  = [
    // include common file types
    '**/*.php',
    '**/*.html',
    '**/*.css',
    '**/*.js',
    '**/*.jpg',
    '**/*.png',
    '**/*.svg',
    '**/*.ttf',
    '**/*.otf',
    '**/*.eot',
    '**/*.woff',
    '**/*.woff2',

    // include specific files and folders
    'screenshot.png',

    // exclude files and folders
    '!node_modules/**/*',
    '!files/**/*',
    '!style.css.map',
    '!gulpfile.js',
    '!assets/src/styles/*',
    '!assets/src/scripts/*'
  ];

// Github Configuration
var settings = {
  branch: {
    master: "master",
    dist: "dist"
  },
  remote: 'origin'
}

// Translation related.
var text_domain          = 'wp-theme-boilerplate';                    // Your textdomain here
var destFile             = 'wp-theme-boilerplate.pot';                // Name of the transalation file
var packageName          = 'wp-theme-boilerplate';                    // Package name
var bugReport            = 'http://jobayerarman.github.io/';          // Where can users report bugs
var lastTranslator       = 'Jobayer Arman <carbonjha@gmail.com>';     // Last translator Email ID
var team                 = 'Jobayer Arman <carbonjha@email.com>';     // Team's Email ID
var translatePath        = './languages'                              // Where to save the translation files

// Style related
var style = {
  src    : './assets/src/styles/main.less',             // Path to main .less file
  dest   : './assets/styles/',                           // Path to place the compiled CSS file
  destFiles  : './assets/styles/*.+(css|map)'            // Destination files
};

// JavaScript related
var script = {
  src    : './assets/src/scripts/*.js',                    // Path to JS custom scripts folder
  dest   : './assets/scripts/',                            // Path to place the compiled JS custom scripts file
  file   : 'script.js',                               // Compiled JS custom file name
  destFiles   : './assets/scripts/*.js'                    // Destination files
}

// Images related.
var image = {
  src    : './assets/src/img/**/*.{png,jpg,gif,svg}', // Source folder of images which should be optimized
  dest   : './assets/img/'                            // Destination folder of optimized images
}

// Watch files paths.
var watch = {
  style  : './assets/src/styles/**/*.less',             // Path to all *.less files inside css folder and inside them
  script : './assets/src/scripts/*.js',                    // Path to all custom JS files
  php    : './**/*.php'                               // Path to all PHP files
}

// Browsers you care about for autoprefixing.
// Browserlist https://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
  'last 2 versions',
  'ie 8',
  'ie 9',
  'android 4',
  'opera 12'
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
var cleancss     = require('gulp-clean-css');        // Minifies CSS files.
var autoprefixer = require('gulp-autoprefixer');     // Autoprefixing magic.
var sourcemaps   = require('gulp-sourcemaps');       // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file.

// JS related plugins.
var jshint       = require('gulp-jshint');           // JSHint plugin for gulp
var concat       = require('gulp-concat');           // Concatenates JS files
var uglify       = require('gulp-uglify');           // Minifies JS files

// Image realted plugins.
var imagemin     = require('gulp-imagemin');         // Minify PNG, JPEG, GIF and SVG images with imagemin.

// Github related plugins
var fs           = require('fs');
var bump         = require('gulp-bump');
var shell        = require('gulp-shell');
var prompt       = require('gulp-prompt');
var replace      = require('gulp-replace');
var gitChangelog = require('gulp-conventional-changelog');

// Utility related plugins.
var browserSync  = require('browser-sync').create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
var del          = require('del');                   // Delete files and folders
var filter       = require('gulp-filter');           // Helps work on a subset of the original files by filtering them using globbing.
var gulpSequence = require('gulp-sequence');         // Run a series of gulp tasks in order
var gulpif       = require('gulp-if');               // A ternary gulp plugin: conditionally control the flow of vinyl objects.
var lazypipe     = require('lazypipe');              // Lazypipe allows to create an immutable, lazily-initialized pipeline.
var notify       = require('gulp-notify');           // Sends message notification to you
var plumber      = require('gulp-plumber');          // Prevent pipe breaking caused by errors from gulp plugins
var reload       = browserSync.reload;               // For manual browser reload.
var rename       = require('gulp-rename');           // Renames files E.g. style.css -> style.min.css
var size         = require('gulp-size');             // Logs out the total size of files in the stream and optionally the individual file-sizes
var sort         = require('gulp-sort');             // Recommended to prevent unnecessary changes in pot-file.
var wpPot        = require('gulp-wp-pot');           // For generating the .pot file.

// production variable
var config = {
  production: !!gutil.env.production, // Two exclamations turn undefined into a proper false.
  sourceMaps:  !gutil.env.production
};

/**
 * Notify Errors
 */
function errorLog(error) {
  var lineNumber = (error.line) ? 'Line ' + error.line + ' -- ' : '';
  var column     = (error.column) ? 'Col ' + error.column : '';

  notify({
    title: 'Task [' + error.plugin + '] Failed',
    message: lineNumber + '' + column
  }).write(error); //Error Notification

  // Inspect the error object
  // console.log(error);

  // Pretty error reporting
  var report = '';
  var chalk = gutil.colors.white.bgRed;

  report += '\n';
  report += chalk('TASK:') + ' [' + error.plugin + ']\n';
  report += chalk('PROB:') + ' ' + error.message + '\n';
  if (error.lineNumber) { report += chalk('LINE:') + ' ' + error.lineNumber + '\n'; }
  if (error.column) { report += chalk('COL:') + '  ' + error.column + '\n'; }
  if (error.fileName)   { report += chalk('FILE:') + ' ' + error.fileName + '\n'; }
  console.error(report);

  this.emit('end');
};

/**
 * Task: Cleanup
 *
 * Cleans destination files
 */
gulp.task('clean:css', function() {
  return del([style.destFiles]);
});
gulp.task('clean:js', function() {
  return del([script.destFiles]);
});
gulp.task('clean:build', function() {
  return del(build);
});
gulp.task('clean:all', gulpSequence('clean:css', 'clean:js', 'clean:build'));

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

    // Will not attempt to determine your network status, assumes you're ONLINE
    online: true,

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
 * Theme Dev Setup
 *
 * Task:
 */
gulp.task('update-function-name', function(done) {
  return gulp.src([ './**/*.php' ])
    .pipe(replace( 'wp_theme_boilerplate', theme ))
    .pipe(gulp.dest( './' ))
    done();
});
gulp.task('update-package-name', function(done) {
  return gulp.src([ './**/*.php' ])
    .pipe(replace( 'wp-theme-boilerplate', package ))
    .pipe(gulp.dest( './' ))
    done();
});
gulp.task('update:all-name', gulpSequence('update-function-name', 'update-package-name'));

/**
 * Github release workflow
 *
 * Task: bump version
 */
gulp.task( 'bump-version', function (done) {
  return gulp.src(['./package.json'])
    .pipe(bump({type: 'patch'}).on('error', gutil.log))
    .pipe(gulp.dest('./'))
    done();
});

gulp.task('update-wp-style-css', function(done) {
  return gulp.src(['./style.css'])
    .pipe(replace( /(Version:)(\s*)(.*)/, '$1$2' + getPackageJsonVersion() ))
    .pipe(gulp.dest('./'))
    done();
});

gulp.task('bump:all', gulpSequence('bump-version', 'update-wp-style-css'));

/**
 * Github release workflow
 *
 * Task: generate a changelog
 */
gulp.task('changelog', function () {
  return gulp.src('CHANGELOG.md', { buffer: false })
    .pipe( gitChangelog({ preset: 'angular' }))
    .pipe( gulp.dest('./') );
});

/**
 * Github release workflow
 *
 * Task: commit changes to github
 */
gulp.task( 'commit-changes', function () {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('[Prerelease] Bumped version number'));
});

/**
 * Github release workflow
 *
 * Task: commit changes to github
 */
gulp.task( 'push-changes', function (cb) {
  git.push( settings.remote, settings.branch.master, cb );
});

function getPackageJsonVersion() {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

/**
 * Github release workflow
 *
 * Task: release to github
 */
gulp.task('release', function(cb) {
  gulp.src('/')
  .pipe(prompt.prompt([{
    type: 'confirm',
    name: 'task',
    message: 'This will deploy to the ' + settings.branch.dist + ' Branch. It auto commits and pushes to the ' + settings.branch.master + '. Sure?'
  }],
  function(res) {
    runSequence(
      'bump:all',
      'deploy',
      function (error) {
        if (error) {
          console.log(error.message);
        } else {
          console.log('RELEASE FINISHED SUCCESSFULLY: ' + getPackageJsonVersion());
        }
        cb(error);
      });
  }));
});

gulp.task('deploy', function() {
  var version = getPackageJsonVersion();
  return gulp.src('/', {read: false})
  .pipe(shell(
    [
    'git checkout ' + settings.branch.master,
    'git add --all',
    'git commit -m "Auto-Commit for deployment "'+ version,
    'git tag -a '+ version + '-dev -m "Version' + version + '"',
    'git push ' + settings.remote + ' ' + settings.branch.master + ' ' + version + '-dev',
    'git checkout -B ' + settings.branch.dist,
    'rm .gitignore',
    'mv .gitignore-dist .gitignore',
    'git rm -r --cached .',
    'git add --all',
    'git commit -m "build for release version "' + version,
    'git tag -a '+ version + '-dist -m "Version' + version + '"',
    'git push --force ' + settings.remote + ' ' + settings.branch.dist + ' ' + version + '-dist',
    'git checkout ' + settings.branch.master,
    'git branch -D ' + settings.branch.dist,
    'echo "Deployed Version: "' + version
    ],
    {ignoreErrors: true}));
});

/**
 * Task: `styles`.
 *
 * Compiles LESS, Autoprefixes it and Minifies CSS.
 *
 */
var minifyCss = lazypipe()
  .pipe(cleancss, {keepSpecialComments: false});

gulp.task('styles', ['clean:css'], function() {
  return gulp.src(style.src)
    .pipe(plumber({errorHandler: errorLog}))
    .pipe(gulpif(config.sourceMaps, sourcemaps.init()))

    .pipe(less())

    .pipe(gulpif(config.sourceMaps, sourcemaps.write({includeContent: false}))) // By default the source maps include the source code
    .pipe(gulpif(config.sourceMaps, sourcemaps.init({loadMaps: true})))         // Set to true to load existing maps for source files

    .pipe(autoprefixer( AUTOPREFIXER_BROWSERS ) )

    .pipe(gulpif(config.sourceMaps, sourcemaps.write('.')))

    .pipe(gulpif(config.production, minifyCss()))


    .pipe(gulp.dest(style.dest))
    .pipe(filter('**/*.css'))                                                     // Filtering stream to only css files
    .pipe(browserSync.stream())                                                   // Injects CSS into browser

    .pipe(size({
      showFiles: true
    }));
});


/**
  * Task: `scripts`.
  *
  * Concatenate and uglify custom JS scripts.
  *
  */
var minifyScripts = lazypipe()
  .pipe(uglify);

gulp.task( 'scripts', ['clean:js'], function() {
  return gulp.src(script.src)
    .pipe(plumber({errorHandler: errorLog}))

    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))

    .pipe(concat(script.file))
    .pipe(gulpif(config.production, minifyScripts()))

    .pipe(gulp.dest(script.dest))

    .pipe(size({
      showFiles: true
    }));
});


/**
  * Task: `images`.
  *
  * Minifies PNG, JPEG, GIF and SVG images.
  *
  */
gulp.task( 'images', function() {
  gulp.src(image.src)
  .pipe(imagemin({
    interlaced: true,
    progressive: true,
    optimizationLevel: 5, // 0-7 low-high
    svgoPlugins: [{removeViewBox: false}]
  }))
  .pipe(gulp.dest(image.dest));
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
gulp.task( 'translate', function() {
 return gulp.src( projectPHPWatchFiles )
   .pipe(sort())
   .pipe(wpPot({
      domain         : text_domain,
      destFile       : destFile,
      package        : packageName,
      bugReport      : bugReport,
      lastTranslator : lastTranslator,
      team           : team
   }))
   .pipe( gulp.dest(translatePath));
});

/**
  * Clean gulp cache
  */
  gulp.task('clear', function () {
    cache.clearAll();
  });

/**
  * Build task that moves essential theme files for production-ready sites
  *
  * buildFiles copies all the files in buildInclude to build folder - check variable values at the top
  * buildImages copies all the images from img folder in assets while ignoring images inside raw folder if any
  */
  gulp.task('buildFiles', function() {
    return  gulp.src(buildInclude)
    .pipe(gulp.dest(build))
    .pipe(notify({ message: 'Copy from buildFiles complete', onLast: true }));
  });

/**
  * Zipping build directory for distribution
  *
  * Taking the build folder, which has been cleaned, containing optimized files and zipping it up to send out as an installable theme
  */
  gulp.task('buildZip', function () {
    return  gulp.src(build+'/**/')
    .pipe(zip(project+'.zip'))
    .pipe(gulp.dest('./'));
  });

// Package Distributable Theme
gulp.task( 'build', function(cb) {
  gulpSequence('clean:all', 'styles', 'scripts', 'buildFiles', 'buildZip', 'clean:build', cb);
});
// Package Distributable Theme
gulp.task( 'build-bump', function(cb) {
  gulpSequence('clean:all', 'bump:all', 'styles', 'scripts', 'buildFiles', 'buildZip', 'clean:build', cb);
});


/**
 * Default Gulp task
 */
gulp.task( 'default', gulpSequence('clean:all', 'styles', 'scripts', 'translate', 'images'));

/**
 * Run all the tasks sequentially
 * Use this task for development
 */
gulp.task( 'serve', gulpSequence('styles', 'scripts', 'watch'));

/**
  * Watch Tasks.
  *
  * Watches for file changes and runs specific tasks.
  */
gulp.task('watch', ['browser-sync'], function() {
  gulp.watch(watch.style, ['styles']);         // Reload on less file changes.
  gulp.watch(watch.php, ['watch-php']);        // Reload on PHP file changes.
  gulp.watch(watch.script, ['watch-scripts']); // Reload on script file changes.
});

// reload browser
gulp.task('watch-php', function(done) {
  reload();
  done();
});
gulp.task('watch-scripts', ['scripts'], function(done) {
  reload();
  done();
})
