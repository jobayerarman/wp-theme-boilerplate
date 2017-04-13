<?php
/**
 * Displays top navigation
 *
 * @package desher-khobor
 */
?>

<?php if ( has_nav_menu( 'top' ) ) : ?>
    <div class="col-md-2 col-md-offset-4">
        <?php
        wp_nav_menu( array(
            'menu'              => 'top',
            'theme_location'    => 'top',
            'container'         => 'div',
            'container_class'   => 'top-nav bg-gray-darker text-center',
            'container_id'      => 'top-navbar'
            ) );
        ?>
    </div>
<?php endif; ?>
