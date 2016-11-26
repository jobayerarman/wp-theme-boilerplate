# wp-theme-boilerplate
WordPress Theme Boilerplate with well organised project structure and modern build tools to quickstart your theme development!

[![built with gulp](https://img.shields.io/badge/gulp-supported_project-eb4a4b.svg?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAYAAAAOCAMAAAA7QZ0XAAAABlBMVEUAAAD%2F%2F%2F%2Bl2Z%2FdAAAAAXRSTlMAQObYZgAAABdJREFUeAFjAAFGRjSSEQzwUgwQkjAFAAtaAD0Ls2nMAAAAAElFTkSuQmCC)](http://gulpjs.com/)

## Features

* Less for stylesheets
* [BrowserSync](http://www.browsersync.io/) for synchronized browser testing
* [Bootstrap 3](http://getbootstrap.com/) for a front-end framework

## Requirements

Make sure all dependencies have been installed before moving on:

* [PHP](http://php.net/manual/en/install.php) >= 5.5.x
* [Node.js](http://nodejs.org/) >= 4.5
* [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/package/npm)
* [gulp-cli](https://www.npmjs.com/package/gulp-cli) >= 1.2.0

## Theme structure

```shell
themes/your-theme-name/         # → Root of your theme
├── assets                      # → Front-end assets
│   ├── images/                   # → Theme images
│   ├── scripts/                  # → Theme JS
│   ├── styles/                   # → Theme stylesheets
│   └── src/                      # → Source directory
│   │   ├── scripts/                # → Source scripts
|   │   └── styles/                 # → Source stylesheets
|   |   │   ├── 1-vendor/             # → CSS files from external libraries
|   |   │   ├── 2-util/               # → Less tools and helpers
|   |   │   ├── 3-base/               # → Boilerplate code for the project
|   |   │   ├── 4-layout/             # → Laying out the site or application
|   |   │   ├── 5-components/         # → Small components and widgets
|   |   │   ├── 6-theme/              # → Different themes
|   |   │   ├── 7-custom/             # → Custom styles
|   |   │   └── main.less             # → The main file imports whole code base
├── inc/                        # → Theme PHP
│   ├── custom-header.php         # → Custom Header feature
│   ├── customizer.php            # → Theme Customizer
│   ├── enqueue.php               # → Enqueue theme stylesheets and scripts
│   ├── extras.php                # → Custom functions
│   ├── jetpack.php               # → Jetpack Compatibility File
│   ├── navwalker.php             # → Custom WordPress nav walker class to implement the Bootstrap 3 navigation
│   ├── setup.php                 # → Theme setup functions and definitions
│   └── template-tags.php         # → Custom template tags for this theme
├── languages/                  # → Theme language files
├── templates-parts/            # → Theme templates
│   ├── content-none.php          # → Template part for displaying a message that posts cannot be found
│   ├── content-page.php          # → Template part for displaying page content in page.php
│   ├── content-search.php        # → Template part for displaying results in search pages
│   └── content.php               # → Template part for displaying posts
├── .editorconfig               # → Consistent coding styles between different editors
├── .gitattributes              # → Defining attributes per path
├── .gitignore                  # → Specifies intentionally untracked files to ignore
├── .jscsrc                     # → JavaScript code style linter and formatter
├── .jshintignore               # → Specifies files and path ignored by JSHint
├── .jshintrc                   # → Flags suspicious usage in programs written in JavaScript
├── 404.php                     # → Template for displaying 404 pages
├── README.md                   # → Project description
├── archive.php                 # → Template for displaying archive pages
├── comments.php                # → Template for displaying comments
├── footer.php                  # → Template for displaying the footer
├── functions.php               # → Theme includes
├── gulpfile.js                 # → Gulp tasks runner
├── header.php                  # → Header for our theme
├── index.php                   # → Main template file
├── package.json                # → Node.js dependencies and scripts
├── page.php                    # → Template for displaying all pages
├── rtl.css                     # → Support for language written in a Right To Left
├── screenshot.png              # → Theme screenshot for WP admin
├── search.php                  # → Template for displaying search results pages
├── sidebar.php                 # → Template for sidebar containing the main widget area
├── single.php                  # → Template for displaying all single posts
└── style.css                   # → Theme meta information
```

## Theme development

This project uses [Gulp](http://gulpjs.org/) as a build tool and you can use [Yarn](https://yarnpkg.com/) to manage front-end packages.

### Install dependencies

From the command line on your host machine, navigate to the theme directory then run `yarn install`:

```shell
C:\wamp\www\project-name\wp-content\themes\your-theme-name>
yarn install
```

You now have all the necessary dependencies to run the build process.

### Build commands

* `gulp` — Compile assets for development
* `gulp serve` — Compile assets for development, start BrowserSync session
* `gulp --production` — Compile assets for production

## Contributing

Contributions are welcome from everyone.
