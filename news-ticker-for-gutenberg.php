<?php
/**
 * Plugin Name: News Ticker for Gutenberg
 * Plugin URI: https://example.com/news-ticker-for-gutenberg
 * Description: A comprehensive news ticker block for Gutenberg with multiple animation types, query controls, and customization options.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Tested up to: 6.8.1
 * Requires PHP: 7.4
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: news-ticker-for-gutenberg
 * Domain Path: /languages
 * Network: false
 * 
 * @package NewsTickerForGutenberg
 * @version 1.0.0
 * @author Your Name
 * @license GPL-2.0+
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit( 'Direct script access denied.' );
}

// Define plugin constants
define( 'NTFG_VERSION', '1.0.0' );
define( 'NTFG_PLUGIN_FILE', __FILE__ );
define( 'NTFG_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'NTFG_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'NTFG_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
define( 'NTFG_MIN_WP_VERSION', '6.0' );
define( 'NTFG_MIN_PHP_VERSION', '7.4' );

/**
 * Main plugin class
 * 
 * @since 1.0.0
 */
final class News_Ticker_For_Gutenberg {

	/**
	 * The single instance of the class
	 *
	 * @var News_Ticker_For_Gutenberg
	 * @since 1.0.0
	 */
	private static $instance = null;

	/**
	 * Plugin version
	 *
	 * @var string
	 * @since 1.0.0
	 */
	public $version = NTFG_VERSION;

	/**
	 * Plugin directory path
	 *
	 * @var string
	 * @since 1.0.0
	 */
	public $plugin_dir = NTFG_PLUGIN_DIR;

	/**
	 * Plugin URL
	 *
	 * @var string
	 * @since 1.0.0
	 */
	public $plugin_url = NTFG_PLUGIN_URL;

	/**
	 * Plugin basename
	 *
	 * @var string
	 * @since 1.0.0
	 */
	public $plugin_basename = NTFG_PLUGIN_BASENAME;

	/**
	 * Private constructor to prevent direct instantiation
	 *
	 * @since 1.0.0
	 */
	private function __construct() {
		$this->init_hooks();
	}

	/**
	 * Prevent cloning of the instance
	 *
	 * @since 1.0.0
	 */
	private function __clone() {}

	/**
	 * Prevent unserializing of the instance
	 *
	 * @since 1.0.0
	 */
	public function __wakeup() {}

	/**
	 * Get the singleton instance
	 *
	 * @return News_Ticker_For_Gutenberg
	 * @since 1.0.0
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Initialize hooks
	 *
	 * @since 1.0.0
	 */
	private function init_hooks() {
		// Check requirements before initializing
		if ( ! $this->check_requirements() ) {
			return;
		}

		// Load text domain
		add_action( 'init', array( $this, 'load_textdomain' ) );

		// Initialize plugin
		add_action( 'init', array( $this, 'init' ) );

		// Register activation and deactivation hooks
		register_activation_hook( __FILE__, array( $this, 'activate' ) );
		register_deactivation_hook( __FILE__, array( $this, 'deactivate' ) );
		register_uninstall_hook( __FILE__, array( 'News_Ticker_For_Gutenberg', 'uninstall' ) );

		// Admin hooks
		if ( is_admin() ) {
			add_action( 'admin_init', array( $this, 'admin_init' ) );
			add_action( 'admin_notices', array( $this, 'admin_notices' ) );
		}
	}

	/**
	 * Check plugin requirements
	 *
	 * @return bool
	 * @since 1.0.0
	 */
	private function check_requirements() {
		// Check WordPress version
		if ( version_compare( get_bloginfo( 'version' ), NTFG_MIN_WP_VERSION, '<' ) ) {
			add_action( 'admin_notices', function() {
				echo '<div class="notice notice-error"><p>';
				printf(
					/* translators: %s: WordPress version */
					esc_html__( 'News Ticker for Gutenberg requires WordPress %s or higher.', 'news-ticker-for-gutenberg' ),
					esc_html( NTFG_MIN_WP_VERSION )
				);
				echo '</p></div>';
			});
			return false;
		}

		// Check PHP version
		if ( version_compare( PHP_VERSION, NTFG_MIN_PHP_VERSION, '<' ) ) {
			add_action( 'admin_notices', function() {
				echo '<div class="notice notice-error"><p>';
				printf(
					/* translators: %s: PHP version */
					esc_html__( 'News Ticker for Gutenberg requires PHP %s or higher.', 'news-ticker-for-gutenberg' ),
					esc_html( NTFG_MIN_PHP_VERSION )
				);
				echo '</p></div>';
			});
			return false;
		}

		return true;
	}

	/**
	 * Load plugin textdomain
	 *
	 * @since 1.0.0
	 */
	public function load_textdomain() {
		load_plugin_textdomain(
			'news-ticker-for-gutenberg',
			false,
			dirname( plugin_basename( __FILE__ ) ) . '/languages'
		);
	}

	/**
	 * Initialize the plugin
	 *
	 * @since 1.0.0
	 */
	public function init() {
		// Register block
		$this->register_block();

		// Enqueue scripts and styles
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
	}

	/**
	 * Register the block
	 *
	 * @since 1.0.0
	 */
	public function register_block() {

        if( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
            wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
            return;
        }

        if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
            wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
        }

		$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
        foreach ( array_keys( $manifest_data ) as $block_type ) {
            register_block_type( __DIR__ . "/build/{$block_type}" );
        }
	}

	/**
	 * Enqueue frontend scripts and styles
	 *
	 * @since 1.0.0
	 */
	public function enqueue_scripts() {
		// Only enqueue if block is used
		if ( ! has_block( 'news-ticker-for-gutenberg/news-ticker' ) ) {
			return;
		}

		wp_enqueue_style(
			'news-ticker-for-gutenberg-style',
			$this->plugin_url . 'build/style-index.css',
			array(),
			$this->version
		);

		wp_enqueue_script(
			'news-ticker-for-gutenberg-frontend',
			$this->plugin_url . 'build/frontend.js',
			array(),
			$this->version,
			true
		);
	}

	/**
	 * Enqueue admin scripts and styles
	 *
	 * @since 1.0.0
	 */
	public function admin_enqueue_scripts() {
		$screen = get_current_screen();
		
		// Only enqueue on post edit screens
		if ( ! $screen || ! in_array( $screen->base, array( 'post', 'post-new' ) ) ) {
			return;
		}

		wp_enqueue_style(
			'news-ticker-for-gutenberg-editor',
			$this->plugin_url . 'build/index.css',
			array(),
			$this->version
		);
	}

	/**
	 * Admin initialization
	 *
	 * @since 1.0.0
	 */
	public function admin_init() {
		// Add settings link to plugins page
		add_filter( 'plugin_action_links_' . $this->plugin_basename, array( $this, 'plugin_action_links' ) );
	}

	/**
	 * Add settings link to plugins page
	 *
	 * @param array $links Plugin action links.
	 * @return array
	 * @since 1.0.0
	 */
	public function plugin_action_links( $links ) {
		$settings_link = sprintf(
			'<a href="%s">%s</a>',
			esc_url( admin_url( 'options-general.php?page=news-ticker-settings' ) ),
			esc_html__( 'Settings', 'news-ticker-for-gutenberg' )
		);
		array_unshift( $links, $settings_link );
		return $links;
	}

	/**
	 * Display admin notices
	 *
	 * @since 1.0.0
	 */
	public function admin_notices() {
		// Add any admin notices here
	}

	/**
	 * Plugin activation
	 *
	 * @since 1.0.0
	 */
	public function activate() {
		// Create default options
		$default_options = array(
			'version' => $this->version,
			'activated' => current_time( 'mysql' ),
		);
		
		add_option( 'news_ticker_for_gutenberg_options', $default_options );

		// Flush rewrite rules
		flush_rewrite_rules();
	}

	/**
	 * Plugin deactivation
	 *
	 * @since 1.0.0
	 */
	public function deactivate() {
		// Flush rewrite rules
		flush_rewrite_rules();
	}

	/**
	 * Plugin uninstall
	 *
	 * @since 1.0.0
	 */
	public static function uninstall() {
		// Remove plugin options
		delete_option( 'news_ticker_for_gutenberg_options' );

		// Remove any other plugin data
		// Be careful not to remove user content
	}

	/**
	 * Get plugin option
	 *
	 * @param string $key Option key.
	 * @param mixed  $default Default value.
	 * @return mixed
	 * @since 1.0.0
	 */
	public function get_option( $key, $default = null ) {
		$options = get_option( 'news_ticker_for_gutenberg_options', array() );
		return isset( $options[ $key ] ) ? $options[ $key ] : $default;
	}

	/**
	 * Update plugin option
	 *
	 * @param string $key Option key.
	 * @param mixed  $value Option value.
	 * @return bool
	 * @since 1.0.0
	 */
	public function update_option( $key, $value ) {
		$options = get_option( 'news_ticker_for_gutenberg_options', array() );
		$options[ $key ] = $value;
		return update_option( 'news_ticker_for_gutenberg_options', $options );
	}
}

/**
 * Get the main plugin instance
 *
 * @return News_Ticker_For_Gutenberg
 * @since 1.0.0
 */
function news_ticker_for_gutenberg() {
	return News_Ticker_For_Gutenberg::get_instance();
}

// Initialize the plugin
news_ticker_for_gutenberg();