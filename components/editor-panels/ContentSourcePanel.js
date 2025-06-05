import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';

// Import Sub-components
import PostSelector from '../ui-elements/PostSelector.js';
import TermSelector from '../ui-elements/TermSelector.js';
import CustomContentRepeater from '../ui-elements/CustomContentRepeater.js';

export default function ContentSourcePanel({ attributes, setAttributes }) {
    const { queryOptions } = attributes;

    // Robust initialization of queryOptions and its nested properties
    // Fallback to an empty object for defaultQueryOpts if attributes.queryOptions.default is not defined
    const defaultQueryOptsFromBlock = typeof attributes.queryOptions.default !== 'undefined' ? attributes.queryOptions.default : {};

    const currentQueryOptions = {
        postType: queryOptions?.postType || defaultQueryOptsFromBlock.postType || 'post',
        selectedTaxonomy: queryOptions?.selectedTaxonomy || defaultQueryOptsFromBlock.selectedTaxonomy || '',
        selectedTerms: Array.isArray(queryOptions?.selectedTerms) ? queryOptions.selectedTerms : (defaultQueryOptsFromBlock.selectedTerms || []),
        posts: Array.isArray(queryOptions?.posts) ? queryOptions.posts : (defaultQueryOptsFromBlock.posts || []),
        customContent: Array.isArray(queryOptions?.customContent) ? queryOptions.customContent : (defaultQueryOptsFromBlock.customContent || []),
    };


    // --- State for Post Search ---
	const [searchTermPosts, setSearchTermPosts] = useState('');
	const [debouncedSearchTermPosts, setDebouncedSearchTermPosts] = useState('');
	useEffect(() => { const h = setTimeout(() => setDebouncedSearchTermPosts(searchTermPosts), 500); return () => clearTimeout(h); }, [searchTermPosts]);

	// --- State for Term Search ---
	const [searchTermTerms, setSearchTermTerms] = useState('');
	const [debouncedSearchTermTerms, setDebouncedSearchTermTerms] = useState('');
	useEffect(() => { const h = setTimeout(() => setDebouncedSearchTermTerms(searchTermTerms), 500); return () => clearTimeout(h); }, [searchTermTerms]);

    // --- Fetch public post types ---
	const { postTypes: availablePostTypes, isLoadingPostTypes } = useSelect((select) => {
		const { getPostTypes } = select(coreStore);
		const allPostTypes = getPostTypes({ per_page: -1 });
		const filtered = allPostTypes ? allPostTypes.filter(
			(type) => type.viewable && type.show_in_nav_menus &&
			!['attachment', 'nav_menu_item', 'wp_template', 'wp_template_part', 'wp_navigation', 'wp_block'].includes(type.slug)
		) : [];
		return {
            postTypes: filtered.map((type) => ({ label: type.name, value: type.slug })),
            isLoadingPostTypes: !allPostTypes
        };
	}, []);
    // Ensure a default value for SelectControl if postType is somehow undefined in currentQueryOptions
    const currentPostTypeValue = currentQueryOptions.postType || '';
	const postTypeOptionsForSelect = isLoadingPostTypes ?
        [{ label: __('Loading...', 'news-ticker-block'), value: '' }] :
        (availablePostTypes.length > 0 ?
            [{label: __('Select Post Type', 'news-ticker-block'), value: ''}, ...availablePostTypes] : // Add "Select Post Type"
            [{ label: __('No public post types found', 'news-ticker-block'), value: '' }]);


    // --- Fetch Taxonomies for the selected Post Type ---
	const { taxonomies, isLoadingTaxonomies } = useSelect((select) => {
        const { getTaxonomies } = select(coreStore);
		if (!currentQueryOptions.postType) return { taxonomies: [], isLoadingTaxonomies: false };
		const allTax = getTaxonomies({ type: currentQueryOptions.postType, per_page: -1, context: 'view' });
        const filtered = allTax ? allTax.filter( tax => tax.visibility.show_ui && tax.slug !== 'post_format') : [];
		return {
            taxonomies: filtered.map(tax => ({ label: tax.name, value: tax.slug })),
            isLoadingTaxonomies: !allTax
        };
	}, [currentQueryOptions.postType]);
    const taxonomyOptionsForSelect = isLoadingTaxonomies ?
        [{label: __('Loading Taxonomies...', 'news-ticker-block'), value:''}] :
        (taxonomies.length > 0 ?
            [{label: __('Select a Taxonomy (Optional)', 'news-ticker-block'), value: ''}, ...taxonomies] :
            [{ label: __('No taxonomies for this post type', 'news-ticker-block'), value: '' }]);

    // --- Fetch Search Results for Terms ---
    const { searchResultsTerms, isLoadingSearchResultsTerms } = useSelect((select) => {
        if (!currentQueryOptions.selectedTaxonomy || !debouncedSearchTermTerms) return {searchResultsTerms:[], isLoadingSearchResultsTerms:false};
        const { getEntityRecords } = select(coreStore);
        const records = getEntityRecords('taxonomy', currentQueryOptions.selectedTaxonomy, {per_page:20, search:debouncedSearchTermTerms, orderby:'count', order:'desc'});
        return { searchResultsTerms: records, isLoadingSearchResultsTerms: !records };
    }, [debouncedSearchTermTerms, currentQueryOptions.selectedTaxonomy]);

    // --- Fetch Search Results for Posts ---
	const { searchResults: searchResultsPosts, isLoadingSearchResults: isLoadingSearchResultsPosts } = useSelect((select) => {
        if (!debouncedSearchTermPosts && currentQueryOptions.posts.length > 0) return { searchResults: [], isLoadingSearchResults: false };
        if (!debouncedSearchTermPosts && !currentQueryOptions.postType) return { searchResults: [], isLoadingSearchResults: false };
        if (!debouncedSearchTermPosts) return {searchResults: [], isLoadingSearchResults: false};

        const { getEntityRecords } = select(coreStore);
		const query = { per_page: 20, search: debouncedSearchTermPosts, orderby: 'relevance', status: 'publish', '_embed': true };
		const records = getEntityRecords('postType', currentQueryOptions.postType || 'post', query);
		return { searchResults: records, isLoadingSearchResults: !records };
	}, [debouncedSearchTermPosts, currentQueryOptions.postType, currentQueryOptions.posts.length]);

    // --- Fetch names of selected terms for display ---
    const { selectedTermObjects } = useSelect((select) => {
        if (!currentQueryOptions.selectedTaxonomy || currentQueryOptions.selectedTerms.length === 0) return { selectedTermObjects: [] };
        const { getEntityRecords } = select(coreStore);
        const records = getEntityRecords('taxonomy', currentQueryOptions.selectedTaxonomy, { include: currentQueryOptions.selectedTerms, per_page: currentQueryOptions.selectedTerms.length });
        return { selectedTermObjects: records || [] };
    }, [currentQueryOptions.selectedTaxonomy, currentQueryOptions.selectedTerms]);


    const updateQueryOptions = (newQueryOptionsPartial) => {
        setAttributes({ queryOptions: { ...currentQueryOptions, ...newQueryOptionsPartial } });
    };

    // Specific handlers to update parts of queryOptions
    const handlePostTypeChange = (newVal) => {
        updateQueryOptions({ postType: newVal, selectedTaxonomy: '', selectedTerms: [], posts: [] });
    };
    const handleTaxonomyChange = (newTax) => {
        updateQueryOptions({ selectedTaxonomy: newTax, selectedTerms: [] });
    };
    const handleSelectedTermsChange = (newTerms) => {
        updateQueryOptions({ selectedTerms: newTerms });
    };
    const handlePostsSelectionChange = (newPosts) => {
        updateQueryOptions({ posts: newPosts });
    };
    const handleCustomContentChange = (newCustomContent) => {
        updateQueryOptions({ customContent: newCustomContent });
    };


    return (
        <PanelBody title={__('Content Source', 'news-ticker-block')} initialOpen={true}>
            {isLoadingPostTypes && <Spinner />}
            {!isLoadingPostTypes && (availablePostTypes.length > 0 || !currentPostTypeValue) && (
                <SelectControl
                    label={__('Post Type', 'news-ticker-block')}
                    value={currentPostTypeValue}
                    options={postTypeOptionsForSelect}
                    onChange={handlePostTypeChange}
                />
            )}
            {!isLoadingPostTypes && availablePostTypes.length === 0 && currentPostTypeValue && (
                 <TextControl label={__('Current Post Type (not found in public list)', 'news-ticker-block')} value={currentPostTypeValue} disabled />
            )}

            <TermSelector
                selectedTaxonomy={currentQueryOptions.selectedTaxonomy}
                onTaxonomyChange={handleTaxonomyChange}
                taxonomyOptions={taxonomyOptionsForSelect}
                isLoadingTaxonomies={isLoadingTaxonomies}
                searchTerm={searchTermTerms}
                onSearchTermChange={setSearchTermTerms}
                searchResults={searchResultsTerms}
                isLoadingSearchResults={isLoadingSearchResultsTerms}
                selectedTerms={currentQueryOptions.selectedTerms}
                selectedTermObjects={selectedTermObjects}
                onTermSelectionChange={handleSelectedTermsChange}
                onClearSelectedTerms={() => handleSelectedTermsChange([])}
            />

            <PostSelector
                searchTerm={searchTermPosts}
                onSearchTermChange={setSearchTermPosts}
                searchResults={searchResultsPosts}
                isLoadingSearchResults={isLoadingSearchResultsPosts}
                selectedPosts={currentQueryOptions.posts}
                onPostSelectionChange={handlePostsSelectionChange}
                onClearSelectedPosts={() => handlePostsSelectionChange([])}
            />

            <CustomContentRepeater
                customContentItems={currentQueryOptions.customContent}
                onChange={handleCustomContentChange}
            />
        </PanelBody>
    );
}
