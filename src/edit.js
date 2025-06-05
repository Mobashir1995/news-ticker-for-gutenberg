import { __, _n, sprintf } from '@wordpress/i18n'; // Added _n, sprintf
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

// Import necessary components for preview, if any are specific and not just from attributes
import { Icon } from '@wordpress/components';


import './editor.scss'; // Main editor styles

export default function Edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps();

    // It's crucial that `attributes` passed to children are fully defaulted.
    // WordPress merges top-level defaults. For nested, we ensure they are initialized.
    const defaultQueryOptions = attributes.queryOptions?.default || { postType: 'post', selectedTaxonomy: '', selectedTerms: [], posts: [], customContent: [] };
    const defaultTickerStyles = attributes.tickerStyles?.default || {
        containerBackgroundColor: "", containerPaddingTop: "10px", containerPaddingRight: "15px",
        containerPaddingBottom: "10px", containerPaddingLeft: "15px", containerBorderWidth: "1px",
        containerBorderColor: "#e0e0e0", containerBorderStyle: "solid", containerBorderRadius: "0px",
        headerBackgroundColor: "", headerTextColor: "#333", headerHeadingFontFamily: "",
        headerHeadingFontSize: "1.1em", headerHeadingFontWeight: "bold", headerPaddingTop: "0px",
        headerPaddingRight: "0px", headerPaddingBottom: "8px", headerPaddingLeft: "0px",
        contentBackgroundColor: "", contentItemTextColor: "#444", contentItemLinkColor: "",
        contentItemFontFamily: "", contentItemFontSize: "0.95em", contentItemLineHeight: "1.5",
        controlsButtonBackgroundColor: "#f0f0f0", controlsButtonTextColor: "#333", controlsButtonBorderColor: "#ccc"
    };

    const currentQueryOptions = {
        ...defaultQueryOptions,
        ...(attributes.queryOptions || {}),
        posts: Array.isArray(attributes.queryOptions?.posts) ? attributes.queryOptions.posts : (defaultQueryOptions.posts || []),
        selectedTerms: Array.isArray(attributes.queryOptions?.selectedTerms) ? attributes.queryOptions.selectedTerms : (defaultQueryOptions.selectedTerms || []),
        customContent: Array.isArray(attributes.queryOptions?.customContent) ? attributes.queryOptions.customContent : (defaultQueryOptions.customContent || []),
    };

    const currentTickerStyles = {
        ...defaultTickerStyles,
        ...(attributes.tickerStyles || {}),
    };

    const finalAttributes = {
        ...attributes,
        queryOptions: currentQueryOptions,
        tickerStyles: currentTickerStyles,
    };

    let contentSummary = __('Querying latest posts.', 'news-ticker-block');
    if (currentQueryOptions.customContent && currentQueryOptions.customContent.length > 0) {
        contentSummary = sprintf(
            _n('%d Custom Item', '%d Custom Items', currentQueryOptions.customContent.length, 'news-ticker-block'),
            currentQueryOptions.customContent.length
        );
    } else if (currentQueryOptions.posts && currentQueryOptions.posts.length > 0) {
         contentSummary = sprintf(
            _n('%d Specific Post Selected', '%d Specific Posts Selected', currentQueryOptions.posts.length, 'news-ticker-block'),
            currentQueryOptions.posts.length
        );
    } else if (currentQueryOptions.postType) {
        let typeLabel = currentQueryOptions.postType;
        contentSummary = sprintf(__('Content from: %s', 'news-ticker-block'), typeLabel);
        if (currentQueryOptions.selectedTaxonomy && currentQueryOptions.selectedTerms && currentQueryOptions.selectedTerms.length > 0) {
            contentSummary += sprintf(__(' (filtered by %s)', 'news-ticker-block'), currentQueryOptions.selectedTaxonomy);
        }
    }


    return (
        <>
            <InspectorControls>
                <TickerSettingsPanel attributes={finalAttributes} setAttributes={setAttributes} />
                <ContentSourcePanel attributes={finalAttributes} setAttributes={setAttributes} />
                <ContainerStylingPanel attributes={finalAttributes} setAttributes={setAttributes} />
                <HeaderStylingPanel attributes={finalAttributes} setAttributes={setAttributes} />
                <ContentItemsStylingPanel attributes={finalAttributes} setAttributes={setAttributes} />
                <ControlsStylingPanel attributes={finalAttributes} setAttributes={setAttributes} />
                <DisplayElementsPanel attributes={finalAttributes} setAttributes={setAttributes} />
                <TickerControlsPanel attributes={finalAttributes} setAttributes={setAttributes} />
            </InspectorControls>

            <div {...blockProps}>
                <div className="news-ticker-editor-preview-wrapper">
                    <div className="preview-header">
                        {finalAttributes.logoUrl && (
                            <img
                                src={finalAttributes.logoUrl}
                                alt={__('Logo Preview', 'news-ticker-block')}
                                className="preview-logo"
                            />
                        )}
                        <h3 className="preview-breaking-heading">
                            {finalAttributes.breakingNewsHeading || __('Breaking News', 'news-ticker-block')}
                        </h3>
                        {finalAttributes.showLiveText && finalAttributes.liveTextContent && (
                            <span className="preview-live-text">{finalAttributes.liveTextContent}</span>
                        )}
                    </div>
                    <div className="preview-content-summary">
                        <Icon icon="list-view" />
                        <span>{contentSummary}</span>
                    </div>
                    <div className="preview-animation-summary">
                        <Icon icon="admin-settings" />
                        <span>
                            {sprintf(
                                __('Animation: %s / Speed: %d / Direction: %s', 'news-ticker-block'),
                                finalAttributes.animationType,
                                finalAttributes.tickerSpeed,
                                (finalAttributes.animationType === 'scroll' || finalAttributes.animationType === 'slide') ? finalAttributes.tickerDirection : __('N/A', 'news-ticker-block')
                            )}
                        </span>
                    </div>
                     {finalAttributes.showNavigation && <span className="preview-control-indicator">{__('Nav: On', 'news-ticker-block')}</span>}
                     {finalAttributes.showPlayPause && <span className="preview-control-indicator">{__('Play/Pause: On', 'news-ticker-block')}</span>}
                     {finalAttributes.pauseOnHover && <span className="preview-control-indicator">{__('Hover Pause: On', 'news-ticker-block')}</span>}

                    <p className="preview-styling-note">
                        <i>{__('Detailed styling options applied. Preview shows structure, not all custom styles.', 'news-ticker-block')}</i>
                    </p>
                </div>
            </div>
        </>
    );
}
