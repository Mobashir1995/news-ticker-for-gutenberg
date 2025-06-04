<?php
/**
 * Plugin Name:       News Ticker Block
 * Description:       A Gutenberg block for displaying a news ticker.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       news-ticker-block
 *
 * @package           create-block
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly.

// Include the server-side rendering logic for the block.
require_once __DIR__ . '/includes/render-news-ticker.php';

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * The `render` property in `block.json` points to `render_news_ticker_block`,
 * which is now defined in the included file.
 */
function news_ticker_block_init() {
    register_block_type( __DIR__ . '/build/block.json' );
}
add_action( 'init', 'news_ticker_block_init' );
