import { __ } from '@wordpress/i18n'; import { PanelBody } from '@wordpress/components';
export default function HeaderStylingPanel({ attributes, setAttributes }) { return <PanelBody title={__('Header Styling (Placeholder)', 'news-ticker-block')} initialOpen={false}></PanelBody>;}
