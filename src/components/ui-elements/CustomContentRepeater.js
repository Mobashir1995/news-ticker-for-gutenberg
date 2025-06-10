import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { Button, Icon } from '@wordpress/components';
import { v4 as uuidv4 } from 'uuid';

export default function CustomContentRepeater({ customContentItems, onChange }) {
    const handleAddItem = () => {
        onChange([...(customContentItems || []), { id: uuidv4(), text: '' }]);
    };
    const handleChangeItem = (newText, index) => {
        const newItems = (customContentItems || []).map((item, i) =>
            i === index ? { ...item, text: newText } : item
        );
        onChange(newItems);
    };
    const handleRemoveItem = (index) => {
        onChange((customContentItems || []).filter((_, i) => i !== index));
    };
    const handleMoveItem = (index, direction) => {
        const newItems = [...(customContentItems || [])];
        const item = newItems[index];
        newItems.splice(index, 1);
        const newIndex = direction === 'up' ? Math.max(0, index - 1) : Math.min(newItems.length, index + 1);
        newItems.splice(newIndex, 0, item);
        onChange(newItems);
    };

    return (
        <div className="news-ticker-custom-content-repeater">
            <h4>{__('Custom Ticker Items', 'news-ticker-block')}</h4>
            {(customContentItems || []).map((item, index) => (
                <div key={item.id} className="custom-content-item">
                    <RichText
                        tagName="p"
                        placeholder={__('Enter custom content here...', 'news-ticker-block')}
                        value={item.text}
                        onChange={(newText) => handleChangeItem(newText, index)}
                        className="custom-content-item-input"
                        keepPlaceholderOnFocus
                    />
                    <div className="custom-content-item-controls">
                        <Button icon={<Icon icon="arrow-up-alt2" />} label={__('Move Up', 'news-ticker-block')} onClick={() => handleMoveItem(index, 'up')} disabled={index === 0} isSmall />
                        <Button icon={<Icon icon="arrow-down-alt2" />} label={__('Move Down', 'news-ticker-block')} onClick={() => handleMoveItem(index, 'down')} disabled={index === (customContentItems || []).length - 1} isSmall />
                        <Button icon={<Icon icon="trash" />} label={__('Remove Item', 'news-ticker-block')} onClick={() => handleRemoveItem(index)} isDestructive isSmall />
                    </div>
                </div>
            ))}
            <Button variant="secondary" onClick={handleAddItem}>
                {__('Add Custom Item', 'news-ticker-block')}
            </Button>
        </div>
    );
}
