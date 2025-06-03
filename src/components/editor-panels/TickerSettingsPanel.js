import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';

export default function TickerSettingsPanel({ attributes, setAttributes }) {
    const { animationType, tickerSpeed, tickerDirection } = attributes;

    return (
        <PanelBody title={__('Ticker Settings', 'news-ticker-block')} initialOpen={true}>
            <SelectControl
                label={__('Animation Type', 'news-ticker-block')}
                value={animationType}
                options={[
                    { label: __('Scroll', 'news-ticker-block'), value: 'scroll' },
                    { label: __('Up Down', 'news-ticker-block'), value: 'upDown' },
                    { label: __('Left-Right Sliding', 'news-ticker-block'), value: 'slide' },
                    { label: __('Typography Effect', 'news-ticker-block'), value: 'typing' },
                ]}
                onChange={(newVal) => setAttributes({ animationType: newVal })}
            />
            <RangeControl
                label={__('Ticker Speed', 'news-ticker-block')}
                value={tickerSpeed}
                onChange={(newVal) => setAttributes({ tickerSpeed: newVal })}
                min={1}
                max={20}
            />
            {(animationType === 'scroll' || animationType === 'slide') && (
                <SelectControl
                    label={__('Ticker Direction', 'news-ticker-block')}
                    value={tickerDirection}
                    options={[
                        { label: __('Left', 'news-ticker-block'), value: 'left' },
                        { label: __('Right', 'news-ticker-block'), value: 'right' },
                        { label: __('Up', 'news-ticker-block'), value: 'up' },
                        { label: __('Down', 'news-ticker-block'), value: 'down' },
                    ]}
                    onChange={(newVal) => setAttributes({ tickerDirection: newVal })}
                />
            )}
        </PanelBody>
    );
}
