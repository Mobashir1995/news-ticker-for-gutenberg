import { __ } from '@wordpress/i18n';
import { 
	PanelBody, 
	SelectControl, 
	RangeControl,
	Button,
	Notice,
	Spinner,
	BaseControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { usePostTypes, useTaxonomies, useSearchPosts, useSearchTerms} from '../hooks/useTickerData';

const QuerySettings = ( { attributes, setAttributes } ) => {
	// Ensure attributes is defined
	if ( ! attributes ) {
		return (
			<PanelBody title={ __( 'Query Settings', 'news-ticker-for-gutenberg' ) } initialOpen={ false }>
				<Notice status="error" isDismissible={ false }>
					{ __( 'Error: Attributes not found.', 'news-ticker-for-gutenberg' ) }
				</Notice>
			</PanelBody>
		);
	}

	const {
		postType = 'post',
		selectedTaxonomies = [],
		selectedPosts = [],
		postsPerPage = 10,
		orderBy = 'date',
		order = 'DESC',
	} = attributes;

	// Get post types using data module
	const postTypes = usePostTypes();
	
	// Get taxonomies using data module
	const taxonomies = useTaxonomies();

	// Search posts hook
	const [ postSearchTerm, setPostSearchTerm ] = useState( '' );
	const searchPosts = useSearchPosts( postType, postSearchTerm, 10 );

	// Search terms hook
	const [ termSearchTerm, setTermSearchTerm ] = useState( '' );
	const searchTerms = useSearchTerms( 'category', termSearchTerm, 10 );

	const orderByOptions = [
		{ label: __( 'Date', 'news-ticker-for-gutenberg' ), value: 'date' },
		{ label: __( 'Title', 'news-ticker-for-gutenberg' ), value: 'title' },
		{ label: __( 'Modified Date', 'news-ticker-for-gutenberg' ), value: 'modified' },
		{ label: __( 'Random', 'news-ticker-for-gutenberg' ), value: 'rand' },
		{ label: __( 'Comment Count', 'news-ticker-for-gutenberg' ), value: 'comment_count' },
		{ label: __( 'Menu Order', 'news-ticker-for-gutenberg' ), value: 'menu_order' },
	];

	const orderOptions = [
		{ label: __( 'Descending', 'news-ticker-for-gutenberg' ), value: 'DESC' },
		{ label: __( 'Ascending', 'news-ticker-for-gutenberg' ), value: 'ASC' },
	];

	const handlePostTypeChange = ( newPostType ) => {
		setAttributes( { postType: newPostType } );
		// Clear selected posts when post type changes
		setAttributes( { selectedPosts: [] } );
	};

	const handlePostsPerPageChange = ( newPostsPerPage ) => {
		setAttributes( { postsPerPage: newPostsPerPage } );
	};

	const handleOrderByChange = ( newOrderBy ) => {
		setAttributes( { orderBy: newOrderBy } );
	};

	const handleOrderChange = ( newOrder ) => {
		setAttributes( { order: newOrder } );
	};

	const handlePostSelection = ( selectedOptions ) => {
		const posts = selectedOptions.map( option => ( {
			id: option.value,
			title: option.label,
			url: option.url || '',
		} ) );
		setAttributes( { selectedPosts: posts } );
	};

	const handleTaxonomySelection = ( selectedOptions ) => {
		const taxonomies = selectedOptions.map( option => ( {
			id: option.value,
			name: option.label,
			taxonomy: option.taxonomy || 'category',
		} ) );
		setAttributes( { selectedTaxonomies: taxonomies } );
	};

	// Format post types for select
	const postTypeOptions = postTypes ? postTypes.map( type => ( {
		label: type.name,
		value: type.slug,
	} ) ) : [];

	// Format search posts for select
	const searchPostOptions = searchPosts ? searchPosts.map( post => (
		{
			label: post.title?.rendered || post.title || 'Untitled',
			value: post.id,
			url: post.link || '',
		}
	) ) : [];

	// Format search terms for select
	const searchTermOptions = searchTerms ? searchTerms.map( term => (
		{
			label: term.name,
			value: term.id,
			taxonomy: term.taxonomy,
		}
	) ) : [];

	return (
		<PanelBody title={ __( 'Query Settings', 'news-ticker-for-gutenberg' ) } initialOpen={ false }>
			{ ! postTypes && (
				<Notice status="info" isDismissible={ false }>
					<Spinner />
					{ __( 'Loading post types...', 'news-ticker-for-gutenberg' ) }
				</Notice>
			) }

			{ postTypes && (
				<>
					<SelectControl
						label={ __( 'Post Type', 'news-ticker-for-gutenberg' ) }
						value={ postType }
						options={ postTypeOptions }
						onChange={ handlePostTypeChange }
						help={ __( 'Select the post type to display in the ticker.', 'news-ticker-for-gutenberg' ) }
					/>

					<RangeControl
						label={ __( 'Posts Per Page', 'news-ticker-for-gutenberg' ) }
						value={ postsPerPage }
						onChange={ handlePostsPerPageChange }
						min={ 1 }
						max={ 50 }
						help={ __( 'Number of posts to display (1-50).', 'news-ticker-for-gutenberg' ) }
					/>

					<SelectControl
						label={ __( 'Order By', 'news-ticker-for-gutenberg' ) }
						value={ orderBy }
						options={ orderByOptions }
						onChange={ handleOrderByChange }
						help={ __( 'Sort posts by this field.', 'news-ticker-for-gutenberg' ) }
					/>

					<SelectControl
						label={ __( 'Order', 'news-ticker-for-gutenberg' ) }
						value={ order }
						options={ orderOptions }
						onChange={ handleOrderChange }
						help={ __( 'Sort order (ascending or descending).', 'news-ticker-for-gutenberg' ) }
					/>

					{ /* Post Search - Simplified for now, can be enhanced with AsyncSelect */ }
					<div className="ntfg-post-search">
						<label className="components-base-control__label">
							{ __( 'Search Posts', 'news-ticker-for-gutenberg' ) }
						</label>
						<input
							type="text"
							className="components-text-control__input"
							placeholder={ __( 'Search posts...', 'news-ticker-for-gutenberg' ) }
							value={ postSearchTerm }
							onChange={ ( e ) => setPostSearchTerm( e.target.value ) }
						/>
						{ postSearchTerm.length > 2 && searchPosts && (
							<div className="ntfg-search-results">
								{ searchPosts.map( post => (
									<div key={ post.id } className="ntfg-search-item">
										{ post.title?.rendered || post.title || 'Untitled' }
									</div>
								) ) }
							</div>
						) }
					</div>

					{ /* Taxonomy Search - Simplified for now */ }
					<div className="ntfg-taxonomy-search">
						<label className="components-base-control__label">
							{ __( 'Search Categories', 'news-ticker-for-gutenberg' ) }
						</label>
						<input
							type="text"
							className="components-text-control__input"
							placeholder={ __( 'Search categories...', 'news-ticker-for-gutenberg' ) }
							value={ termSearchTerm }
							onChange={ ( e ) => setTermSearchTerm( e.target.value ) }
						/>
						{ termSearchTerm.length > 2 && searchTerms && (
							<div className="ntfg-search-results">
								{ searchTerms.map( term => (
									<div key={ term.id } className="ntfg-search-item">
										{ term.name }
									</div>
								) ) }
							</div>
						) }
					</div>

					{ selectedPosts.length > 0 && (
						<div className="ntfg-selected-posts">
							<label className="components-base-control__label">
								{ __( 'Selected Posts', 'news-ticker-for-gutenberg' ) }
							</label>
							{ selectedPosts.map( post => (
								<div key={ post.id } className="ntfg-selected-item">
									{ post.title }
									<button
										type="button"
										className="components-button is-small is-destructive"
										onClick={ () => {
											const newPosts = selectedPosts.filter( p => p.id !== post.id );
											setAttributes( { selectedPosts: newPosts } );
										} }
									>
										{ __( 'Remove', 'news-ticker-for-gutenberg' ) }
									</button>
								</div>
							) ) }
						</div>
					) }

					{ selectedTaxonomies.length > 0 && (
						<div className="ntfg-selected-taxonomies">
							<label className="components-base-control__label">
								{ __( 'Selected Taxonomies', 'news-ticker-for-gutenberg' ) }
							</label>
							{ selectedTaxonomies.map( taxonomy => (
								<div key={ taxonomy.id } className="ntfg-selected-item">
									{ taxonomy.name }
									<button
										type="button"
										className="components-button is-small is-destructive"
										onClick={ () => {
											const newTaxonomies = selectedTaxonomies.filter( t => t.id !== taxonomy.id );
											setAttributes( { selectedTaxonomies: newTaxonomies } );
										} }
									>
										{ __( 'Remove', 'news-ticker-for-gutenberg' ) }
									</button>
								</div>
							) ) }
						</div>
					) }
				</>
			) }
		</PanelBody>
	);
};

export default QuerySettings; 