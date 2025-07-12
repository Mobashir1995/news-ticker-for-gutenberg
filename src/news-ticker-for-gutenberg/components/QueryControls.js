import { __ } from '@wordpress/i18n';
import { TextControl, SelectControl } from '@wordpress/components';
import { usePostTypes } from '../hooks/useWordPressData';

/**
 * Query Controls Component
 * Handles the main query settings for the news ticker
 */
export function QueryControls({ attributes, setAttributes }) {
    const { postType, postsToShow, orderby, order } = attributes;
    const postTypes = usePostTypes();

    const orderbyOptions = [
        { label: 'Date', value: 'date' },
        { label: 'Title', value: 'title' },
        { label: 'Menu Order', value: 'menu_order' },
        { label: 'Random', value: 'rand' }
    ];

    const orderOptions = [
        { label: 'Descending', value: 'desc' },
        { label: 'Ascending', value: 'asc' }
    ];

    return (
        <>
            <SelectControl
                label="Post Type"
                value={postType}
                options={postTypes}
                onChange={value => setAttributes({ postType: value })}
            />

            <TextControl
                label={__('Posts to Show', 'news-ticker-for-gutenberg')}
                type="number"
                value={postsToShow}
                onChange={value => setAttributes({ postsToShow: value })}
            />

            <SelectControl
                label={__('Order By', 'news-ticker-for-gutenberg')}
                value={orderby}
                options={orderbyOptions}
                onChange={value => setAttributes({ orderby: value })}
            />

            <SelectControl
                label={__('Order', 'news-ticker-for-gutenberg')}
                value={order}
                options={orderOptions}
                onChange={value => setAttributes({ order: value })}
            />
        </>
    );
} 