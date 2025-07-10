import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { TextControl, SelectControl, PanelBody, CheckboxControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

import './editor.css';

export default function Edit({ attributes, setAttributes }) {
    const { postType, postsToShow, orderby, order, selectedTerms } = attributes;
    const [expandedTaxonomies, setExpandedTaxonomies] = useState({});

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
    }, [ postType, postsToShow, orderby, order, selectedTerms ]);


   
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
                            <h4>{ __('Filter by Taxonomies', 'news-ticker-for-gutenberg') }</h4>
                            {taxonomies.map(taxonomy => {
                                const terms = taxonomyTerms[taxonomy.rest_base];
                                const taxonomySelectedTerms = selectedTerms[taxonomy.rest_base] || [];
                                const isExpanded = expandedTaxonomies[taxonomy.rest_base];
                                
                                return (
                                    <div key={taxonomy.rest_base} className="taxonomy-group">
                                        <div className="taxonomy-header">
                                            <h5>{taxonomy.name}</h5>
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