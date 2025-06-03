import { __ } from '@wordpress/i18n'; import { PanelBody } from '@wordpress/components';
export default function ContentItemsStylingPanel({ attributes, setAttributes }) { return <PanelBody title={__('Content Items Styling (Placeholder)', 'news-ticker-block')} initialOpen={false}></PanelBody>;}
