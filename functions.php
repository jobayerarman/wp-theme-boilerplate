<?php
/**
 * wp-theme-boilerplate functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package wp-theme-boilerplate
 */

// Implement the Custom Header feature.
include_once( get_template_directory() . '/inc/custom-header.php' );
// Customizer additions.
include_once( get_template_directory() . '/inc/customizer.php' );
// Enqueue scripts and styles.
include_once( get_template_directory() . '/inc/enqueue.php' );
// Custom functions that act independently of the theme templates.
include_once( get_template_directory() . '/inc/extras.php' );
// Load Jetpack compatibility file.
include_once( get_template_directory() . '/inc/jetpack.php' );
// Register Bootstrap Navigation Walker
include_once( get_template_directory() . '/inc/navwalker.php' );
// Theme functions and definitions.
include_once( get_template_directory() . '/inc/setup.php' );
// Custom template tags for this theme.
include_once( get_template_directory() . '/inc/template-tags.php' );
// Theme Updater
require_once( get_template_directory() . '/inc/theme-updater.php' );

if ( is_admin() ) {
    $config = array(
        'slug' => 'wp-theme-boilerplate',
        'owner' => 'jobayerarman',
        'api_url' => 'http://api.github.com/repos/jobayerarman/wp-theme-boilerplate/releases'
        );
    new Theme_Updater( $config );
}
