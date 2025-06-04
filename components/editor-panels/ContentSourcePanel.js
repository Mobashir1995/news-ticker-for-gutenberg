import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, Spinner } from '@wordpress/components'; // Spinner might be needed here too
import { useSelect } from '@wordpress/data'; // useSelect will be used here for data fetching logic
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';

// Import Sub-components
import PostSelector from '../ui-elements/PostSelector';
import TermSelector from '../ui-elements/TermSelector';
import CustomContentRepeater from '../ui-elements/CustomContentRepeater';

export default function ContentSourcePanel({ attributes, setAttributes }) {
    const { queryOptions } = attributes;
    // Ensure queryOptions and its nested arrays are properly defaulted
    const defaultQueryOpts = attributes.queryOptions.default || { postType: 'post', selectedTaxonomy: '', selectedTerms: [], posts: [], customContent: [] };
    const currentQueryOptions = { ...defaultQueryOpts, ...queryOptions };
    currentQueryOptions.selectedTerms = Array.isArray(currentQueryOptions.selectedTerms) ? currentQueryOptions.selectedTerms : (defaultQueryOpts.selectedTerms || []);
    currentQueryOptions.posts = Array.isArray(currentQueryOptions.posts) ? currentQueryOptions.posts : (defaultQueryOpts.posts || []);
    currentQueryOptions.customContent = Array.isArray(currentQueryOptions.customContent) ? currentQueryOptions.customContent : (defaultQueryOpts.customContent || []);


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
		return { postTypes: filtered.map((type) => ({ label: type.name, value: type.slug })), isLoadingPostTypes: !allPostTypes };
	}, []);
	const postTypeOptions = isLoadingPostTypes ?
        [{ label: __('Loading...', 'news-ticker-block'), value: '' }] :
        (availablePostTypes.length>0 ? availablePostTypes : [{label:__('No public post types found', 'news-ticker-block'),value:''}]);

    // --- Fetch Taxonomies for the selected Post Type ---
	const { taxonomies, isLoadingTaxonomies } = useSelect((select) => {
        const { getTaxonomies } = select(coreStore);
		if (!currentQueryOptions.postType) return { taxonomies: [], isLoadingTaxonomies: false };
		const allTax = getTaxonomies({ type: currentQueryOptions.postType, per_page: -1, context: 'view' });
        const filtered = allTax ? allTax.filter( tax => tax.visibility.show_ui && tax.slug !== 'post_format') : [];
		return { taxonomies: filtered.map(tax => ({ label: tax.name, value: tax.slug })), isLoadingTaxonomies: !allTax };
	}, [currentQueryOptions.postType]);
    const taxonomyOptionsForSelect = isLoadingTaxonomies ?
        [{ label: __('Loading...', 'news-ticker-block'), value: ''}] :
        (taxonomies.length>0 ? [{label:__('Select Taxonomy','news-ticker-block'),value:''}, ...taxonomies] : [{label:__('No taxonomies found for this post type', 'news-ticker-block'),value:''}]);

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
        // Avoid searching if term is empty AND we already have selected posts (unless post type just changed, handled by posts being cleared)
        if (!debouncedSearchTermPosts && currentQueryOptions.postType && currentQueryOptions.posts.length > 0) return { searchResults: [], isLoadingSearchResults: false };


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


    // --- Update Query Options Helper ---
    const updateQueryOption = (key, value) => {
        setAttributes({ queryOptions: { ...currentQueryOptions, [key]: value } });
    };
    const updatePosts = (newPosts) => updateQueryOption('posts', newPosts);
    const updateSelectedTerms = (newTerms) => updateQueryOption('selectedTerms', newTerms);
    const updateCustomContent = (newCustomContent) => updateQueryOption('customContent', newCustomContent);


    return (
        <PanelBody title={__('Content Source', 'news-ticker-block')} initialOpen={true}>
            {isLoadingPostTypes && <Spinner />}
            {!isLoadingPostTypes && availablePostTypes && availablePostTypes.length > 0 && (
                <SelectControl
                    label={__('Post Type', 'news-ticker-block')}
                    value={currentQueryOptions.postType}
                    options={postTypeOptions}
                    onChange={(newVal) => setAttributes({
                        queryOptions: { ...currentQueryOptions, postType: newVal, selectedTaxonomy: '', selectedTerms: [], posts: [] }
                    })}
                />
            )}
            {(!isLoadingPostTypes && (!availablePostTypes || availablePostTypes.length === 0)) && (
                 <TextControl
                    label={__('Post Type (Fallback - No dynamic types found)', 'news-ticker-block')}
                    value={currentQueryOptions.postType}
                    onChange={(newVal) => setAttributes({ queryOptions: { ...currentQueryOptions, postType: newVal }})}
                    help={__('Enter post type slug. No public post types were dynamically found.', 'news-ticker-block')}
                />
            )}

            <TermSelector
                selectedTaxonomy={currentQueryOptions.selectedTaxonomy}
                onTaxonomyChange={(newTax) => setAttributes({ queryOptions: { ...currentQueryOptions, selectedTaxonomy: newTax, selectedTerms: [] }})}
                taxonomyOptions={taxonomyOptionsForSelect}
                isLoadingTaxonomies={isLoadingTaxonomies}
                searchTerm={searchTermTerms}
                onSearchTermChange={setSearchTermTerms}
                searchResults={searchResultsTerms}
                isLoadingSearchResults={isLoadingSearchResultsTerms}
                selectedTerms={currentQueryOptions.selectedTerms}
                selectedTermObjects={selectedTermObjects}
                onTermSelectionChange={updateSelectedTerms}
                onClearSelectedTerms={() => updateSelectedTerms([])}
            />

            <PostSelector
                searchTerm={searchTermPosts}
                onSearchTermChange={setSearchTermPosts}
                searchResults={searchResultsPosts}
                isLoadingSearchResults={isLoadingSearchResultsPosts}
                selectedPosts={currentQueryOptions.posts}
                onPostSelectionChange={updatePosts}
                onClearSelectedPosts={() => updatePosts([])}
            />

            <CustomContentRepeater
                customContentItems={currentQueryOptions.customContent}
                onChange={updateCustomContent}
            />
        </PanelBody>
    );
}
