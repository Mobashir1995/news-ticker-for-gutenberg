import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import { useMemo } from '@wordpress/element';
import { usePosts, useTaxonomyTerms, useTaxonomies } from '../hooks/useWordPressData';

/**
 * News Ticker Preview Component
 * Displays the news ticker preview in the editor
 */
export function NewsTickerPreview({ attributes }) {
    const { heading, postType, postsToShow, orderby, order, selectedTerms, includePosts } = attributes;
    
    const taxonomies = useTaxonomies(postType);
    const taxonomyTerms = useTaxonomyTerms(taxonomies);
    
    const posts = usePosts({
        postType,
        postsToShow,
        orderby,
        order,
        selectedTerms,
        includePosts,
        taxonomyTerms
    });

    const marqueePosts = useMemo(() => {
        if (!Array.isArray(posts) || posts.length === 0) {
            return [];
        }

        // Duplicate once to create a seamless scrolling loop.
        return [...posts, ...posts];
    }, [posts]);

    const getCategoryLabel = (post) => {
        const firstCategory = post?.categories?.[0];

        if (firstCategory && typeof firstCategory === 'object' && firstCategory.name) {
            return firstCategory.name;
        }

        return '';
    };

    return (
        <div className="news-ticker-container">
            <h2 className="news-ticker-heading">{heading}</h2>
            {posts === null && (
                <p>{__('Loading posts...', 'news-ticker-for-gutenberg')}</p>
            )}

            {posts === false && (
                <p>{__('Error loading posts. Please try again.', 'news-ticker-for-gutenberg')}</p>
            )}

            <div className="news-ticker-content">
                {posts && Array.isArray(posts) && posts.length > 0 ? (
                    <div className="ticker-wrap">
                        <div className="ticker" data-effect="marquee">
                            <div className="ticker-btns">
                                <button className="ticker-btn" data-prev type="button" aria-label="Previous item">Prev</button>
                                <button className="ticker-btn" data-play type="button" aria-label="Pause ticker">Pause</button>
                                <button className="ticker-btn" data-next type="button" aria-label="Next item">Next</button>
                            </div>
                            <div className="ticker-viewport" data-viewport>
                                <div className="ticker-track" data-track>
                                    {marqueePosts.map((post, index) => {
                                        const categoryLabel = getCategoryLabel(post);

                                        return (
                                            <div
                                                key={`${post.id}-${index}`}
                                                className="ticker-item"
                                                aria-hidden={index >= posts.length}
                                            >
                                                {categoryLabel && <strong>{categoryLabel}:</strong>}
                                                <a href={post.link} target="_blank" rel="noopener noreferrer">
                                                    {decodeEntities(post.title?.rendered || post.title || __('Untitled', 'news-ticker-for-gutenberg'))}
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : postType ? (
                    <p>{__('No posts found for this post type.', 'news-ticker-for-gutenberg')}</p>
                ) : (
                    <p>{__('Please select a post type to display posts.', 'news-ticker-for-gutenberg')}</p>
                )}
            </div>
        </div>
    );
}