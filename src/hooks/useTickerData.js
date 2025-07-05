import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';

/**
 * Custom hook to fetch ticker data using WordPress data module
 */
export const useTickerData = ( attributes ) => {
	const [ tickerItems, setTickerItems ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ error, setError ] = useState( null );

	const {
		postType = 'post',
		selectedTaxonomies = [],
		selectedPosts = [],
		postsPerPage = 10,
		orderBy = 'date',
		order = 'DESC',
		customContent = [],
	} = attributes;

	// Get selected posts using core-data
	const selectedPostsData = useSelect( ( select ) => {
		if ( selectedPosts.length === 0 ) return [];

		return select( coreDataStore ).getEntityRecords( 'postType', 'any', {
			include: selectedPosts,
			per_page: selectedPosts.length,
			orderby: 'include',
		} );
	}, [ selectedPosts ] );

	// Get queried posts using core-data
	const queriedPostsData = useSelect( ( select ) => {
		const queryArgs = {
			post_type: postType,
			per_page: postsPerPage,
			orderby: orderBy,
			order: order,
		};

		// Add taxonomy filters if selected
		if ( selectedTaxonomies.length > 0 ) {
			const taxQuery = selectedTaxonomies.map( ( taxonomy ) => ( {
				taxonomy: taxonomy.taxonomy,
				terms: [ taxonomy.id ],
			} ) );
			queryArgs.tax_query = taxQuery;
		}

		// Exclude already selected posts
		if ( selectedPosts.length > 0 ) {
			queryArgs.exclude = selectedPosts;
		}

		return select( coreDataStore ).getEntityRecords( 'postType', postType, queryArgs );
	}, [ postType, selectedTaxonomies, selectedPosts, postsPerPage, orderBy, order ] );

	// Get taxonomy terms using core-data
	const taxonomyTerms = useSelect( ( select ) => {
		const terms = {};
		
		selectedTaxonomies.forEach( ( taxonomy ) => {
			if ( taxonomy.taxonomy ) {
				terms[ taxonomy.taxonomy ] = select( coreDataStore ).getEntityRecords( 'taxonomy', taxonomy.taxonomy, {
					per_page: -1,
				} );
			}
		} );

		return terms;
	}, [ selectedTaxonomies ] );

	// Combine and format data
	useEffect( () => {
		setIsLoading( true );
		setError( null );

		try {
			const items = [];

			// Add selected posts first
			if ( selectedPostsData && selectedPostsData.length > 0 ) {
				selectedPostsData.forEach( ( post ) => {
					if ( post ) {
						items.push( {
							id: post.id,
							title: post.title?.rendered || post.title || 'Untitled',
							url: post.link || '',
							date: post.date || '',
							type: 'post',
							source: 'selected',
						} );
					}
				} );
			}

			// Add queried posts
			if ( queriedPostsData && queriedPostsData.length > 0 ) {
				queriedPostsData.forEach( ( post ) => {
					if ( post ) {
						items.push( {
							id: post.id,
							title: post.title?.rendered || post.title || 'Untitled',
							url: post.link || '',
							date: post.date || '',
							type: 'post',
							source: 'queried',
						} );
					}
				} );
			}

			// Add custom content
			customContent.forEach( ( content, index ) => {
				if ( content.title ) {
					items.push( {
						id: `custom-${ index }`,
						title: content.title,
						url: content.url || '',
						date: content.date || '',
						type: 'custom',
						source: 'custom',
					} );
				}
			} );

			setTickerItems( items );
		} catch ( err ) {
			setError( err.message );
		} finally {
			setIsLoading( false );
		}
	}, [ selectedPostsData, queriedPostsData, customContent ] );

	return {
		tickerItems,
		isLoading,
		error,
		taxonomyTerms,
	};
};

/**
 * Hook to get post types
 */
export const usePostTypes = () => {
	return useSelect( ( select ) => {
		return select( coreDataStore ).getPostTypes( { per_page: -1 } );
	}, [] );
};

/**
 * Hook to get taxonomies
 */
export const useTaxonomies = () => {
	return useSelect( ( select ) => {
		return select( coreDataStore ).getTaxonomies( { per_page: -1 } );
	}, [] );
};

/**
 * Hook to search posts
 */
export const useSearchPosts = ( postType, searchTerm, perPage = 10 ) => {
	return useSelect( ( select ) => {
		if ( ! searchTerm || searchTerm.length < 3 ) return [];

		return select( coreDataStore ).getEntityRecords( 'postType', postType, {
			search: searchTerm,
			per_page: perPage,
			orderby: 'relevance',
		} );
	}, [ searchTerm, postType, perPage ] );
};

/**
 * Hook to search terms
 */
export const useSearchTerms = ( taxonomy, searchTerm, perPage = 10 ) => {
	return useSelect( ( select ) => {
		if ( ! searchTerm || searchTerm.length < 3 || ! taxonomy ) return [];

		return select( coreDataStore ).getEntityRecords( 'taxonomy', taxonomy, {
			search: searchTerm,
			per_page: perPage,
		} );
	}, [ searchTerm, taxonomy, perPage ] );
}; 