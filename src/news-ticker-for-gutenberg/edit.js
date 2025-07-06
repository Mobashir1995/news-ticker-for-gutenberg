import { useBlockProps } from '@wordpress/block-editor';
import './editor.css';

export default function Edit() {
    return(
        <h1 {...useBlockProps()} className="h1">News Ticker for Gutenberg</h1>
    )
}