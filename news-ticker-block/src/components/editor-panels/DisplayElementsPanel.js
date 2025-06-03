import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, ToggleControl, Button } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

export default function DisplayElementsPanel({ attributes, setAttributes }) {
    const {
        logoUrl, breakingNewsHeading, showLiveText, liveTextContent, showDate
    } = attributes;

    const onSelectMedia = (media) => setAttributes({ logoUrl: media.url });

    return (
        <PanelBody title={__('Display Elements', 'news-ticker-block')} initialOpen={false}>
            <MediaUploadCheck>
                <MediaUpload
                    onSelect={onSelectMedia}
                    allowedTypes={['image']}
                    value={logoUrl}
                    render={({ open }) => (
                        <Button onClick={open} isPrimary>
                            {!logoUrl ? __('Upload Logo', 'news-ticker-block') : __('Replace Logo', 'news-ticker-block')}
                        </Button>
                    )}
                />
            </MediaUploadCheck>
            {logoUrl && (
                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <img src={logoUrl} alt={__('Selected logo preview', 'news-ticker-block')} style={{ maxWidth: '100px', maxHeight: '50px', display: 'block' }} />
                    <Button onClick={() => setAttributes({ logoUrl: '' })} isLink isDestructive>
                        {__('Remove Logo', 'news-ticker-block')}
                    </Button>
                </div>
            )}
            <TextControl
                label={__('Breaking News Heading', 'news-ticker-block')}
                value={breakingNewsHeading}
                onChange={(newVal) => setAttributes({ breakingNewsHeading: newVal })}
            />
            <ToggleControl
                label={__('Show "Live" Text', 'news-ticker-block')}
                checked={showLiveText}
                onChange={(newVal) => setAttributes({ showLiveText: newVal })}
            />
            {showLiveText && (
                <TextControl
                    label={__('Live Text Content', 'news-ticker-block')}
                    value={liveTextContent}
                    onChange={(newVal) => setAttributes({ liveTextContent: newVal })}
                />
            )}
            <ToggleControl
                label={__('Show Date', 'news-ticker-block')}
                checked={showDate}
                onChange={(newVal) => setAttributes({ showDate: newVal })}
            />
        </PanelBody>
    );
}
