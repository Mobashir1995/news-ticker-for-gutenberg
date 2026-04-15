import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl } from '@wordpress/components';

import {
    QueryControls,
    TaxonomyFilters,
    IncludePostsSection
} from './components';

import { NewsTickerPreview } from './components/NewsTickerPreview';

import './editor.css';

/**
 * Edit Component for News Ticker Block
 * Main editor component that orchestrates all the functionality
 */
export default function Edit({ attributes, setAttributes }) {
    const { heading } = attributes;
    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <TextControl
                        label="Heading"
                        value={ heading }
                        onChange={value => setAttributes({ heading: value })}
                    />
                </PanelBody>
                
                <PanelBody title={__('Query Controls', 'news-ticker-for-gutenberg')}>
                    <QueryControls 
                        attributes={attributes} 
                        setAttributes={setAttributes} 
                    />
                    
                    <TaxonomyFilters 
                        attributes={attributes} 
                        setAttributes={setAttributes} 
                    />
                    
                    <IncludePostsSection 
                        attributes={attributes} 
                        setAttributes={setAttributes} 
                    />
                </PanelBody>
            </InspectorControls>
            
            <div {...useBlockProps()}>
                <NewsTickerPreview attributes={attributes} />
            </div>
        </>
    );
}