import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';

import PostSelector from '../ui-elements/PostSelector.js';
import TermSelector from '../ui-elements/TermSelector.js';
import CustomContentRepeater from '../ui-elements/CustomContentRepeater.js';

export default function ContentSourcePanel({ attributes, setAttributes }) {
    const { queryOptions } = attributes;

    // Robust initialization of queryOptions and its nested properties
    const defaultQueryOptsFromBlock = attributes.queryOptions?.default || {}; // Get from block.json via main attributes

    const currentQueryOptions = {
        postType: queryOptions?.postType !== undefined ? queryOptions.postType : (defaultQueryOptsFromBlock.postType || 'post'),
        selectedTaxonomy: queryOptions?.selectedTaxonomy !== undefined ? queryOptions.selectedTaxonomy : (defaultQueryOptsFromBlock.selectedTaxonomy || ''),
        selectedTerms: Array.isArray(queryOptions?.selectedTerms) ? queryOptions.selectedTerms : (defaultQueryOptsFromBlock.selectedTerms || []),
        posts: Array.isArray(queryOptions?.posts) ? queryOptions.posts : (defaultQueryOptsFromBlock.posts || []),
        customContent: Array.isArray(queryOptions?.customContent) ? queryOptions.customContent : (defaultQueryOptsFromBlock.customContent || []),
    };


	const [searchTermPosts, setSearchTermPosts] = useState('');
	const [debouncedSearchTermPosts, setDebouncedSearchTermPosts] = useState('');
	useEffect(() => { const h = setTimeout(() => setDebouncedSearchTermPosts(searchTermPosts), 500); return () => clearTimeout(h); }, [searchTermPosts]);

	const [searchTermTerms, setSearchTermTerms] = useState('');
	const [debouncedSearchTermTerms, setDebouncedSearchTermTerms] = useState('');
	useEffect(() => { const h = setTimeout(() => setDebouncedSearchTermTerms(searchTermTerms), 500); return () => clearTimeout(h); }, [searchTermTerms]);

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

    const postTypeSelectOptions = isLoadingPostTypes ?
        [{ label: __('Loading...', 'news-ticker-block'), value: '' }] :
        (availablePostTypes.length > 0 ?
            [{label: __('Select Post Type', 'news-ticker-block'), value: ''}, ...availablePostTypes] : // Ensure '' is a valid option for "Select Post Type"
            [{ label: __('No public post types found', 'news-ticker-block'), value: '' }]);


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

    const { searchResultsTerms, isLoadingSearchResultsTerms } = useSelect((select) => {
        if (!currentQueryOptions.selectedTaxonomy || !debouncedSearchTermTerms) return {searchResultsTerms:[], isLoadingSearchResultsTerms:false};
        const { getEntityRecords } = select(coreStore);
        const records = getEntityRecords('taxonomy', currentQueryOptions.selectedTaxonomy, {per_page:20, search:debouncedSearchTermTerms, orderby:'count', order:'desc'});
        return { searchResultsTerms: records, isLoadingSearchResultsTerms: !records };
    }, [debouncedSearchTermTerms, currentQueryOptions.selectedTaxonomy]);

	const { searchResults: searchResultsPosts, isLoadingSearchResults: isLoadingSearchResultsPosts } = useSelect((select) => {
        if (!debouncedSearchTermPosts && currentQueryOptions.posts.length > 0) return { searchResults: [], isLoadingSearchResults: false };
        if (!debouncedSearchTermPosts && !currentQueryOptions.postType) return { searchResults: [], isLoadingSearchResults: false };
        if (!debouncedSearchTermPosts) return {searchResults: [], isLoadingSearchResults: false};
        const { getEntityRecords } = select(coreStore);
		const query = { per_page: 20, search: debouncedSearchTermPosts, orderby: 'relevance', status: 'publish', '_embed': true };
		const records = getEntityRecords('postType', currentQueryOptions.postType || 'post', query);
		return { searchResults: records, isLoadingSearchResults: !records };
	}, [debouncedSearchTermPosts, currentQueryOptions.postType, currentQueryOptions.posts.length]);

    const { selectedTermObjects } = useSelect((select) => {
        if (!currentQueryOptions.selectedTaxonomy || !currentQueryOptions.selectedTerms || currentQueryOptions.selectedTerms.length === 0) return { selectedTermObjects: [] };
        const { getEntityRecords } = select(coreStore);
        const records = getEntityRecords('taxonomy', currentQueryOptions.selectedTaxonomy, { include: currentQueryOptions.selectedTerms, per_page: currentQueryOptions.selectedTerms.length });
        return { selectedTermObjects: records || [] };
    }, [currentQueryOptions.selectedTaxonomy, currentQueryOptions.selectedTerms]);

    const updateQueryOptionsAttribute = (newPartialQueryOptions) => {
        setAttributes({ queryOptions: { ...currentQueryOptions, ...newPartialQueryOptions } });
    };

    return (
        <PanelBody title={__('Content Source', 'news-ticker-block')} initialOpen={true}>
            {isLoadingPostTypes && <Spinner />}
            {!isLoadingPostTypes && (availablePostTypes.length > 0 || !currentQueryOptions.postType) && (
                <SelectControl
                    label={__('Post Type', 'news-ticker-block')}
                    value={currentQueryOptions.postType || ''} // Ensure value is not undefined
                    options={postTypeOptionsForSelect}
                    onChange={(newVal) => updateQueryOptionsAttribute({ postType: newVal, selectedTaxonomy: '', selectedTerms: [], posts: [] })}
                />
            )}
            {!isLoadingPostTypes && availablePostTypes.length === 0 && currentQueryOptions.postType && (
                 <TextControl label={__('Current Post Type (not found or no public types exist)', 'news-ticker-block')} value={currentQueryOptions.postType} disabled />
            )}

            <TermSelector
                selectedTaxonomy={currentQueryOptions.selectedTaxonomy}
                onTaxonomyChange={(newTax) => updateQueryOptionsAttribute({ selectedTaxonomy: newTax, selectedTerms: [] })}
                taxonomyOptions={taxonomyOptionsForSelect}
                isLoadingTaxonomies={isLoadingTaxonomies}
                searchTerm={searchTermTerms}
                onSearchTermChange={setSearchTermTerms}
                searchResults={searchResultsTerms}
                isLoadingSearchResults={isLoadingSearchResultsTerms}
                selectedTerms={currentQueryOptions.selectedTerms}
                selectedTermObjects={selectedTermObjects}
                onTermSelectionChange={(newTerms) => updateQueryOptionsAttribute({ selectedTerms: newTerms })}
                onClearSelectedTerms={() => updateQueryOptionsAttribute({ selectedTerms: [] })}
            />

            <PostSelector
                searchTerm={searchTermPosts}
                onSearchTermChange={setSearchTermPosts}
                searchResults={searchResultsPosts}
                isLoadingSearchResults={isLoadingSearchResultsPosts}
                selectedPosts={currentQueryOptions.posts}
                onPostSelectionChange={(newPosts) => updateQueryOptionsAttribute({ posts: newPosts })}
                onClearSelectedPosts={() => updateQueryOptionsAttribute({ posts: [] })}
            />

            <CustomContentRepeater
                customContentItems={currentQueryOptions.customContent}
                onChange={(newCustomContent) => updateQueryOptionsAttribute({ customContent: newCustomContent })}
            />
        </PanelBody>
    );
}
