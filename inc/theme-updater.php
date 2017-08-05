<?php

require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';

if ( ! class_exists( 'Theme_Updater' ) ) {

    class Theme_Updater {

        /**
         * @var $config the config for the updater
         * @access public
         */
        var $config;

        /**
         * @var $github_data temporiraly store the data fetched from GitHub, allows us to only load the data once per class instance
         * @access private
         */
        private $github_data;

        /**
         * Class Constructor
         *
         * @since 1.0
         * @param array $config the configuration required for the updater to work
         * @return void
         */
        public function __construct( $config = array() ) {

            $defaults = array(
                'slug' => wp_get_theme()->get_template(),
                'owner' => 'jobayerarman',
                'access_token' => '',
            );

            $this->config = wp_parse_args( $config, $defaults );

            $this->set_defaults();

            // Check for updates
            add_filter( 'pre_set_site_transient_update_themes', array( $this, 'check_for_update' ), 10, 1 );

            // Rename this zip file to the accurate theme folder
            add_filter( 'upgrader_source_selection', array( $this, 'upgrader_source_selection' ), 10, 3 );
        }

        /**
         * Set defaults
         *
         * @since 2.6.1
         * @return void
         */
        public function set_defaults() {
            // Store the data in this class instance for future calls
            $update_data = $this->get_github_data();

            if ( ! isset( $this->config['new_version'] ) )
                $this->config['new_version'] = $update_data['tag_name'];

            if ( ! isset( $this->config['zip_url'] ) )
                $this->config['zip_url'] = $update_data['zipball_url'];

            if ( ! isset( $this->config['github_url'] ) )
                $this->config['github_url'] = $update_data['html_url'];

            $theme_data = wp_get_theme();
            if ( ! isset( $this->config['theme_name'] ) )
                $this->config['theme_name'] = $theme_data['Name'];

            if ( ! isset( $this->config['version'] ) )
                $this->config['version'] = $theme_data['Version'];
        }

        /**
         * Get GitHub Data from the specified repository
         *
         * @since 1.0
         * @return array $github_data the data
         */
        public function get_github_data() {
            if ( isset( $this->github_data ) && ! empty( $this->github_data ) ) {
                $github_data = $this->github_data;
            } else {
                $github_data = get_site_transient( $this->config['slug'].'_github_data' );

                if ( ( ! isset( $github_data ) || ! $github_data || '' == $github_data ) ) {
                    $query = $this->config['api_url'];

                    $github_data = wp_remote_get( $query );

                    if ( is_wp_error( $github_data ) )
                        return false;

                    $github_data = json_decode( wp_remote_retrieve_body( $github_data ), true );

                    if( is_array( $github_data ) ) {
                        $github_data = current( $github_data );
                    }

                    // refresh every 6 hours
                    set_site_transient( $this->config['slug'].'_github_data', $github_data, 60*60*6 );
                }

                // Store the data in this class instance for future calls
                $this->github_data = $github_data;
            }

            return $github_data;
        }

        /**
         * [check_for_update description]
         * @param  [type] $transient [description]
         * @return [type]            [description]
         */
        public function check_for_update( $transient ) {

            // Check if the transient contains the 'checked' information
            // If not, just return its value without hacking it
            if ( empty( $transient->checked ) ) {
                return $transient;
            }

            // check the version and decide if it's new
            $update = version_compare( $this->config['new_version'], $this->config['version'] );

            if ( 1 === $update ) {

                $response = array(
                    'theme'       => $this->config['slug'],
                    'new_version' => $this->config['new_version'],
                    'package'     => $this->config['zip_url'],
                    'url'         => $this->config['github_url']
                );

                // If response is false, don't alter the transient
                if ( false !== $response )
                    $transient->response[ $this->config['slug'] ] = $response;
            }

            return $transient;
        }

        /**
         * Used for renaming of sources to ensure correct directory name.
         *
         * @since WordPress 4.4.0 The $hook_extra parameter became available.
         *
         * @param string                           $source
         * @param string                           $remote_source
         * @param \Theme_Upgrader $upgrader
         * @param array                            $hook_extra
         *
         * @return string
         */
        public function upgrader_source_selection( $source, $remote_source, $upgrader, $hook_extra = null ) {
            global $wp_filesystem;

            /*
             * Rename themes.
             */
            if( isset( $source, $remote_source, $upgrader->skin->theme ) ) {
                $corrected_source = $remote_source . '/' . $upgrader->skin->theme . '/';

                if( @rename($source, $corrected_source ) ) {
                    $upgrader->skin->feedback("Theme folder name corrected to: " . $upgrader->skin->theme );
                    return $corrected_source;
                } else {
                    $upgrader->skin->feedback("Unable to rename downloaded theme.");
                    return new WP_Error();
                }
            }

            return $source;
        }
    }
}
