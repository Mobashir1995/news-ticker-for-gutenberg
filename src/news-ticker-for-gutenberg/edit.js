import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { TextControl, SelectControl, PanelBody, CheckboxControl, Button, ComboboxControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useRef, useEffect } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';

import './editor.css';

export default function Edit({ attributes, setAttributes }) {
    const { postType, postsToShow, orderby, order, selectedTerms, includePosts } = attributes;
    const [expandedTaxonomies, setExpandedTaxonomies] = useState({});
    const [taxonomySectionExpanded, setTaxonomySectionExpanded] = useState(false);
    const [selectedPostsExpanded, setSelectedPostsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchPage, setSearchPage] = useState(1);
    const [hasMoreResults, setHasMoreResults] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const searchContainerRef = useRef(null);

    const orderbyOptions = [
        { label: 'Date', value: 'date' },
        { label: 'Title', value: 'title' },
        { label: 'Menu Order', value: 'menu_order' },
        { label: 'Random', value: 'rand' }
    ];

    const orderOptions = [
        { label: 'Descending', value: 'desc' },
        { label: 'Ascending', value: 'asc' }
    ];

    const toggleTaxonomy = (taxonomySlug) => {
        setExpandedTaxonomies(prev => ({
            ...prev,
            [taxonomySlug]: !prev[taxonomySlug]
        }));
    };

    const toggleTaxonomySection = () => {
        setTaxonomySectionExpanded(!taxonomySectionExpanded);
    };

    const toggleSelectedPosts = () => {
        setSelectedPostsExpanded(!selectedPostsExpanded);
    };

    // Search posts for autocomplete
    const searchResults = useSelect(select => {
        if (!searchQuery || !postType || searchQuery.length < 2) {
            return [];
        }

        const results = select('core').getEntityRecords('postType', postType, {
            search: searchQuery,
            per_page: 10 * searchPage,
            status: 'publish',
            _embed: false
        }) || [];

        // Check if there are more results available
        const totalResults = select('core').getEntityRecords('postType', postType, {
            search: searchQuery,
            per_page: 10 * (searchPage + 1),
            status: 'publish',
            _embed: false
        }) || [];

        setHasMoreResults(totalResults.length > results.length);

        return results;
    }, [searchQuery, postType, searchPage]);

    // Check if search is loading
    const isSearchLoading = useSelect(select => {
        if (!searchQuery || !postType || searchQuery.length < 2) {
            return false;
        }
        return select('core/data').isResolving('core', 'getEntityRecords', ['postType', postType, {
            search: searchQuery,
            per_page: 10,
            status: 'publish',
            _embed: false
        }]);
    }, [searchQuery, postType]);

    // Get selected posts details
    const selectedPostsDetails = useSelect(select => {
        if (!includePosts || !Array.isArray(includePosts) || includePosts.length === 0) {
            return [];
        }

        return select('core').getEntityRecords('postType', postType, {
            include: includePosts,
            per_page: -1,
            status: 'publish',
            _embed: false
        }) || [];
    }, [includePosts, postType]);

    // Check if selected posts are loading
    const isSelectedPostsLoading = useSelect(select => {
        if (!includePosts || !Array.isArray(includePosts) || includePosts.length === 0) {
            return false;
        }
        return select('core/data').isResolving('core', 'getEntityRecords', ['postType', postType, {
            include: includePosts,
            per_page: -1,
            status: 'publish',
            _embed: false
        }]);
    }, [includePosts, postType]);

    const handleAddPost = (postId) => {
        if (!includePosts) {
            setAttributes({ includePosts: [postId] });
        } else if (!includePosts.includes(postId)) {
            setAttributes({ includePosts: [...includePosts, postId] });
        }
        setSearchQuery('');
        setShowSearchDropdown(false); // Hide dropdown when post is selected
        setSelectedPostsExpanded(true); // Keep selected posts box expanded when adding new post
    };

    const handleRemovePost = (postId) => {
        if (includePosts && includePosts.includes(postId)) {
            const newIncludePosts = includePosts.filter(id => id !== postId);
            setAttributes({ includePosts: newIncludePosts.length > 0 ? newIncludePosts : undefined });
        }
    };

    const handleLoadMore = () => {
        setSearchPage(prev => prev + 1);
    };

    const handleSearchQueryChange = (newQuery) => {
        setSearchQuery(newQuery);
        setSearchPage(1); // Reset pagination when search query changes
        setHasMoreResults(false);
        setShowSearchDropdown(newQuery.length >= 2); // Show dropdown when query is 2+ characters
        
        // Keep selected posts box expanded if there are selected posts
        if (includePosts && includePosts.length > 0) {
            setSelectedPostsExpanded(true);
        }
    };

    // Handle clicking outside the search dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowSearchDropdown(false);
            }
        };

        if (showSearchDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSearchDropdown]);

    const postTypes = useSelect( ( select ) => {
        const allPostTypes = select( 'core' ).getPostTypes({ per_page: -1 });
        // Filter for only viewable (public) post types and exclude media
        const filteredPostTypes = allPostTypes ? allPostTypes.filter(postType => 
            postType.viewable && postType.slug !== 'attachment'
        ) : [];
        
        // Format for SelectControl options
        return filteredPostTypes.map(postType => ({
            label: postType.name,
            value: postType.slug
        }));
    }, []);

    const taxonomies = useSelect( select => (
        select( 'core' ).getTaxonomies( { type: postType, per_page: -1 } )
    ), [postType]);


    // Fetch terms for each taxonomy
    const taxonomyTerms = useSelect( select => {
        if (!taxonomies || !Array.isArray(taxonomies)) return {};
        
        const terms = {};
        taxonomies.forEach(taxonomy => {
            terms[taxonomy.rest_base] = select('core').getEntityRecords('taxonomy', taxonomy.slug, {
                per_page: -1,
                hide_empty: false
            });
        });
        return terms;
    }, [taxonomies]);


    const posts = useSelect( select => {
        if (!postType) {
            return [];
        }

        // Build query parameters
        const queryParams = {
            per_page: postsToShow || 5,
            status: 'publish',
            orderby: orderby,
            order: order
        };

        // If specific posts are selected, include them
        if (includePosts && Array.isArray(includePosts) && includePosts.length > 0) {
            queryParams.include = includePosts;
            // Override per_page to get all selected posts
            // queryParams.per_page = -1;
        }

        // Add taxonomy filters if terms are selected
        if (selectedTerms && Object.keys(selectedTerms).length > 0) {
            Object.entries(selectedTerms).forEach(([taxonomySlug, termIds]) => {
                const validTaxonomies = taxonomyTerms?.[taxonomySlug]; // Ensure taxonomy exists and not include taxonomy from other post types
                if (validTaxonomies && termIds && Array.isArray(termIds) && termIds.length > 0) {
                    queryParams[taxonomySlug] = termIds.join(',');
                }
            });
        }
        

        return select( 'core' ).getEntityRecords( 'postType', postType, queryParams );
    }, [ postType, postsToShow, orderby, order, selectedTerms, includePosts ]);


   
    return(
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <TextControl
                        label="News Ticker for Gutenberg"
                        value=""
                    />
                </PanelBody>
                <PanelBody title={ __('Query Controls', 'news-ticker-for-gutenberg') }>
                    <SelectControl
                        label="Post Type"
                        value={postType}
                        options={postTypes}
                        onChange = { value => setAttributes({ postType: value }) }
                    />

                    <TextControl
                        label={ __('Posts to Show', 'news-ticker-for-gutenberg') }
                        type="number"
                        value={postsToShow}
                        onChange = { value => setAttributes({ postsToShow: value }) }
                    />

                    <SelectControl
                        label={ __('Order By', 'news-ticker-for-gutenberg') }
                        value={orderby}
                        options={orderbyOptions}
                        onChange = { value => setAttributes({ orderby: value }) }
                    />

                    <SelectControl
                        label={ __('Order', 'news-ticker-for-gutenberg') }
                        value={order}
                        options={orderOptions}
                        onChange = { value => setAttributes({ order: value }) }
                    />

                    {/* Taxonomy and Terms Selectors */}
                    {taxonomies && Array.isArray(taxonomies) && taxonomies.length > 0 && (
                        <div className="taxonomy-selectors">
                            <div className="taxonomy-section-header" onClick={toggleTaxonomySection}>
                                <div className="taxonomy-section-title">
                                    <span className="taxonomy-icon">🏷️</span>
                                    { __('Filter by Taxonomies', 'news-ticker-for-gutenberg') }
                                    {selectedTerms && Object.keys(selectedTerms).some(key => selectedTerms[key] && selectedTerms[key].length > 0) && (
                                        <span className="section-indicator">
                                            <span className="indicator-dot"></span>
                                        </span>
                                    )}
                                </div>
                                <Button
                                    isSmall
                                    variant="tertiary"
                                    className="taxonomy-section-toggle"
                                >
                                    {taxonomySectionExpanded ? '−' : '+'}
                                </Button>
                            </div>
                            
                            {taxonomySectionExpanded && (
                                <div className="taxonomy-section-content">
                                    {taxonomies.map(taxonomy => {
                                        const terms = taxonomyTerms[taxonomy.rest_base];
                                        const taxonomySelectedTerms = selectedTerms[taxonomy.rest_base] || [];
                                        const isExpanded = expandedTaxonomies[taxonomy.rest_base];
                                        
                                        return (
                                            <div key={taxonomy.rest_base} className="taxonomy-group">
                                                <div className="taxonomy-header">
                                                    <h5>
                                                        {taxonomy.name}
                                                        {taxonomySelectedTerms.length > 0 && (
                                                            <span className="selected-count">
                                                                ({taxonomySelectedTerms.length} selected)
                                                            </span>
                                                        )}
                                                    </h5>
                                                    <Button
                                                        isSmall
                                                        variant="tertiary"
                                                        onClick={() => toggleTaxonomy(taxonomy.rest_base)}
                                                        className="taxonomy-toggle"
                                                    >
                                                        {isExpanded ? '−' : '+'}
                                                    </Button>
                                                </div>
                                                {isExpanded && (
                                                    <>
                                                        {terms && Array.isArray(terms) && terms.length > 0 ? (
                                                            <div className="terms-checkboxes">
                                                                {terms.map(term => (
                                                                    <CheckboxControl
                                                                        key={term.id}
                                                                        label={term.name}
                                                                        checked={taxonomySelectedTerms.includes(term.id)}
                                                                        onChange={(checked) => {
                                                                            const newSelectedTerms = checked 
                                                                                ? [...taxonomySelectedTerms, term.id]
                                                                                : taxonomySelectedTerms.filter(id => id !== term.id);
                                                                            setAttributes({ 
                                                                                selectedTerms: {
                                                                                    ...selectedTerms,
                                                                                    [taxonomy.rest_base]: newSelectedTerms
                                                                                }
                                                                            });
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p>{ __('No terms found for this taxonomy.', 'news-ticker-for-gutenberg') }</p>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Include Posts Section */}
                    <div className="include-posts-section">
                        <h4 className="include-posts-title">
                            <span className="include-posts-icon">📝</span>
                            { __('Include Specific Posts', 'news-ticker-for-gutenberg') }
                        </h4>
                        
                        {/* Search Input */}
                        <div className="post-search-container" ref={searchContainerRef}>
                            <TextControl
                                label={ __('Search Posts', 'news-ticker-for-gutenberg') }
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                                placeholder={ __('Type to search posts...', 'news-ticker-for-gutenberg') }
                            />
                            
                            {/* Search Results Dropdown */}
                            {showSearchDropdown && searchQuery && searchQuery.length >= 2 && (
                                <div className="search-results-dropdown">
                                    {isSearchLoading ? (
                                        <div className="search-loading">
                                            <div className="spinner"></div>
                                            { __('Searching...', 'news-ticker-for-gutenberg') }
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
                                                        { __('Load More', 'news-ticker-for-gutenberg') }
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="no-results">
                                            { __('No posts found', 'news-ticker-for-gutenberg') }
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Selected Posts List */}
                        {selectedPostsDetails && (
                            <div className="selected-posts-container">
                                <div className="selected-posts-header" onClick={toggleSelectedPosts}>
                                    <h5 className="selected-posts-title">
                                        { __('Selected Posts', 'news-ticker-for-gutenberg') }
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
                                                <span>{ __('Updating selected posts...', 'news-ticker-for-gutenberg') }</span>
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
                        )}
                    </div>
                    
                </PanelBody>
            </InspectorControls>
            <div {...useBlockProps()}>
                <div className="news-ticker-container">

                { posts === null && <p>{ __('Loading posts...', 'news-ticker-for-gutenberg') }</p>}
                

                { posts === false && <p>{ __('Error loading posts. Please try again.', 'news-ticker-for-gutenberg') }</p> }

                    <div className="news-ticker-content">
                        { posts && Array.isArray( posts ) && posts.length > 0 ? (
                            <ul className="news-ticker-list">
                                { posts.map( ( post ) => (
                                    <li key={ post.id } className="news-ticker-item">
                                        <a href={ post.link } target="_blank" rel="noopener noreferrer">
                                            { decodeEntities(post.title?.rendered || post.title || __('Untitled', 'news-ticker-for-gutenberg')) }
                                        </a>
                                    </li>
                                ) ) }
                            </ul>
                        ) : postType ? (
                            <p>{ __('No posts found for this post type.', 'news-ticker-for-gutenberg') }</p>
                        ) : (
                            <p>{ __('Please select a post type to display posts.', 'news-ticker-for-gutenberg') }</p>
                        ) }
                    </div>
                </div>
            </div>
        </>
    )
}