import { __ } from '@wordpress/i18n';
import { PostSearch } from './PostSearch';
import { SelectedPosts } from './SelectedPosts';

/**
 * Include Posts Section Component
 * Wrapper component that combines post search and selected posts functionality
 */
export function IncludePostsSection({ attributes, setAttributes }) {
    return (
        <div className="include-posts-section">
            <h4 className="include-posts-title">
                <span className="include-posts-icon">📝</span>
                {__('Include Specific Posts', 'news-ticker-for-gutenberg')}
            </h4>
            
            <PostSearch attributes={attributes} setAttributes={setAttributes} />
            <SelectedPosts attributes={attributes} setAttributes={setAttributes} />
        </div>
    );
} 