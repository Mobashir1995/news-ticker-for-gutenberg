import { useSelect } from '@wordpress/data';

/**
 * Custom hook for fetching WordPress post types
 * @returns {Array} Array of post type options
 */
export function usePostTypes() {
    return useSelect(select => {
        const allPostTypes = select('core').getPostTypes({ per_page: -1 });
        const filteredPostTypes = allPostTypes ? allPostTypes.filter(postType => 
            postType.viewable && postType.slug !== 'attachment'
        ) : [];
        
        return filteredPostTypes.map(postType => ({
            label: postType.name,
            value: postType.slug
        }));
    }, []);
}

/**
 * Custom hook for fetching WordPress taxonomies
 * @param {string} postType - The post type to get taxonomies for
 * @returns {Array} Array of taxonomies
 */
export function useTaxonomies(postType) {
    return useSelect(select => 
        select('core').getTaxonomies({ type: postType, per_page: -1 })
    , [postType]);
}

/**
 * Custom hook for fetching taxonomy terms
 * @param {Array} taxonomies - Array of taxonomies
 * @returns {Object} Object with taxonomy terms keyed by rest_base
 */
export function useTaxonomyTerms(taxonomies) {
    return useSelect(select => {
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
}

/**
 * Custom hook for fetching posts with filters
 * @param {Object} params - Query parameters
 * @returns {Array} Array of posts
 */
export function usePosts({ postType, postsToShow, orderby, order, selectedTerms, includePosts, taxonomyTerms }) {
    return useSelect(select => {
        if (!postType) {
            return [];
        }

        // Build query parameters
        const queryParams = {
            per_page: postsToShow || 10,
            status: 'publish',
            orderby: orderby,
            order: order
        };

        // If specific posts are selected, include them
        if (includePosts && Array.isArray(includePosts) && includePosts.length > 0) {
            queryParams.include = includePosts;
        }

        // Add taxonomy filters if terms are selected
        if (selectedTerms && Object.keys(selectedTerms).length > 0) {
            Object.entries(selectedTerms).forEach(([taxonomySlug, termIds]) => {
                const validTaxonomies = taxonomyTerms?.[taxonomySlug];
                if (validTaxonomies && termIds && Array.isArray(termIds) && termIds.length > 0) {
                    queryParams[taxonomySlug] = termIds.join(',');
                }
            });
        }

        return select('core').getEntityRecords('postType', postType, queryParams);
    }, [postType, postsToShow, orderby, order, selectedTerms, includePosts, taxonomyTerms]);
}

/**
 * Custom hook for fetching selected posts details
 * @param {Array} includePosts - Array of post IDs to include
 * @param {string} postType - The post type
 * @returns {Object} Object with posts and loading state
 */
export function useSelectedPosts(includePosts, postType) {
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

    return {
        selectedPostsDetails,
        isSelectedPostsLoading
    };
} 