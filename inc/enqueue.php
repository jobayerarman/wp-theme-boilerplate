<?php

    // Load CSS
    function wp_theme_boilerplate_load_styles() {
        // Register Styles
        wp_register_style('font-awesome_style', '//maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
        wp_register_style('wp_theme_boilerplate_main_style', get_template_directory_uri() . '/assets/css/main.css');

        // Enqueue Styles
        wp_enqueue_style( 'wp-theme-boilerplate-style', get_stylesheet_uri() );
        wp_enqueue_style( 'font-awesome_style' );
        wp_enqueue_style( 'wp_theme_boilerplate_main_style' );
    }
    // Load CSS
    add_action('wp_enqueue_scripts', 'wp_theme_boilerplate_load_styles');

    // Load Javascript
    function wp_theme_boilerplate_load_scripts() {

        wp_deregister_script( 'jquery' );
        wp_deregister_script( 'jquery-migrate.min' );

        wp_register_script('jquery', ("http://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"), false, '1.12.4', true);
        wp_register_script('jquery-migrate.min', ("https://cdnjs.cloudflare.com/ajax/libs/jquery-migrate/3.0.0/jquery-migrate.min.js"), false, '3.0.0', true);

        wp_enqueue_script('jquery');
        wp_enqueue_script('jquery-migrate.min');

        // Bootstrap
        wp_register_script('bootstrap-scripts', 'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js', array('jquery'), null, true);
        wp_enqueue_script('bootstrap-scripts');

        // Custom Scripts
        wp_register_script('wp_theme_boilerplate_custom_script', get_template_directory_uri() . '/assets/js/script.js', array('jquery'), null, true);
        wp_enqueue_script('wp_theme_boilerplate_custom_script');

        if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
            wp_enqueue_script( 'comment-reply' );
        }
    }
    // Load Javascript
    add_action('wp_enqueue_scripts', 'wp_theme_boilerplate_load_scripts');
?>
