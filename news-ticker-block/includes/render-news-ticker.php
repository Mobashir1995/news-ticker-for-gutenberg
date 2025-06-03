<?php
/**
 * News Ticker Block Server-Side Rendering Logic.
 *
 * @package NewsTickerBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Helper function to build a style string from an array of CSS properties.
 *
 * @param array $styles Array of CSS property => value.
 * @return string CSS style string.
 */
function news_ticker_block_get_styles_string( $styles ) {
	$style_string = '';
	foreach ( $styles as $property => $value ) {
		if ( ! empty( $value ) ) {
			// Ensure property names are valid CSS properties (simple alphanumeric and hyphen)
            $property = preg_replace('/[^a-zA-Z0-9-]/', '', $property);
			$style_string .= esc_attr( $property ) . ':' . esc_attr( $value ) . ';';
		}
	}
	return $style_string;
}


/**
 * Renders the news ticker block on the server-side.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 * @return string Returns the HTML content for the news ticker.
 */
function render_news_ticker_block( $attributes, $content, $block ) {
	// Note: Default attribute merging is handled by register_block_type before this callback is invoked.
    // So, $attributes here should already have defaults applied if they were missing.

    $default_attributes_file = dirname(__DIR__) . '/build/block.json'; // Adjusted path if this file is in includes/
    $defaults = [];
    if (file_exists($default_attributes_file)) {
        $block_json_content = json_decode(file_get_contents($default_attributes_file), true);
        if (isset($block_json_content['attributes'])) {
            foreach ($block_json_content['attributes'] as $attr_name => $attr_props) {
                if (isset($attr_props['default'])) {
                    $defaults[$attr_name] = $attr_props['default'];
                }
            }
        }
    }

	$attributes = wp_parse_args( $attributes, $defaults ); // Still good to ensure all top-level keys are there.

    // Ensure nested defaults are applied correctly, especially for tickerStyles and queryOptions
    if (isset($defaults['tickerStyles']) && is_array($defaults['tickerStyles'])) {
        $attributes['tickerStyles'] = wp_parse_args(isset($attributes['tickerStyles']) && is_array($attributes['tickerStyles']) ? $attributes['tickerStyles'] : [], $defaults['tickerStyles']);
    } else {
        // If no defaults in block.json for tickerStyles (should not happen), ensure it's an array
        $attributes['tickerStyles'] = isset($attributes['tickerStyles']) && is_array($attributes['tickerStyles']) ? $attributes['tickerStyles'] : [];
    }

    if (isset($defaults['queryOptions']) && is_array($defaults['queryOptions'])) {
        $attributes['queryOptions'] = wp_parse_args(isset($attributes['queryOptions']) && is_array($attributes['queryOptions']) ? $attributes['queryOptions'] : [], $defaults['queryOptions']);
    } else {
        $attributes['queryOptions'] = isset($attributes['queryOptions']) && is_array($attributes['queryOptions']) ? $attributes['queryOptions'] : [];
    }

    $ticker_styles_attrs = $attributes['tickerStyles'];
    $query_options = $attributes['queryOptions'];
    $custom_content_items = !empty($query_options['customContent']) && is_array($query_options['customContent'])
                            ? $query_options['customContent']
                            : [];

    $container_styles_arr = [
        'background-color' => $ticker_styles_attrs['containerBackgroundColor'],
        'padding-top'      => $ticker_styles_attrs['containerPaddingTop'],
        'padding-right'    => $ticker_styles_attrs['containerPaddingRight'],
        'padding-bottom'   => $ticker_styles_attrs['containerPaddingBottom'],
        'padding-left'     => $ticker_styles_attrs['containerPaddingLeft'],
        'border-width'     => $ticker_styles_attrs['containerBorderWidth'],
        'border-color'     => $ticker_styles_attrs['containerBorderColor'],
        'border-style'     => $ticker_styles_attrs['containerBorderStyle'] !== 'none' ? $ticker_styles_attrs['containerBorderStyle'] : '',
        'border-radius'    => $ticker_styles_attrs['containerBorderRadius'],
    ];
    $container_style = news_ticker_block_get_styles_string($container_styles_arr);

    $header_styles_arr = [
        'background-color' => $ticker_styles_attrs['headerBackgroundColor'],
        'padding-top'      => $ticker_styles_attrs['headerPaddingTop'],
        'padding-bottom'   => $ticker_styles_attrs['headerPaddingBottom'],
    ];
    $header_style = news_ticker_block_get_styles_string($header_styles_arr);

    $heading_styles_arr = [
        'color'         => $ticker_styles_attrs['headerTextColor'],
        'font-family'   => $ticker_styles_attrs['headerHeadingFontFamily'],
        'font-size'     => $ticker_styles_attrs['headerHeadingFontSize'],
        'font-weight'   => $ticker_styles_attrs['headerHeadingFontWeight'],
    ];
    $heading_style = news_ticker_block_get_styles_string($heading_styles_arr);

    $content_area_styles_arr = [
        'background-color' => $ticker_styles_attrs['contentBackgroundColor'],
    ];
    $content_area_style = news_ticker_block_get_styles_string($content_area_styles_arr);

    $item_styles_arr = [
        'color'         => $ticker_styles_attrs['contentItemTextColor'],
        'font-family'   => $ticker_styles_attrs['contentItemFontFamily'],
        'font-size'     => $ticker_styles_attrs['contentItemFontSize'],
        'line-height'   => $ticker_styles_attrs['contentItemLineHeight'],
    ];
    $item_style = news_ticker_block_get_styles_string($item_styles_arr);

    $button_styles_arr = [
        'background-color' => $ticker_styles_attrs['controlsButtonBackgroundColor'],
        'color'            => $ticker_styles_attrs['controlsButtonTextColor'],
        'border-color'     => $ticker_styles_attrs['controlsButtonBorderColor'],
    ];
    $button_style = news_ticker_block_get_styles_string($button_styles_arr);

	$wrapper_attributes_array = [
		'data-animation-type'   => esc_attr( $attributes['animationType'] ),
		'data-ticker-speed'     => esc_attr( $attributes['tickerSpeed'] ),
		'data-pause-on-hover'   => esc_attr( $attributes['pauseOnHover'] ? 'true' : 'false' ),
		'data-show-navigation'  => esc_attr( $attributes['showNavigation'] ? 'true' : 'false' ),
		'data-show-play-pause'  => esc_attr( $attributes['showPlayPause'] ? 'true' : 'false' ),
		'data-show-date'        => esc_attr( $attributes['showDate'] ? 'true' : 'false' ),
		'data-query-options'    => esc_attr( json_encode( $query_options ) ),
        'style'                 => $container_style,
	];
    if (in_array($attributes['animationType'], ['scroll', 'slide'])) {
        $wrapper_attributes_array['data-ticker-direction'] = esc_attr( $attributes['tickerDirection'] );
    }
	$wrapper_attributes = get_block_wrapper_attributes($wrapper_attributes_array);

    $news_items_html = '';
    $args = [
        'post_status' => 'publish',
        'posts_per_page' => 10,
        'ignore_sticky_posts' => true,
    ];
    if ( ! empty( $query_options['posts'] ) && is_array( $query_options['posts'] ) ) {
        $post_ids = wp_list_pluck( $query_options['posts'], 'id' );
        if (!empty($post_ids)) {
            $args['post__in'] = $post_ids;
            $post_types_from_selection = array_unique(wp_list_pluck( $query_options['posts'], 'type' ));
            $args['post_type'] = !empty($post_types_from_selection) ? $post_types_from_selection : ['any'];
            $args['orderby'] = 'post__in';
        }
    } else if ( ! empty( $query_options['postType'] ) ) {
        $args['post_type'] = $query_options['postType'];
        if ( ! empty( $query_options['selectedTaxonomy'] ) && ! empty( $query_options['selectedTerms'] ) && is_array( $query_options['selectedTerms'] ) ) {
            $args['tax_query'] = [
                [
                    'taxonomy' => $query_options['selectedTaxonomy'],
                    'field'    => 'term_id',
                    'terms'    => $query_options['selectedTerms'],
                ],
            ];
        }
    } else if (isset($defaults['queryOptions']['postType'])) { // Fallback to default postType if queryOptions.postType is empty
        $args['post_type'] = $defaults['queryOptions']['postType'];
    }

    if ( !empty($args['post__in']) || !empty($args['post_type']) ) {
        $ticker_query = new WP_Query( $args );
        if ( $ticker_query->have_posts() ) {
            ob_start();
            while ( $ticker_query->have_posts() ) {
                $ticker_query->the_post();
                $link_style_attr = !empty($ticker_styles_attrs['contentItemLinkColor']) ? 'style="color:' . esc_attr($ticker_styles_attrs['contentItemLinkColor']) . ';"' : '';
                ?>
                <div class="news-item news-item-queried" style="<?php echo $item_style; ?>" data-item-id="post-<?php echo get_the_ID(); ?>">
                    <a href="<?php echo esc_url( get_permalink() ); ?>" class="news-item-link" <?php echo $link_style_attr; ?>>
                        <?php echo esc_html( get_the_title() ); ?>
                    </a>
                </div>
                <?php
            }
            wp_reset_postdata();
            $news_items_html .= ob_get_clean();
        }
    }

	ob_start();
	?>
	<div <?php echo $wrapper_attributes; ?>>
		<div class="news-ticker-header" style="<?php echo $header_style; ?>">
			<?php if ( ! empty( $attributes['logoUrl'] ) ) : ?> <img src="<?php echo esc_url( $attributes['logoUrl'] ); ?>" alt="<?php esc_attr_e( 'News Channel Logo', 'news-ticker-block' ); ?>" class="news-ticker-logo"/> <?php endif; ?>
			<?php if ( ! empty( $attributes['breakingNewsHeading'] ) ) : ?> <h2 class="news-ticker-heading" style="<?php echo $heading_style; ?>"><?php echo esc_html( $attributes['breakingNewsHeading'] ); ?></h2> <?php endif; ?>
			<?php if ( $attributes['showLiveText'] && ! empty( $attributes['liveTextContent'] ) ) : ?> <span class="news-ticker-live-text"><?php echo esc_html( $attributes['liveTextContent'] ); ?></span> <?php endif; ?>
			<?php if ( $attributes['showDate'] ) : ?> <span class="news-ticker-date" style="<?php echo $heading_style; ?>"><?php /* Date by view.js */ ?></span> <?php endif; ?>
		</div>

		<div class="news-ticker-content" style="<?php echo $content_area_style; ?>">
            <?php if ( ! empty( $news_items_html ) ) : ?> <div class="news-items-queried-wrapper"><?php echo $news_items_html; ?></div> <?php endif; ?>
            <?php if ( ! empty( $custom_content_items ) ) : ?>
                <div class="news-items-custom-wrapper">
                    <?php foreach ( $custom_content_items as $item ) : ?>
                        <?php if ( isset( $item['text'] ) && ! empty( $item['text'] ) ) : ?>
                            <div class="news-item news-item-custom" style="<?php echo $item_style; ?>" data-item-id="<?php echo esc_attr( isset($item['id']) ? $item['id'] : uniqid('custom-') ); ?>">
                                <?php echo wp_kses_post( $item['text'] ); ?>
                            </div>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            <?php if ( empty( $news_items_html ) && empty( $custom_content_items ) ) : ?> <p class="news-items-no-content" style="<?php echo $item_style; ?>"><?php esc_html_e( 'No news items to display.', 'news-ticker-block' ); ?></p> <?php endif; ?>
		</div>

		<?php if ( $attributes['showNavigation'] ) : ?>
            <div class="news-ticker-navigation">
				<button type="button" class="news-ticker-prev-button" style="<?php echo $button_style; ?>" aria-label="<?php esc_attr_e( 'Previous Item', 'news-ticker-block' ); ?>">&lt;</button>
				<button type="button" class="news-ticker-next-button" style="<?php echo $button_style; ?>" aria-label="<?php esc_attr_e( 'Next Item', 'news-ticker-block' ); ?>">&gt;</button>
			</div>
        <?php endif; ?>
		<?php if ( $attributes['showPlayPause'] ) : ?>
            <div class="news-ticker-controls">
				<button type="button" class="news-ticker-play-pause-button" style="<?php echo $button_style; ?>" aria-label="<?php esc_attr_e( 'Play/Pause Ticker', 'news-ticker-block' ); ?>"><?php esc_html_e( 'Pause', 'news-ticker-block' ); ?></button>
			</div>
		<?php endif; ?>
	</div>
	<?php
	return ob_get_clean();
}
