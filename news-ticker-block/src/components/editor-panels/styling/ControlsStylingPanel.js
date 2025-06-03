import { __ } from '@wordpress/i18n'; import { PanelBody } from '@wordpress/components';
export default function ControlsStylingPanel({ attributes, setAttributes }) { return <PanelBody title={__('Controls Styling (Placeholder)', 'news-ticker-block')} initialOpen={false}></PanelBody>;}
