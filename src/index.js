import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import NewsTickerBlock from './edit';
import './style.scss';

// Register the block using block.json
registerBlockType( 'news-ticker-for-gutenberg/news-ticker', {
	edit: NewsTickerBlock,
} ); 