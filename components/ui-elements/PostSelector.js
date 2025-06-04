import { __ } from '@wordpress/i18n';
import { TextControl, Spinner, CheckboxControl, Button, ExternalLink } from '@wordpress/components';

export default function PostSelector({
    searchTerm, onSearchTermChange,
    searchResults, isLoadingSearchResults,
    selectedPosts, onPostSelectionChange, onClearSelectedPosts
}) {
    return (
        <div className="news-ticker-post-selection">
            <h4>{__('Select Specific Posts', 'news-ticker-block')}</h4>
            <p><small>{__('Overrides Post Type/Taxonomy if any posts are selected. Search by title below.', 'news-ticker-block')}</small></p>

            <TextControl
                label={__('Search Posts by Title', 'news-ticker-block')}
                value={searchTerm}
                onChange={onSearchTermChange}
                placeholder={__('Type to search...', 'news-ticker-block')}
            />
            {isLoadingSearchResults && <Spinner />}
            {(!isLoadingSearchResults && searchResults && searchResults.length > 0) && (
                <ul className="news-ticker-search-results">
                    {searchResults.map((post) => (
                        <li key={post.id}>
                            <CheckboxControl
                                label={`${post.title.rendered} (ID: ${post.id}, Type: ${post.type})`}
                                checked={selectedPosts.some(p => p.id === post.id)}
                                onChange={(isChecked) => {
                                    let newSelectedPosts = [...selectedPosts];
                                    if (isChecked) {
                                        if (!newSelectedPosts.some(p => p.id === post.id)) {
                                            newSelectedPosts.push({ id: post.id, title: post.title.rendered, type: post.type });
                                        }
                                    } else {
                                        newSelectedPosts = newSelectedPosts.filter(p => p.id !== post.id);
                                    }
                                    onPostSelectionChange(newSelectedPosts);
                                }}
                            />
                            {post.link && <ExternalLink href={post.link}>{__('View', 'news-ticker-block')}</ExternalLink>}
                        </li>
                    ))}
                </ul>
            )}
            {(!isLoadingSearchResults && searchTerm && searchResults && searchResults.length === 0) && (
                <p>{__('No posts found matching your search.', 'news-ticker-block')}</p>
            )}

            {selectedPosts.length > 0 && (
                <div className="news-ticker-selected-items"> {/* Changed class for consistency */}
                    <strong>{__('Selected Posts:', 'news-ticker-block')}</strong>
                    <ul>
                        {selectedPosts.map((post) => (
                            <li key={post.id}>
                                {post.title} (ID: {post.id})&nbsp;
                                <Button isLink isDestructive onClick={() => {
                                    onPostSelectionChange(selectedPosts.filter(p => p.id !== post.id));
                                }}>
                                    {__('Remove', 'news-ticker-block')}
                                </Button>
                            </li>
                        ))}
                    </ul>
                    <Button isSecondary onClick={onClearSelectedPosts}>
                        {__('Clear All Selected Posts', 'news-ticker-block')}
                    </Button>
                </div>
            )}
        </div>
    );
}
