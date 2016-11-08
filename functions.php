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
// A custom WP nav walker class to implement the Bootstrap navigation.
include_once( get_template_directory() . '/inc/navwalker.php' );
// Theme functions and definitions.
include_once( get_template_directory() . '/inc/setup.php' );
// Custom template tags for this theme.
include_once( get_template_directory() . '/inc/template-tags.php' );
