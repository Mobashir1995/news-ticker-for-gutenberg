import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';

export default function TickerControlsPanel({ attributes, setAttributes }) {
    const { showNavigation, showPlayPause, pauseOnHover } = attributes;
    return (
        <PanelBody title={__('Ticker Controls', 'news-ticker-block')} initialOpen={false}>
            <ToggleControl
                label={__('Show Navigation Arrows', 'news-ticker-block')}
                checked={showNavigation}
                onChange={(newVal) => setAttributes({ showNavigation: newVal })}
            />
            <ToggleControl
                label={__('Show Play/Pause Button', 'news-ticker-block')}
                checked={showPlayPause}
                onChange={(newVal) => setAttributes({ showPlayPause: newVal })}
            />
            <ToggleControl
                label={__('Pause Ticker on Mouse Hover', 'news-ticker-block')}
                checked={pauseOnHover}
                onChange={(newVal) => setAttributes({ pauseOnHover: newVal })}
            />
        </PanelBody>
    );
}
