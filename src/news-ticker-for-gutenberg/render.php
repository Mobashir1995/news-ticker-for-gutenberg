<?php
$post_type = $attributes['postType'] ?? 'post';
$posts_to_show = $attributes['postsToShow'] ?? 10;
$orderby = $attributes['orderby'] ?? 'date';
$order = $attributes['order'] ?? 'desc';
$selected_terms = $attributes['selectedTerms'] ?? [];
$include_posts = $attributes['includePosts'] ?? [];

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
    $query_args['posts_per_page'] = -1; // Get all selected posts
} else {
    $query_args['posts_per_page'] = $posts_to_show;
    
    // Add taxonomy filters if terms are selected
    if (!empty($selected_terms) && is_array($selected_terms)) {
        foreach ($selected_terms as $taxonomy => $term_ids) {
            if (!empty($term_ids) && is_array($term_ids)) {
                $query_args['tax_query'][] = array(
                    'taxonomy' => $taxonomy,
                    'field' => 'term_id',
                    'terms' => $term_ids,
                );
            }
        }
    }
}

$posts = get_posts($query_args);
?>

<div <?php echo get_block_wrapper_attributes(); ?> class="news-ticker-container">
    <div class="news-ticker-content">
        <?php if (!empty($posts)) : ?>
            <ul class="news-ticker-list">
                <?php foreach ($posts as $post) : ?>
                    <li class="news-ticker-item">
                        <a href="<?php echo esc_url(get_permalink($post->ID)); ?>" target="_blank" rel="noopener noreferrer">
                            <?php echo esc_html($post->post_title); ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php else : ?>
            <p><?php _e('No posts found.', 'news-ticker-for-gutenberg'); ?></p>
        <?php endif; ?>
    </div>
</div>