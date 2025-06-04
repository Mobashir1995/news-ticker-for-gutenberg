<?php
/**
 * News Ticker Block Server-Side Rendering Logic.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

function news_ticker_block_get_styles_string( $styles ) {
	$style_string = '';
	foreach ( $styles as $property => $value ) {
		if ( ! empty( $value ) ) {
            $property = preg_replace( '/[^a-zA-Z0-9-]/', '', $property );
			$style_string .= esc_attr( $property ) . ':' . esc_attr( $value ) . ';';
		}
	}
	return $style_string;
}

function render_news_ticker_block( $attributes, $content, $block ) {
    // --- 1. Load block.json to get attribute defaults ---
    $block_json_path = dirname(__DIR__) . '/build/block.json'; // Assumes this file is in 'includes'
    $default_attributes_from_json = [];
    if (file_exists($block_json_path)) {
        $block_json_content = file_get_contents( $block_json_path );
        $block_json_data = json_decode( $block_json_content, true );
        if ( isset( $block_json_data['attributes'] ) ) {
            foreach ( $block_json_data['attributes'] as $attr_name => $attr_props ) {
                if ( isset( $attr_props['default'] ) ) {
                    $default_attributes_from_json[$attr_name] = $attr_props['default'];
                }
            }
        }
    }

    // --- 2. Merge attributes with defaults (deep merge for nested) ---
    // User attributes (from $attributes) should override block.json defaults if they exist.
    // Then, ensure all keys from block.json defaults are present if not in $attributes.
    $attributes = array_merge( $default_attributes_from_json, $attributes );

    if (isset($default_attributes_from_json['queryOptions']) && is_array($default_attributes_from_json['queryOptions'])) {
        $attributes['queryOptions'] = array_merge( $default_attributes_from_json['queryOptions'], isset($attributes['queryOptions']) && is_array($attributes['queryOptions']) ? $attributes['queryOptions'] : [] );
    } else {
        $attributes['queryOptions'] = isset($attributes['queryOptions']) && is_array($attributes['queryOptions']) ? $attributes['queryOptions'] : [];
    }

    if (isset($default_attributes_from_json['tickerStyles']) && is_array($default_attributes_from_json['tickerStyles'])) {
        $attributes['tickerStyles'] = array_merge( $default_attributes_from_json['tickerStyles'], isset($attributes['tickerStyles']) && is_array($attributes['tickerStyles']) ? $attributes['tickerStyles'] : [] );
    } else {
        $attributes['tickerStyles'] = isset($attributes['tickerStyles']) && is_array($attributes['tickerStyles']) ? $attributes['tickerStyles'] : [];
    }

    $ticker_styles_attrs = $attributes['tickerStyles'];
    $query_options = $attributes['queryOptions'];
    $custom_content_items = !empty($query_options['customContent']) && is_array($query_options['customContent'])
                            ? $query_options['customContent']
                            : [];

    // --- Construct Style Strings ---
    $container_styles_arr = [
        'background-color' => isset($ticker_styles_attrs['containerBackgroundColor']) ? $ticker_styles_attrs['containerBackgroundColor'] : null,
        'padding-top'      => isset($ticker_styles_attrs['containerPaddingTop']) ? $ticker_styles_attrs['containerPaddingTop'] : null,
        'padding-right'    => isset($ticker_styles_attrs['containerPaddingRight']) ? $ticker_styles_attrs['containerPaddingRight'] : null,
        'padding-bottom'   => isset($ticker_styles_attrs['containerPaddingBottom']) ? $ticker_styles_attrs['containerPaddingBottom'] : null,
        'padding-left'     => isset($ticker_styles_attrs['containerPaddingLeft']) ? $ticker_styles_attrs['containerPaddingLeft'] : null,
        'border-width'     => isset($ticker_styles_attrs['containerBorderWidth']) ? $ticker_styles_attrs['containerBorderWidth'] : null,
        'border-color'     => isset($ticker_styles_attrs['containerBorderColor']) ? $ticker_styles_attrs['containerBorderColor'] : null,
        'border-style'     => (isset($ticker_styles_attrs['containerBorderStyle']) && $ticker_styles_attrs['containerBorderStyle'] !== 'none') ? $ticker_styles_attrs['containerBorderStyle'] : '',
        'border-radius'    => isset($ticker_styles_attrs['containerBorderRadius']) ? $ticker_styles_attrs['containerBorderRadius'] : null,
    ];
    $container_style = news_ticker_block_get_styles_string($container_styles_arr);

    $header_styles_arr = [
        'background-color' => isset($ticker_styles_attrs['headerBackgroundColor']) ? $ticker_styles_attrs['headerBackgroundColor'] : null,
        'padding-top'      => isset($ticker_styles_attrs['headerPaddingTop']) ? $ticker_styles_attrs['headerPaddingTop'] : null,
        'padding-bottom'   => isset($ticker_styles_attrs['headerPaddingBottom']) ? $ticker_styles_attrs['headerPaddingBottom'] : null,
    ];
    $header_style = news_ticker_block_get_styles_string($header_styles_arr);

    $heading_styles_arr = [
        'color'         => isset($ticker_styles_attrs['headerTextColor']) ? $ticker_styles_attrs['headerTextColor'] : null,
        'font-family'   => isset($ticker_styles_attrs['headerHeadingFontFamily']) ? $ticker_styles_attrs['headerHeadingFontFamily'] : null,
        'font-size'     => isset($ticker_styles_attrs['headerHeadingFontSize']) ? $ticker_styles_attrs['headerHeadingFontSize'] : null,
        'font-weight'   => isset($ticker_styles_attrs['headerHeadingFontWeight']) ? $ticker_styles_attrs['headerHeadingFontWeight'] : null,
    ];
    $heading_style = news_ticker_block_get_styles_string($heading_styles_arr);

    $content_area_styles_arr = [
        'background-color' => isset($ticker_styles_attrs['contentBackgroundColor']) ? $ticker_styles_attrs['contentBackgroundColor'] : null,
    ];
    $content_area_style = news_ticker_block_get_styles_string($content_area_styles_arr);

    $item_styles_arr = [
        'color'         => isset($ticker_styles_attrs['contentItemTextColor']) ? $ticker_styles_attrs['contentItemTextColor'] : null,
        'font-family'   => isset($ticker_styles_attrs['contentItemFontFamily']) ? $ticker_styles_attrs['contentItemFontFamily'] : null,
        'font-size'     => isset($ticker_styles_attrs['contentItemFontSize']) ? $ticker_styles_attrs['contentItemFontSize'] : null,
        'line-height'   => isset($ticker_styles_attrs['contentItemLineHeight']) ? $ticker_styles_attrs['contentItemLineHeight'] : null,
    ];
    $item_style = news_ticker_block_get_styles_string($item_styles_arr);

    $link_style_attr = '';
    if (isset($ticker_styles_attrs['contentItemLinkColor']) && !empty($ticker_styles_attrs['contentItemLinkColor'])) {
        $link_style_attr = 'style="color:' . esc_attr($ticker_styles_attrs['contentItemLinkColor']) . ';"';
    }

    $button_styles_arr = [
        'background-color' => isset($ticker_styles_attrs['controlsButtonBackgroundColor']) ? $ticker_styles_attrs['controlsButtonBackgroundColor'] : null,
        'color'            => isset($ticker_styles_attrs['controlsButtonTextColor']) ? $ticker_styles_attrs['controlsButtonTextColor'] : null,
        'border-color'     => isset($ticker_styles_attrs['controlsButtonBorderColor']) ? $ticker_styles_attrs['controlsButtonBorderColor'] : null,
    ];
    $button_style = news_ticker_block_get_styles_string($button_styles_arr);

	$wrapper_attributes_array = [
        'data-animation-type'   => esc_attr( isset($attributes['animationType']) ? $attributes['animationType'] : 'scroll' ),
		'data-ticker-speed'     => esc_attr( isset($attributes['tickerSpeed']) ? $attributes['tickerSpeed'] : 5 ),
		'data-pause-on-hover'   => esc_attr( (isset($attributes['pauseOnHover']) && $attributes['pauseOnHover']) ? 'true' : 'false' ),
		'data-show-navigation'  => esc_attr( (isset($attributes['showNavigation']) && $attributes['showNavigation']) ? 'true' : 'false' ),
		'data-show-play-pause'  => esc_attr( (isset($attributes['showPlayPause']) && $attributes['showPlayPause']) ? 'true' : 'false' ),
		'data-show-date'        => esc_attr( (isset($attributes['showDate']) && $attributes['showDate']) ? 'true' : 'false' ),
		'data-query-options'    => esc_attr( json_encode( $query_options ) ),
        'style'                 => $container_style,
    ];
    if (isset($attributes['animationType']) && in_array($attributes['animationType'], ['scroll', 'slide'])) {
        $wrapper_attributes_array['data-ticker-direction'] = esc_attr( isset($attributes['tickerDirection']) ? $attributes['tickerDirection'] : 'left' );
    }
	$wrapper_attributes = get_block_wrapper_attributes($wrapper_attributes_array);

    $news_items_html = '';
    $args = [
        'post_status'         => 'publish',
        'posts_per_page'      => isset($query_options['postsPerPage']) ? intval($query_options['postsPerPage']) : 10,
        'ignore_sticky_posts' => true,
        'orderby'             => 'date',
        'order'               => 'DESC',
    ];

    $has_specific_post_query = false;
    if ( ! empty( $query_options['posts'] ) && is_array( $query_options['posts'] ) ) {
        $post_ids = wp_list_pluck( $query_options['posts'], 'id' );
        $post_ids = array_filter( array_map( 'intval', $post_ids ) );
        if (!empty($post_ids)) {
            $args['post__in'] = $post_ids;
            $selected_post_types = array_unique( wp_list_pluck( $query_options['posts'], 'type' ) );
            $args['post_type'] = count($selected_post_types) > 0 ? $selected_post_types : ['any']; // Ensure it's an array, or 'any'
            if (count($selected_post_types) === 1) $args['post_type'] = $selected_post_types[0]; // if single type, not array
            $args['orderby'] = 'post__in';
            $has_specific_post_query = true;
        }
    }

    if ( !$has_specific_post_query && ! empty( $query_options['postType'] ) ) {
        $args['post_type'] = $query_options['postType'];
        if ( ! empty( $query_options['selectedTaxonomy'] ) && ! empty( $query_options['selectedTerms'] ) && is_array( $query_options['selectedTerms'] ) ) {
            $term_ids = array_filter( array_map( 'intval', $query_options['selectedTerms'] ) );
            if (!empty($term_ids)) {
                $args['tax_query'] = [
                    [
                        'taxonomy' => $query_options['selectedTaxonomy'],
                        'field'    => 'term_id',
                        'terms'    => $term_ids,
                    ],
                ];
            }
        }
    } elseif ( !$has_specific_post_query && isset($default_attributes_from_json['queryOptions']['postType']) ) {
        $args['post_type'] = $default_attributes_from_json['queryOptions']['postType'];
    }


    $queried_posts_count = 0;
    if ( !empty($args['post__in']) || !empty($args['post_type']) ) {
        $ticker_query = new WP_Query( $args );
        $queried_posts_count = $ticker_query->post_count;
        if ( $ticker_query->have_posts() ) {
            ob_start();
            while ( $ticker_query->have_posts() ) {
                $ticker_query->the_post();
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
			<?php if ( isset($attributes['showLiveText']) && $attributes['showLiveText'] && ! empty( $attributes['liveTextContent'] ) ) : ?> <span class="news-ticker-live-text"><?php echo esc_html( $attributes['liveTextContent'] ); ?></span> <?php endif; ?>
			<?php if ( isset($attributes['showDate']) && $attributes['showDate'] ) : ?> <span class="news-ticker-date" style="<?php echo $heading_style; ?>"></span> <?php endif; ?>
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
            <?php if ( empty( $news_items_html ) && empty( $custom_content_items ) ) : ?>
                <p class="news-items-no-content" style="<?php echo $item_style; ?>">
                    <?php esc_html_e( 'No news items to display.', 'news-ticker-block' ); ?>
                </p>
            <?php endif; ?>
		</div>
        <?php if ( isset($attributes['showNavigation']) && $attributes['showNavigation'] ) : ?>
            <div class="news-ticker-navigation">
				<button type="button" class="news-ticker-prev-button" style="<?php echo $button_style; ?>" aria-label="<?php esc_attr_e( 'Previous Item', 'news-ticker-block' ); ?>">&lt;</button>
				<button type="button" class="news-ticker-next-button" style="<?php echo $button_style; ?>" aria-label="<?php esc_attr_e( 'Next Item', 'news-ticker-block' ); ?>">&gt;</button>
			</div>
        <?php endif; ?>
		<?php if ( isset($attributes['showPlayPause']) && $attributes['showPlayPause'] ) : ?>
            <div class="news-ticker-controls">
				<button type="button" class="news-ticker-play-pause-button" style="<?php echo $button_style; ?>" aria-label="<?php esc_attr_e( 'Play/Pause Ticker', 'news-ticker-block' ); ?>"><?php esc_html_e( 'Pause', 'news-ticker-block' ); ?></button>
			</div>
		<?php endif; ?>
	</div>
	<?php
	return ob_get_clean();
}
