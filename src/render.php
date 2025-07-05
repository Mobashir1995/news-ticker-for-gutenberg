<?php
/**
 * Server-side rendering of the `news-ticker-for-gutenberg/news-ticker` block.
 *
 * @package NewsTickerForGutenberg
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Renders the `news-ticker-for-gutenberg/news-ticker` block on the server.
 *
 * @param array $attributes Block attributes.
 * @return string Returns the block HTML.
 */
if ( ! function_exists( 'ntfg_render_news_ticker_block' ) ) {
function ntfg_render_news_ticker_block( $attributes ) {
	// Extract attributes
	$animation_type = $attributes['animationType'] ?? 'scrolling';
	$animation_speed = $attributes['animationSpeed'] ?? 50;
	$animation_direction = $attributes['animationDirection'] ?? 'left';
	$show_controls = $attributes['showControls'] ?? true;
	$show_play_pause = $attributes['showPlayPause'] ?? true;
	$show_navigation = $attributes['showNavigation'] ?? true;
	$pause_on_hover = $attributes['pauseOnHover'] ?? true;
	$show_logo = $attributes['showLogo'] ?? true;
	$logo_url = $attributes['logoUrl'] ?? '';
	$logo_alt = $attributes['logoAlt'] ?? '';
	$show_breaking_news = $attributes['showBreakingNews'] ?? true;
	$breaking_news_text = $attributes['breakingNewsText'] ?? __( 'Breaking News', 'news-ticker-for-gutenberg' );
	$show_live_text = $attributes['showLiveText'] ?? true;
	$live_text = $attributes['liveText'] ?? __( 'LIVE', 'news-ticker-for-gutenberg' );
	$show_date = $attributes['showDate'] ?? true;
	$date_format = $attributes['dateFormat'] ?? 'M j, Y';
	$post_type = $attributes['postType'] ?? 'post';
	$selected_taxonomies = $attributes['selectedTaxonomies'] ?? array();
	$selected_posts = $attributes['selectedPosts'] ?? array();
	$posts_per_page = $attributes['postsPerPage'] ?? 10;
	$order_by = $attributes['orderBy'] ?? 'date';
	$order = $attributes['order'] ?? 'DESC';
	$custom_content = $attributes['customContent'] ?? array();
	$backgroundColor = $attributes['backgroundColor'] ?? '#000000';
	$textColor = $attributes['textColor'] ?? '#ffffff';
	$accentColor = $attributes['accentColor'] ?? '#ff0000';
	$fontSize = $attributes['fontSize'] ?? '16px';
	$fontFamily = $attributes['fontFamily'] ?? '';
	$fontWeight = $attributes['fontWeight'] ?? '400';
	$lineHeight = $attributes['lineHeight'] ?? '1.5';
	$borderRadius = $attributes['borderRadius'] ?? '0px';
	$padding = $attributes['padding'] ?? array(
		'top' => '10px',
		'right' => '15px',
		'bottom' => '10px',
		'left' => '15px',
	);
	$margin = $attributes['margin'] ?? array(
		'top' => '0px',
		'right' => '0px',
		'bottom' => '0px',
		'left' => '0px',
	);

	// Build inline styles
	$styles = array(
		'background-color: ' . esc_attr( $backgroundColor ),
		'color: ' . esc_attr( $textColor ),
		'font-size: ' . esc_attr( $fontSize ),
		'font-weight: ' . esc_attr( $fontWeight ),
		'line-height: ' . esc_attr( $lineHeight ),
		'border-radius: ' . esc_attr( $borderRadius ),
		'padding: ' . esc_attr( $padding['top'] ) . ' ' . esc_attr( $padding['right'] ) . ' ' . esc_attr( $padding['bottom'] ) . ' ' . esc_attr( $padding['left'] ),
		'margin: ' . esc_attr( $margin['top'] ) . ' ' . esc_attr( $margin['right'] ) . ' ' . esc_attr( $margin['bottom'] ) . ' ' . esc_attr( $margin['left'] ),
	);

	if ( ! empty( $fontFamily ) ) {
		$styles[] = 'font-family: ' . esc_attr( $fontFamily );
	}

	$inline_styles = implode( '; ', $styles );

	// Build data attributes
	$data_attributes = array(
		'data-animation-type="' . esc_attr( $animation_type ) . '"',
		'data-animation-speed="' . esc_attr( $animation_speed ) . '"',
		'data-animation-direction="' . esc_attr( $animation_direction ) . '"',
		'data-show-controls="' . esc_attr( $show_controls ? 'true' : 'false' ) . '"',
		'data-show-play-pause="' . esc_attr( $show_play_pause ? 'true' : 'false' ) . '"',
		'data-show-navigation="' . esc_attr( $show_navigation ? 'true' : 'false' ) . '"',
		'data-pause-on-hover="' . esc_attr( $pause_on_hover ? 'true' : 'false' ) . '"',
		'data-post-type="' . esc_attr( $post_type ) . '"',
		'data-taxonomies="' . esc_attr( wp_json_encode( $selected_taxonomies ) ) . '"',
		'data-posts="' . esc_attr( wp_json_encode( $selected_posts ) ) . '"',
		'data-posts-per-page="' . esc_attr( $posts_per_page ) . '"',
		'data-order-by="' . esc_attr( $order_by ) . '"',
		'data-order="' . esc_attr( $order ) . '"',
		'data-custom-content="' . esc_attr( wp_json_encode( $custom_content ) ) . '"',
	);

	$data_attrs = implode( ' ', $data_attributes );

	// Get ticker content
	$ticker_items = ntfg_get_ticker_items( $attributes );

	// Start building HTML
	$html = '<div class="ntfg-news-ticker" style="' . $inline_styles . '" ' . $data_attrs . '>';

	// Header section
	$html .= '<div class="ntfg-ticker-header">';

	if ( $show_logo && ! empty( $logo_url ) ) {
		$html .= '<div class="ntfg-logo">';
		$html .= '<img src="' . esc_url( $logo_url ) . '" alt="' . esc_attr( $logo_alt ) . '" />';
		$html .= '</div>';
	}

	if ( $show_breaking_news ) {
		$html .= '<div class="ntfg-breaking-news" style="color: ' . esc_attr( $accentColor ) . ';">';
		$html .= esc_html( $breaking_news_text );
		$html .= '</div>';
	}

	if ( $show_live_text ) {
		$html .= '<div class="ntfg-live-text" style="color: ' . esc_attr( $accentColor ) . ';">';
		$html .= esc_html( $live_text );
		$html .= '</div>';
	}

	if ( $show_date ) {
		$html .= '<div class="ntfg-date">';
		$html .= esc_html( current_time( $date_format ) );
		$html .= '</div>';
	}

	$html .= '</div>'; // End header

	// Content section
	$html .= '<div class="ntfg-ticker-content">';
	$html .= '<div class="ntfg-ticker-items">';

	if ( ! empty( $ticker_items ) ) {
		foreach ( $ticker_items as $item ) {
			$html .= '<div class="ntfg-ticker-item">';
			if ( ! empty( $item['url'] ) ) {
				$html .= '<a href="' . esc_url( $item['url'] ) . '">';
			}
			$html .= esc_html( $item['title'] );
			if ( ! empty( $item['url'] ) ) {
				$html .= '</a>';
			}
			$html .= '</div>';
		}
	} else {
		$html .= '<div class="ntfg-ticker-item">';
		$html .= esc_html( __( 'No content available', 'news-ticker-for-gutenberg' ) );
		$html .= '</div>';
	}

	$html .= '</div>'; // End ticker-items
	$html .= '</div>'; // End ticker-content

	// Controls section
	if ( $show_controls ) {
		$html .= '<div class="ntfg-ticker-controls">';

		if ( $show_navigation ) {
			$html .= '<button class="ntfg-nav-prev" aria-label="' . esc_attr__( 'Previous', 'news-ticker-for-gutenberg' ) . '">‹</button>';
			$html .= '<button class="ntfg-nav-next" aria-label="' . esc_attr__( 'Next', 'news-ticker-for-gutenberg' ) . '">›</button>';
		}

		if ( $show_play_pause ) {
			$html .= '<button class="ntfg-play-pause" aria-label="' . esc_attr__( 'Play/Pause', 'news-ticker-for-gutenberg' ) . '">▶</button>';
		}

		$html .= '</div>'; // End ticker-controls
	}

	$html .= '</div>'; // End news-ticker

	return $html;
}
}

/**
 * Get ticker items from posts and custom content
 *
 * @param array $attributes Block attributes.
 * @return array Array of ticker items.
 */
if ( ! function_exists( 'ntfg_get_ticker_items' ) ) {
function ntfg_get_ticker_items( $attributes ) {
	$items = array();

	// Get selected posts
	$selected_posts = $attributes['selectedPosts'] ?? array();
	if ( ! empty( $selected_posts ) ) {
		$posts = get_posts( array(
			'post__in' => $selected_posts,
			'post_type' => 'any',
			'post_status' => 'publish',
			'orderby' => 'post__in',
		) );

		foreach ( $posts as $post ) {
			$items[] = array(
				'title' => $post->post_title,
				'url' => get_permalink( $post->ID ),
				'date' => get_the_date( '', $post->ID ),
				'type' => 'post',
			);
		}
	}

	// Get queried posts
	$post_type = $attributes['postType'] ?? 'post';
	$selected_taxonomies = $attributes['selectedTaxonomies'] ?? array();
	$posts_per_page = $attributes['postsPerPage'] ?? 10;
	$order_by = $attributes['orderBy'] ?? 'date';
	$order = $attributes['order'] ?? 'DESC';

	$query_args = array(
		'post_type' => $post_type,
		'post_status' => 'publish',
		'posts_per_page' => $posts_per_page,
		'orderby' => $order_by,
		'order' => $order,
	);

	// Add taxonomy filters
	if ( ! empty( $selected_taxonomies ) ) {
		$tax_query = array();
		foreach ( $selected_taxonomies as $taxonomy_data ) {
			if ( isset( $taxonomy_data['taxonomy'] ) && isset( $taxonomy_data['id'] ) ) {
				$tax_query[] = array(
					'taxonomy' => $taxonomy_data['taxonomy'],
					'field' => 'term_id',
					'terms' => $taxonomy_data['id'],
				);
			}
		}
		if ( ! empty( $tax_query ) ) {
			$query_args['tax_query'] = array(
				'relation' => 'OR',
				$tax_query,
			);
		}
	}

	// Exclude already selected posts
	if ( ! empty( $selected_posts ) ) {
		$query_args['post__not_in'] = $selected_posts;
	}

	$query = new WP_Query( $query_args );

	if ( $query->have_posts() ) {
		while ( $query->have_posts() ) {
			$query->the_post();
			$items[] = array(
				'title' => get_the_title(),
				'url' => get_permalink(),
				'date' => get_the_date(),
				'type' => 'post',
			);
		}
	}

	wp_reset_postdata();

	// Add custom content
	$custom_content = $attributes['customContent'] ?? array();
	foreach ( $custom_content as $content ) {
		if ( ! empty( $content['title'] ) ) {
			$items[] = array(
				'title' => $content['title'],
				'url' => ! empty( $content['url'] ) ? $content['url'] : '',
				'date' => ! empty( $content['date'] ) ? $content['date'] : '',
				'type' => 'custom',
			);
		}
	}

	return $items;
}
}

// Register the render callback
register_block_type( 'news-ticker-for-gutenberg/news-ticker', array(
	'render_callback' => 'ntfg_render_news_ticker_block',
) ); 