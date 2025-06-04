import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

// Import Panel Components (correct paths from src/edit.js)
import TickerSettingsPanel from './components/editor-panels/TickerSettingsPanel.js';
import ContentSourcePanel from './components/editor-panels/ContentSourcePanel.js';
import DisplayElementsPanel from './components/editor-panels/DisplayElementsPanel.js';
import TickerControlsPanel from './components/editor-panels/TickerControlsPanel.js';
import ContainerStylingPanel from './components/editor-panels/styling/ContainerStylingPanel.js';
import HeaderStylingPanel from './components/editor-panels/styling/HeaderStylingPanel.js';
import ContentItemsStylingPanel from './components/editor-panels/styling/ContentItemsStylingPanel.js';
import ControlsStylingPanel from './components/editor-panels/styling/ControlsStylingPanel.js';

import './editor.scss'; // Main editor styles

export default function Edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps();

    // It's crucial that `attributes` passed to children are fully defaulted.
    // WordPress usually handles merging top-level attributes with their defaults from block.json.
    // For nested objects like queryOptions and tickerStyles, if the parent object exists
    // but is missing some internal keys, those internal defaults from block.json might not be automatically merged by WP.
    // The `render_news_ticker_block` PHP function now does robust default merging.
    // For `edit.js`, child components should ideally receive fully resolved attributes.
    // The most robust way is to have a single source of truth for defaults (block.json)
    // and ensure they are merged deep.
    // For this step, we'll assume the `attributes` prop itself is correctly defaulted by WordPress for top-level.
    // The child components (like ContainerStylingPanel) currently try to merge with `attributes.tickerStyles.default`
    // which is not standard. They should receive a `tickerStyles` prop that is already complete.
    // The ContentSourcePanel also does its own merging for `queryOptions`.
    // This can be simplified if Edit ensures the `attributes` it passes down are fully merged.

    // For now, pass attributes directly, assuming consumers (panels) handle defaults if needed,
    // or that WP default mechanism is sufficient for what they access.
    // A more robust Edit component would pre-process attributes.queryOptions and attributes.tickerStyles here
    // against block.json defaults if they are complex objects and sub-keys might be missing.

    return (
        <>
            <InspectorControls>
                <TickerSettingsPanel attributes={attributes} setAttributes={setAttributes} />
                <ContentSourcePanel attributes={attributes} setAttributes={setAttributes} /> {/* This now handles its own defaults for queryOptions */}
                <ContainerStylingPanel attributes={attributes} setAttributes={setAttributes} /> {/* Handles its own defaults for tickerStyles */}
                <HeaderStylingPanel attributes={attributes} setAttributes={setAttributes} /> {/* Handles its own defaults for tickerStyles */}
                <ContentItemsStylingPanel attributes={attributes} setAttributes={setAttributes} /> {/* Handles its own defaults for tickerStyles */}
                <ControlsStylingPanel attributes={attributes} setAttributes={setAttributes} /> {/* Handles its own defaults for tickerStyles */}
                <DisplayElementsPanel attributes={attributes} setAttributes={setAttributes} />
                <TickerControlsPanel attributes={attributes} setAttributes={setAttributes} />
            </InspectorControls>

            <div {...blockProps}>
                <p>{__('News Ticker Block - Editor Preview', 'news-ticker-block')}</p>
                <p><small>{__('Configure via Inspector sidebar.', 'news-ticker-block')}</small></p>
                <p><i>{__('Styling options applied. Preview does not reflect all custom styles.', 'news-ticker-block')}</i></p>
                {/* A more detailed preview could be added here or as its own component */}
                {/* Example: Display current animation type */}
                <p><small>{__('Animation Type:', 'news-ticker-block')} {attributes.animationType}</small></p>
            </div>
        </>
    );
}
