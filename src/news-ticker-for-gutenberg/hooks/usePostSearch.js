import { useState, useCallback, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { useDebounce } from './useDebounce';

/**
 * Custom hook for post search functionality
 * @param {string} postType - The post type to search
 * @param {Object} selectedTerms - Selected taxonomy terms
 * @returns {Object} Search state and handlers
 */
export function usePostSearch(postType, selectedTerms) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchPage, setSearchPage] = useState(1);
    const [hasMoreResults, setHasMoreResults] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);

    // Debounce search query
    const debouncedSearchQuery = useDebounce(searchQuery, 1000);

    // Build search parameters
    const buildSearchParams = useCallback((page = searchPage) => {
        const searchParams = {
            search: debouncedSearchQuery,
            per_page: 10 * page,
            status: 'publish',
            _embed: false
        };

        // Add taxonomy filters if terms are selected
        if (selectedTerms && Object.keys(selectedTerms).length > 0) {
            Object.entries(selectedTerms).forEach(([taxonomySlug, termIds]) => {
                if (termIds && Array.isArray(termIds) && termIds.length > 0) {
                    searchParams[taxonomySlug] = termIds.join(',');
                }
            });
        }

        return searchParams;
    }, [debouncedSearchQuery, searchPage, selectedTerms]);

    // Search results
    const searchResults = useSelect(select => {
        if (!debouncedSearchQuery || !postType || debouncedSearchQuery.length < 2) {
            return [];
        }

        const searchParams = buildSearchParams();
        const results = select('core').getEntityRecords('postType', postType, searchParams) || [];

        // Check if there are more results available
        const totalResults = select('core').getEntityRecords('postType', postType, {
            ...searchParams,
            per_page: 10 * (searchPage + 1)
        }) || [];

        setHasMoreResults(totalResults.length > results.length);

        return results;
    }, [debouncedSearchQuery, postType, buildSearchParams, searchPage]);

    // Check if search is loading
    const isSearchLoading = useSelect(select => {
        if (!debouncedSearchQuery || !postType || debouncedSearchQuery.length < 2) {
            return false;
        }

        const searchParams = buildSearchParams();
        return select('core/data').isResolving('core', 'getEntityRecords', ['postType', postType, searchParams]);
    }, [debouncedSearchQuery, postType, buildSearchParams]);

    // Handle search query change
    const handleSearchQueryChange = useCallback((newQuery) => {
        setSearchQuery(newQuery);
        setSearchPage(1);
        setHasMoreResults(false);
        setShowSearchDropdown(newQuery.length >= 2);
    }, []);

    // Handle load more
    const handleLoadMore = useCallback(() => {
        setSearchPage(prev => prev + 1);
    }, []);

    // Reset search pagination when taxonomy filters change
    useEffect(() => {
        if (debouncedSearchQuery && debouncedSearchQuery.length >= 2) {
            setSearchPage(1);
            setHasMoreResults(false);
        }
    }, [selectedTerms, debouncedSearchQuery]);

    return {
        searchQuery,
        searchResults,
        isSearchLoading,
        hasMoreResults,
        showSearchDropdown,
        setShowSearchDropdown,
        handleSearchQueryChange,
        handleLoadMore
    };
} 