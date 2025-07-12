import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { useSelectedPosts } from '../hooks/useWordPressData';

/**
 * Selected Posts Component
 * Displays and manages the list of selected posts
 */
export function SelectedPosts({ attributes, setAttributes }) {
    const { includePosts, postType } = attributes;
    const [selectedPostsExpanded, setSelectedPostsExpanded] = useState(false);
    
    const { selectedPostsDetails, isSelectedPostsLoading } = useSelectedPosts(includePosts, postType);

    const toggleSelectedPosts = () => {
        setSelectedPostsExpanded(!selectedPostsExpanded);
    };

    const handleRemovePost = (postId) => {
        if (includePosts && includePosts.includes(postId)) {
            const newIncludePosts = includePosts.filter(id => id !== postId);
            setAttributes({ includePosts: newIncludePosts.length > 0 ? newIncludePosts : undefined });
        }
    };

    if (!selectedPostsDetails) {
        return null;
    }

    return (
        <div className="selected-posts-container">
            <div className="selected-posts-header" onClick={toggleSelectedPosts}>
                <h5 className="selected-posts-title">
                    {__('Selected Posts', 'news-ticker-for-gutenberg')}
                    <span className="selected-count">({selectedPostsDetails.length})</span>
                    {isSelectedPostsLoading && (
                        <span className="loading-indicator">
                            <div className="mini-spinner"></div>
                        </span>
                    )}
                </h5>
                <Button
                    isSmall
                    variant="tertiary"
                    className="selected-posts-toggle"
                >
                    {selectedPostsExpanded ? '−' : '+'}
                </Button>
            </div>
            
            {selectedPostsExpanded && (
                <div className="selected-posts-content">
                    {isSelectedPostsLoading ? (
                        <div className="selected-posts-loading">
                            <div className="spinner"></div>
                            <span>{__('Updating selected posts...', 'news-ticker-for-gutenberg')}</span>
                        </div>
                    ) : (
                        <div className="selected-posts-list">
                            {selectedPostsDetails.map(post => (
                                <div key={post.id} className="selected-post-item">
                                    <div className="selected-post-info">
                                        <span className="selected-post-title">
                                            {decodeEntities(post.title?.rendered || post.title)}
                                        </span>
                                        <span className="selected-post-date">
                                            {new Date(post.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <Button
                                        isSmall
                                        variant="tertiary"
                                        className="remove-post-button"
                                        onClick={() => handleRemovePost(post.id)}
                                    >
                                        ✕
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 