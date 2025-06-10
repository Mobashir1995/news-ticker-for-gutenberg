import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';
import { PanelColorSettings } from '@wordpress/block-editor';

export default function ControlsStylingPanel({ attributes, setAttributes }) {
    const { tickerStyles } = attributes;
    const defaultStyles = (attributes.tickerStyles && attributes.tickerStyles.default) ? attributes.tickerStyles.default : {};
    const currentTickerStyles = { ...defaultStyles, ...(tickerStyles || {}) };

    const setStyleAttribute = (property, value) => {
        setAttributes({ tickerStyles: { ...currentTickerStyles, [property]: value } });
    };

    return (
        <PanelBody title={__('Controls (Buttons) Styling', 'news-ticker-block')} initialOpen={false}>
             <PanelColorSettings title={__('Colors', 'news-ticker-block')} colorSettings={[
                { value: currentTickerStyles.controlsButtonBackgroundColor, onChange: (v) => setStyleAttribute('controlsButtonBackgroundColor',v), label: __('Button Background', 'news-ticker-block') },
                { value: currentTickerStyles.controlsButtonTextColor, onChange: (v) => setStyleAttribute('controlsButtonTextColor',v), label: __('Button Text', 'news-ticker-block') },
                { value: currentTickerStyles.controlsButtonBorderColor, onChange: (v) => setStyleAttribute('controlsButtonBorderColor',v), label: __('Button Border', 'news-ticker-block') },
            ]} disableCustomColors={false} />
        </PanelBody>
    );
}
