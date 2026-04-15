<?php
$post_type = $attributes['postType'] ?? 'post';
$posts_to_show = $attributes['postsToShow'] ?? 10;
$orderby = $attributes['orderby'] ?? 'date';
$order = $attributes['order'] ?? 'desc';
$selected_terms = $attributes['selectedTerms'] ?? [];
$include_posts = $attributes['includePosts'] ?? [];
$heading = $attributes['heading'] ?? '';

// Build query arguments
$query_args = array(
    'post_type' => $post_type,
    'post_status' => 'publish',
    'orderby' => $orderby,
    'order' => $order,
);

// If specific posts are selected, include them
if (!empty($include_posts) && is_array($include_posts)) {
    $query_args['post__in'] = $include_posts;
    $query_args['orderby'] = 'post__in';
    $query_args['posts_per_page'] = -1; // Get all selected posts
} else {
    $query_args['posts_per_page'] = $posts_to_show;
    
    // Add taxonomy filters if terms are selected
    if (!empty($selected_terms) && is_array($selected_terms)) {
        $tax_queries = array();
        
        foreach ($selected_terms as $taxonomy => $term_ids) {
            if (!empty($term_ids) && is_array($term_ids)) {
                $tax_queries[] = array(
                    'taxonomy' => $taxonomy,
                    'field' => 'term_id',
                    'terms' => $term_ids,
                    'operator' => 'AND'
                );
            }
        }
        
        if (!empty($tax_queries)) {
            $query_args['tax_query'] = array_merge(
                array('relation' => 'AND'),
                $tax_queries
            );
        }
    }
}

$posts = get_posts($query_args);
$marquee_posts = !empty($posts) ? array_merge($posts, $posts) : array();
?>

<div <?php echo get_block_wrapper_attributes(array('class' => 'news-ticker-container')); ?>>
    <?php if (!empty($heading)) : ?>
        <h2 class="news-ticker-heading"><?php echo esc_html($heading); ?></h2>
    <?php endif; ?>

    <div class="news-ticker-content">
        <?php if (!empty($posts) && is_array($posts)) : ?>
            <div class="ticker-wrap">
                <div class="ticker" data-effect="marquee">
                    <div class="ticker-btns">
                        <button class="ticker-btn" data-prev type="button" aria-label="<?php esc_attr_e('Previous item', 'news-ticker-for-gutenberg'); ?>"><?php esc_html_e('Prev', 'news-ticker-for-gutenberg'); ?></button>
                        <button class="ticker-btn" data-play type="button" aria-label="<?php esc_attr_e('Pause ticker', 'news-ticker-for-gutenberg'); ?>"><?php esc_html_e('Pause', 'news-ticker-for-gutenberg'); ?></button>
                        <button class="ticker-btn" data-next type="button" aria-label="<?php esc_attr_e('Next item', 'news-ticker-for-gutenberg'); ?>"><?php esc_html_e('Next', 'news-ticker-for-gutenberg'); ?></button>
                    </div>

                    <div class="ticker-viewport" data-viewport>
                        <div class="ticker-track" data-track>
                            <?php foreach ($marquee_posts as $index => $post) : ?>
                                <?php
                                $title = get_the_title($post->ID);
                                $category_label = '';
                                $categories = get_the_terms($post->ID, 'category');
                                if (!is_wp_error($categories) && !empty($categories) && isset($categories[0]->name)) {
                                    $category_label = $categories[0]->name;
                                }
                                ?>
                                <div class="ticker-item"<?php echo ($index >= count($posts)) ? ' aria-hidden="true"' : ''; ?>>
                                    <?php if ($category_label !== '') : ?>
                                        <strong><?php echo esc_html($category_label); ?>:</strong>
                                    <?php endif; ?>
                                    <a href="<?php echo esc_url(get_permalink($post->ID)); ?>" target="_blank" rel="noopener noreferrer">
                                        <?php echo esc_html(!empty($title) ? $title : __('Untitled', 'news-ticker-for-gutenberg')); ?>
                                    </a>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>
        <?php elseif (!empty($post_type)) : ?>
            <p><?php esc_html_e('No posts found for this post type.', 'news-ticker-for-gutenberg'); ?></p>
        <?php else : ?>
            <p><?php esc_html_e('Please select a post type to display posts.', 'news-ticker-for-gutenberg'); ?></p>
        <?php endif; ?>
    </div>
</div>