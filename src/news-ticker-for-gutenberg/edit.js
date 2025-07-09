import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { TextControl, SelectControl, PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import './editor.css';

export default function Edit({ attributes, setAttributes }) {
    const { postType, postsToShow, orderby, order } = attributes;

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

    const posts = useSelect( select => (
        select( 'core' ).getEntityRecords( 'postType', postType, {
            per_page: postsToShow || 5,
            status: 'publish',
            orderby: orderby,
            order: order
        } )
    ), [ postType, postsToShow, orderby, order ]);


   
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
                                            { post.title?.rendered || post.title || __('Untitled', 'news-ticker-for-gutenberg') }
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