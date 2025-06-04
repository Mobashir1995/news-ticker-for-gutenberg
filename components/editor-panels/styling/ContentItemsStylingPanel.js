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

export default function ContentItemsStylingPanel({ attributes, setAttributes }) {
    const { tickerStyles } = attributes;
    const currentTickerStyles = tickerStyles || {};

    const setStyleAttribute = (property, value) => {
        setAttributes({
            tickerStyles: { ...currentTickerStyles, [property]: value },
        });
    };

    return (
        <PanelBody title={__('Content Items Styling', 'news-ticker-block')} initialOpen={false}>
            <PanelColorSettings
                title={__('Colors', 'news-ticker-block')}
                colorSettings={[
                    {
                        value: currentTickerStyles.contentBackgroundColor,
                        onChange: (v) => setStyleAttribute('contentBackgroundColor',v),
                        label: __('Background (Content Area)', 'news-ticker-block')
                    },
                    {
                        value: currentTickerStyles.contentItemTextColor,
                        onChange: (v) => setStyleAttribute('contentItemTextColor',v),
                        label: __('Item Text', 'news-ticker-block')
                    },
                    {
                        value: currentTickerStyles.contentItemLinkColor,
                        onChange: (v) => setStyleAttribute('contentItemLinkColor',v),
                        label: __('Item Link (Queried Posts)', 'news-ticker-block')
                    },
                ]}
                disableCustomColors={false}
            />
            <SelectControl
                label={__('Item Font Family', 'news-ticker-block')}
                value={currentTickerStyles.contentItemFontFamily}
                options={FONT_FAMILIES}
                onChange={(v) => setStyleAttribute('contentItemFontFamily',v)}
            />
            <TextControl
                label={__('Item Font Size (e.g., 0.95em, 14px)', 'news-ticker-block')}
                value={currentTickerStyles.contentItemFontSize}
                onChange={(v) => setStyleAttribute('contentItemFontSize',v)}
            />
            <TextControl
                label={__('Item Line Height (e.g., 1.6)', 'news-ticker-block')}
                value={currentTickerStyles.contentItemLineHeight}
                onChange={(v) => setStyleAttribute('contentItemLineHeight',v)}
            />
        </PanelBody>
    );
}
