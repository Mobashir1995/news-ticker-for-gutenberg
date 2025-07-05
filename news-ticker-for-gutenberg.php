<?php
/**
 * Plugin Name: News Ticker for Gutenberg
 * Plugin URI: https://github.com/your-username/news-ticker-for-gutenberg
 * Description: A comprehensive news ticker block for Gutenberg with multiple animation types, query controls, and extensive styling options.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://yourwebsite.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: news-ticker-for-gutenberg
 * Domain Path: /languages
 * Requires at least: 6.0
 * Tested up to: 6.5
 * Requires PHP: 8.0
 *
 * @package NewsTickerForGutenberg
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define plugin constants
define( 'NTFG_VERSION', '1.0.0' );
define( 'NTFG_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'NTFG_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'NTFG_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Main plugin class
 */
class NewsTickerForGutenberg {
	
	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
	}
	
	/**
	 * Initialize the plugin
	 */
	public function init() {
		// Register the block using block.json
		register_block_type( NTFG_PLUGIN_DIR . 'build' );
		
		// Load text domain
		load_plugin_textdomain( 'news-ticker-for-gutenberg', false, dirname( NTFG_PLUGIN_BASENAME ) . '/languages' );
	}
	
	/**
	 * Enqueue frontend assets
	 */
	public function enqueue_frontend_assets() {
		// Only enqueue if the block is used on the page
		if ( has_block( 'news-ticker-for-gutenberg/news-ticker' ) ) {
			wp_enqueue_script(
				'ntfg-frontend',
				NTFG_PLUGIN_URL . 'build/frontend.js',
				array(),
				NTFG_VERSION,
				true
			);
			
			wp_enqueue_style(
				'ntfg-frontend',
				NTFG_PLUGIN_URL . 'build/frontend.css',
				array(),
				NTFG_VERSION
			);
		}
	}
}

// Initialize the plugin
new NewsTickerForGutenberg(); 