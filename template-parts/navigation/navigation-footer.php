<?php
/**
 * Displays footer navigation
 *
 * @package desher-khobor
 */
?>

<?php if ( has_nav_menu( 'footer' ) ) : ?>
    <nav id="footer-navigation" class="navbar navbar-default footer-navigation col-md-12" role="navigation">
        <div class="row">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#footer-navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </div>
            <?php
            wp_nav_menu( array(
                'menu'              => 'footer',
                'theme_location'    => 'footer',
                'depth'             =>  2,
                'container'         => 'div',
                'container_class'   => 'collapse navbar-collapse',
                'container_id'      => 'footer-navbar',
                'menu_class'        => 'nav navbar-nav',
                'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
                'walker'            => new wp_bootstrap_navwalker())
            );
            ?>
        </div> <!-- .container -->
    </nav> <!-- #footer-navigation -->
<?php endif; ?>
