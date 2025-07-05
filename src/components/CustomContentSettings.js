import { __ } from '@wordpress/i18n';
import { 
	PanelBody, 
	Button, 
	TextControl, 
	TextareaControl,
	ToggleControl,
	Notice,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { plus, trash, chevronUp, chevronDown } from '@wordpress/icons';

const CustomContentSettings = ( { customContent, onChange } ) => {
	const [ expandedItems, setExpandedItems ] = useState( new Set() );

	const addCustomContent = () => {
		const newItem = {
			id: Date.now(),
			title: '',
			content: '',
			url: '',
			openInNewTab: false,
			enabled: true,
		};
		
		onChange( [ ...customContent, newItem ] );
		setExpandedItems( new Set( [ ...expandedItems, newItem.id ] ) );
	};

	const removeCustomContent = ( index ) => {
		const newContent = customContent.filter( ( _, i ) => i !== index );
		onChange( newContent );
	};

	const updateCustomContent = ( index, field, value ) => {
		const newContent = [ ...customContent ];
		newContent[ index ] = { ...newContent[ index ], [ field ]: value };
		onChange( newContent );
	};

	const moveItem = ( index, direction ) => {
		if ( direction === 'up' && index === 0 ) return;
		if ( direction === 'down' && index === customContent.length - 1 ) return;

		const newContent = [ ...customContent ];
		const targetIndex = direction === 'up' ? index - 1 : index + 1;
		
		[ newContent[ index ], newContent[ targetIndex ] ] = [ newContent[ targetIndex ], newContent[ index ] ];
		onChange( newContent );
	};

	const toggleExpanded = ( id ) => {
		const newExpanded = new Set( expandedItems );
		if ( newExpanded.has( id ) ) {
			newExpanded.delete( id );
		} else {
			newExpanded.add( id );
		}
		setExpandedItems( newExpanded );
	};

	return (
		<PanelBody title={ __( 'Custom Content', 'news-ticker-for-gutenberg' ) } initialOpen={ false }>
			<Notice status="info" isDismissible={ false }>
				{ __( 'Add custom content items that will be appended after the query results.', 'news-ticker-for-gutenberg' ) }
			</Notice>

			<div style={ { marginBottom: '15px' } }>
				<Button
					variant="secondary"
					icon={ plus }
					onClick={ addCustomContent }
				>
					{ __( 'Add Custom Content', 'news-ticker-for-gutenberg' ) }
				</Button>
			</div>

			{ customContent.length === 0 && (
				<div style={ { 
					padding: '20px', 
					textAlign: 'center', 
					backgroundColor: '#f0f0f0', 
					borderRadius: '4px',
					color: '#666'
				} }>
					{ __( 'No custom content added yet. Click "Add Custom Content" to get started.', 'news-ticker-for-gutenberg' ) }
				</div>
			) }

			{ customContent.map( ( item, index ) => (
				<div
					key={ item.id }
					style={ {
						border: '1px solid #ddd',
						borderRadius: '4px',
						marginBottom: '10px',
						overflow: 'hidden',
					} }
				>
					<div
						style={ {
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							padding: '10px 15px',
							backgroundColor: '#f9f9f9',
							borderBottom: expandedItems.has( item.id ) ? '1px solid #ddd' : 'none',
							cursor: 'pointer',
						} }
						onClick={ () => toggleExpanded( item.id ) }
					>
						<div style={ { display: 'flex', alignItems: 'center', gap: '10px' } }>
							<ToggleControl
								checked={ item.enabled }
								onChange={ ( value ) => updateCustomContent( index, 'enabled', value ) }
								onClick={ ( e ) => e.stopPropagation() }
							/>
							<span style={ { 
								fontWeight: 'bold',
								color: item.enabled ? '#000' : '#666',
								textDecoration: item.enabled ? 'none' : 'line-through'
							} }>
								{ item.title || __( 'Untitled Content', 'news-ticker-for-gutenberg' ) }
							</span>
						</div>
						
						<div style={ { display: 'flex', alignItems: 'center', gap: '5px' } }>
							<Button
								variant="tertiary"
								icon={ chevronUp }
								onClick={ ( e ) => {
									e.stopPropagation();
									moveItem( index, 'up' );
								} }
								disabled={ index === 0 }
								label={ __( 'Move Up', 'news-ticker-for-gutenberg' ) }
							/>
							<Button
								variant="tertiary"
								icon={ chevronDown }
								onClick={ ( e ) => {
									e.stopPropagation();
									moveItem( index, 'down' );
								} }
								disabled={ index === customContent.length - 1 }
								label={ __( 'Move Down', 'news-ticker-for-gutenberg' ) }
							/>
							<Button
								variant="tertiary"
								icon={ trash }
								onClick={ ( e ) => {
									e.stopPropagation();
									removeCustomContent( index );
								} }
								label={ __( 'Remove', 'news-ticker-for-gutenberg' ) }
							/>
						</div>
					</div>

					{ expandedItems.has( item.id ) && (
						<div style={ { padding: '15px' } }>
							<TextControl
								label={ __( 'Title', 'news-ticker-for-gutenberg' ) }
								value={ item.title }
								onChange={ ( value ) => updateCustomContent( index, 'title', value ) }
								placeholder={ __( 'Enter title...', 'news-ticker-for-gutenberg' ) }
							/>

							<TextareaControl
								label={ __( 'Content', 'news-ticker-for-gutenberg' ) }
								value={ item.content }
								onChange={ ( value ) => updateCustomContent( index, 'content', value ) }
								placeholder={ __( 'Enter content...', 'news-ticker-for-gutenberg' ) }
								rows={ 3 }
							/>

							<TextControl
								label={ __( 'URL (Optional)', 'news-ticker-for-gutenberg' ) }
								value={ item.url }
								onChange={ ( value ) => updateCustomContent( index, 'url', value ) }
								placeholder={ __( 'https://example.com', 'news-ticker-for-gutenberg' ) }
								type="url"
							/>

							{ item.url && (
								<ToggleControl
									label={ __( 'Open in New Tab', 'news-ticker-for-gutenberg' ) }
									checked={ item.openInNewTab }
									onChange={ ( value ) => updateCustomContent( index, 'openInNewTab', value ) }
								/>
							) }
						</div>
					) }
				</div>
			) ) }

			{ customContent.length > 0 && (
				<div style={ { 
					marginTop: '15px', 
					padding: '10px', 
					backgroundColor: '#f0f8ff', 
					borderRadius: '4px',
					fontSize: '12px',
					color: '#0066cc'
				} }>
					<strong>{ __( 'Tip:', 'news-ticker-for-gutenberg' ) }</strong> { __( 'Custom content items will be displayed after the query results. You can reorder them using the up/down arrows.', 'news-ticker-for-gutenberg' ) }
				</div>
			) }
		</PanelBody>
	);
};

export default CustomContentSettings; 