import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';
import { PanelColorSettings } from '@wordpress/block-editor';

const BORDER_STYLES = [
    { label: __('None', 'news-ticker-block'), value: 'none' },
    { label: __('Solid', 'news-ticker-block'), value: 'solid' },
    { label: __('Dashed', 'news-ticker-block'), value: 'dashed' },
    { label: __('Dotted', 'news-ticker-block'), value: 'dotted' },
];

export default function ContainerStylingPanel({ attributes, setAttributes }) {
    const { tickerStyles } = attributes;
    // Ensure attributes.tickerStyles.default is checked before use
    const defaultStyles = (attributes.tickerStyles && attributes.tickerStyles.default) ? attributes.tickerStyles.default : {};
    const currentTickerStyles = { ...defaultStyles, ...(tickerStyles || {}) };

    const setStyleAttribute = (property, value) => {
        setAttributes({
            tickerStyles: { ...currentTickerStyles, [property]: value },
        });
    };

    return (
        <PanelBody title={__('Container Styling', 'news-ticker-block')} initialOpen={false}>
            <PanelColorSettings
                title={__('Background Color', 'news-ticker-block')}
                colorSettings={[{
                    value: currentTickerStyles.containerBackgroundColor,
                    onChange: (v) => setStyleAttribute('containerBackgroundColor', v),
                    label: __('Background', 'news-ticker-block'),
                }]}
                disableCustomColors={false}
            />
            <TextControl label={__('Padding Top (e.g., 10px)', 'news-ticker-block')} value={currentTickerStyles.containerPaddingTop || ''} onChange={(v) => setStyleAttribute('containerPaddingTop',v)} />
            <TextControl label={__('Padding Right (e.g., 15px)', 'news-ticker-block')} value={currentTickerStyles.containerPaddingRight || ''} onChange={(v) => setStyleAttribute('containerPaddingRight',v)} />
            <TextControl label={__('Padding Bottom (e.g., 10px)', 'news-ticker-block')} value={currentTickerStyles.containerPaddingBottom || ''} onChange={(v) => setStyleAttribute('containerPaddingBottom',v)} />
            <TextControl label={__('Padding Left (e.g., 15px)', 'news-ticker-block')} value={currentTickerStyles.containerPaddingLeft || ''} onChange={(v) => setStyleAttribute('containerPaddingLeft',v)} />

            <TextControl label={__('Border Width (e.g., 1px)', 'news-ticker-block')} value={currentTickerStyles.containerBorderWidth || ''} onChange={(v) => setStyleAttribute('containerBorderWidth',v)} />
            <SelectControl label={__('Border Style', 'news-ticker-block')} value={currentTickerStyles.containerBorderStyle} options={BORDER_STYLES} onChange={(v) => setStyleAttribute('containerBorderStyle',v)} />
            <PanelColorSettings
                title={__('Border Color', 'news-ticker-block')}
                colorSettings={[ { value: currentTickerStyles.containerBorderColor, onChange: (v) => setStyleAttribute('containerBorderColor',v), label: __('Border Color', 'news-ticker-block') } ]}
                disableCustomColors={false}
            />
            <TextControl label={__('Border Radius (e.g., 4px)', 'news-ticker-block')} value={currentTickerStyles.containerBorderRadius || ''} onChange={(v) => setStyleAttribute('containerBorderRadius',v)} />
        </PanelBody>
    );
}
