import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import { usePosts, useTaxonomyTerms, useTaxonomies } from '../hooks/useWordPressData';

/**
 * News Ticker Preview Component
 * Displays the news ticker preview in the editor
 */
export function NewsTickerPreview({ attributes }) {
    const { postType, postsToShow, orderby, order, selectedTerms, includePosts } = attributes;
    
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

    return (
        <div className="news-ticker-container">
            {posts === null && (
                <p>{__('Loading posts...', 'news-ticker-for-gutenberg')}</p>
            )}

            {posts === false && (
                <p>{__('Error loading posts. Please try again.', 'news-ticker-for-gutenberg')}</p>
            )}

            <div className="news-ticker-content">
                {posts && Array.isArray(posts) && posts.length > 0 ? (
                    <ul className="news-ticker-list">
                        {posts.map((post) => (
                            <li key={post.id} className="news-ticker-item">
                                <a href={post.link} target="_blank" rel="noopener noreferrer">
                                    {decodeEntities(post.title?.rendered || post.title || __('Untitled', 'news-ticker-for-gutenberg'))}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : postType ? (
                    <p>{__('No posts found for this post type.', 'news-ticker-for-gutenberg')}</p>
                ) : (
                    <p>{__('Please select a post type to display posts.', 'news-ticker-for-gutenberg')}</p>
                )}
            </div>
        </div>
    );
} 