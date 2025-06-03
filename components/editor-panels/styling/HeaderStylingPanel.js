import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';
import { PanelColorSettings } from '@wordpress/block-editor';

// Common Font Options (Ideally from a shared file)
const FONT_FAMILIES = [
    { label: __('Default', 'news-ticker-block'), value: '' },
    { label: __('Arial, Helvetica, sans-serif', 'news-ticker-block'), value: 'Arial, Helvetica, sans-serif' },
    { label: __('Georgia, serif', 'news-ticker-block'), value: 'Georgia, serif' },
    { label: __('Tahoma, Geneva, sans-serif', 'news-ticker-block'), value: 'Tahoma, Geneva, sans-serif' },
    { label: __('Times New Roman, Times, serif', 'news-ticker-block'), value: 'Times New Roman, Times, serif' },
    { label: __('Trebuchet MS, sans-serif', 'news-ticker-block'), value: 'Trebuchet MS, sans-serif' },
    { label: __('Verdana, Geneva, sans-serif', 'news-ticker-block'), value: 'Verdana, Geneva, sans-serif' },
];
const FONT_WEIGHTS = [
    { label: __('Default', 'news-ticker-block'), value: '' }, { label: __('Normal (400)', 'news-ticker-block'), value: 'normal' },
    { label: __('Bold (700)', 'news-ticker-block'), value: 'bold' }, { label: __('Light (300)', 'news-ticker-block'), value: '300' },
    { label: __('Semi-Bold (600)', 'news-ticker-block'), value: '600' },
];

export default function HeaderStylingPanel({ attributes, setAttributes }) {
    const { tickerStyles } = attributes;
    // Ensure defaults are applied if tickerStyles is not fully populated yet
    // It's assumed that `attributes.tickerStyles.default` would be the defaults from block.json,
    // but attribute definitions don't nest .default like that.
    // Instead, the main edit.js or a HOC should provide fully defaulted attributes.
    // For robustness here, we'll check against a local understanding of defaults if needed,
    // or rely on the main edit.js to pass correctly defaulted `currentTickerStyles`.
    // Let's assume `tickerStyles` passed in `attributes` is already correctly merged with defaults.
    const currentTickerStyles = tickerStyles || {};


    const setStyleAttribute = (property, value) => {
        setAttributes({
            tickerStyles: { ...currentTickerStyles, [property]: value },
        });
    };

    return (
        <PanelBody title={__('Header Styling', 'news-ticker-block')} initialOpen={false}>
            <PanelColorSettings
                title={__('Colors', 'news-ticker-block')}
                colorSettings={[
                    {
                        value: currentTickerStyles.headerBackgroundColor,
                        onChange: (v) => setStyleAttribute('headerBackgroundColor',v),
                        label: __('Background', 'news-ticker-block')
                    },
                    {
                        value: currentTickerStyles.headerTextColor,
                        onChange: (v) => setStyleAttribute('headerTextColor',v),
                        label: __('Text (Heading)', 'news-ticker-block')
                    },
                ]}
                disableCustomColors={false}
            />
            <SelectControl
                label={__('Heading Font Family', 'news-ticker-block')}
                value={currentTickerStyles.headerHeadingFontFamily}
                options={FONT_FAMILIES}
                onChange={(v) => setStyleAttribute('headerHeadingFontFamily',v)}
            />
            <TextControl
                label={__('Heading Font Size (e.g., 1.1em, 16px)', 'news-ticker-block')}
                value={currentTickerStyles.headerHeadingFontSize}
                onChange={(v) => setStyleAttribute('headerHeadingFontSize',v)}
            />
            <SelectControl
                label={__('Heading Font Weight', 'news-ticker-block')}
                value={currentTickerStyles.headerHeadingFontWeight}
                options={FONT_WEIGHTS}
                onChange={(v) => setStyleAttribute('headerHeadingFontWeight',v)}
            />
            <TextControl
                label={__('Padding Top (e.g., 0px)', 'news-ticker-block')}
                value={currentTickerStyles.headerPaddingTop}
                onChange={(v) => setStyleAttribute('headerPaddingTop',v)}
            />
            <TextControl
                label={__('Padding Bottom (e.g., 8px)', 'news-ticker-block')}
                value={currentTickerStyles.headerPaddingBottom}
                onChange={(v) => setStyleAttribute('headerPaddingBottom',v)}
            />
        </PanelBody>
    );
}
