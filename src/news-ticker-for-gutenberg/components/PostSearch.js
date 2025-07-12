import { __ } from '@wordpress/i18n';
import { TextControl, Button } from '@wordpress/components';
import { decodeEntities } from '@wordpress/html-entities';
import { usePostSearch } from '../hooks/usePostSearch';
import { useClickOutside } from '../hooks/useClickOutside';

/**
 * Post Search Component
 * Handles post search functionality with dropdown results
 */
export function PostSearch({ attributes, setAttributes }) {
    const { postType, selectedTerms, includePosts } = attributes;
    
    const {
        searchQuery,
        searchResults,
        isSearchLoading,
        hasMoreResults,
        showSearchDropdown,
        setShowSearchDropdown,
        handleSearchQueryChange,
        handleLoadMore
    } = usePostSearch(postType, selectedTerms);

    const searchContainerRef = useClickOutside(
        () => setShowSearchDropdown(false),
        showSearchDropdown
    );

    const handleAddPost = (postId) => {
        if (!includePosts) {
            setAttributes({ includePosts: [postId] });
        } else if (!includePosts.includes(postId)) {
            setAttributes({ includePosts: [...includePosts, postId] });
        }
        setShowSearchDropdown(false);
    };

    return (
        <div className="post-search-container" ref={searchContainerRef}>
            <TextControl
                label={__('Search Posts', 'news-ticker-for-gutenberg')}
                value={searchQuery}
                onChange={handleSearchQueryChange}
                placeholder={__('Type to search posts...', 'news-ticker-for-gutenberg')}
            />
            
            {/* Search Results Dropdown */}
            {showSearchDropdown && searchQuery && searchQuery.length >= 2 && (
                <div className="search-results-dropdown">
                    {isSearchLoading ? (
                        <div className="search-loading">
                            <div className="spinner"></div>
                            {__('Searching...', 'news-ticker-for-gutenberg')}
                        </div>
                    ) : searchResults && searchResults.length > 0 ? (
                        <>
                            {searchResults.map(post => (
                                <div 
                                    key={post.id} 
                                    className="search-result-item"
                                    onClick={() => handleAddPost(post.id)}
                                >
                                    <span className="post-title">
                                        {decodeEntities(post.title?.rendered || post.title)}
                                    </span>
                                    <span className="post-date">
                                        {new Date(post.date).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                            {hasMoreResults && (
                                <div className="load-more-container">
                                    <Button
                                        isSmall
                                        variant="secondary"
                                        className="load-more-button"
                                        onClick={handleLoadMore}
                                    >
                                        {__('Load More', 'news-ticker-for-gutenberg')}
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="no-results">
                            {__('No posts found', 'news-ticker-for-gutenberg')}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 