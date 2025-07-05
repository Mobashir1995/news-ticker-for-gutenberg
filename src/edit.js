import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, BlockControls } from '@wordpress/block-editor';
import { 
	PanelBody, 
	ToggleControl, 
	SelectControl, 
	RangeControl, 
	TextControl, 
	TextareaControl,
	Button,
	Notice,
	Spinner,
	BaseControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { 
	chevronUp, 
	chevronDown, 
	chevronLeft, 
	chevronRight,
	play,
	pause,
	settings,
} from '@wordpress/icons';

import AnimationSettings from './components/AnimationSettings';
import ContentSettings from './components/ContentSettings';
import QuerySettings from './components/QuerySettings';
import CustomContentSettings from './components/CustomContentSettings';
import StylingSettings from './components/StylingSettings';
import TickerPreview from './components/TickerPreview';
import { useTickerData } from './hooks/useTickerData';

const NewsTickerBlock = ( { attributes, setAttributes } ) => {
	const {
		// Animation settings
		animationType,
		animationSpeed,
		animationDirection,
		
		// Control settings
		showControls,
		showPlayPause,
		showNavigation,
		pauseOnHover,
		
		// Content settings
		showLogo,
		logoUrl,
		logoAlt,
		showBreakingNews,
		breakingNewsText,
		showLiveText,
		liveText,
		showDate,
		dateFormat,
		
		// Query settings
		postType,
		selectedTaxonomies,
		selectedPosts,
		postsPerPage,
		orderBy,
		order,
		
		// Custom content
		customContent,
		
		// Styling
		backgroundColor,
		textColor,
		accentColor,
		fontSize,
		fontFamily,
		fontWeight,
		lineHeight,
		borderRadius,
		padding,
		margin,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'ntfg-news-ticker-editor',
		style: {
			backgroundColor,
			color: textColor,
			fontSize,
			fontFamily,
			fontWeight,
			lineHeight,
			borderRadius,
			padding: `${padding.top} ${padding.right} ${padding.bottom} ${padding.left}`,
			margin: `${margin.top} ${margin.right} ${margin.bottom} ${margin.left}`,
		},
	} );

	// Get ticker data
	const { tickerItems, isLoading, error } = useTickerData( attributes );

	return (
		<>
			<BlockControls>
				<Button
					icon={ settings }
					label={ __( 'Ticker Settings', 'news-ticker-for-gutenberg' ) }
					onClick={ () => {} }
				/>
			</BlockControls>

			<InspectorControls>
				<AnimationSettings
					animationType={ animationType }
					animationSpeed={ animationSpeed }
					animationDirection={ animationDirection }
					onChange={ ( key, value ) => setAttributes( { [ key ]: value } ) }
				/>

				<ContentSettings
					showLogo={ showLogo }
					logoUrl={ logoUrl }
					logoAlt={ logoAlt }
					showBreakingNews={ showBreakingNews }
					breakingNewsText={ breakingNewsText }
					showLiveText={ showLiveText }
					liveText={ liveText }
					showDate={ showDate }
					dateFormat={ dateFormat }
					onChange={ ( key, value ) => setAttributes( { [ key ]: value } ) }
				/>

				<QuerySettings
					postType={ postType }
					selectedTaxonomies={ selectedTaxonomies }
					selectedPosts={ selectedPosts }
					postsPerPage={ postsPerPage }
					orderBy={ orderBy }
					order={ order }
					onChange={ ( key, value ) => setAttributes( { [ key ]: value } ) }
				/>

				<CustomContentSettings
					customContent={ customContent }
					onChange={ ( value ) => setAttributes( { customContent: value } ) }
				/>

				<StylingSettings
					backgroundColor={ backgroundColor }
					textColor={ textColor }
					accentColor={ accentColor }
					fontSize={ fontSize }
					fontFamily={ fontFamily }
					fontWeight={ fontWeight }
					lineHeight={ lineHeight }
					borderRadius={ borderRadius }
					padding={ padding }
					margin={ margin }
					onChange={ ( key, value ) => setAttributes( { [ key ]: value } ) }
				/>

				<PanelBody title={ __( 'Control Settings', 'news-ticker-for-gutenberg' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Show Controls', 'news-ticker-for-gutenberg' ) }
						checked={ showControls }
						onChange={ ( value ) => setAttributes( { showControls: value } ) }
					/>
					
					{ showControls && (
						<>
							<ToggleControl
								label={ __( 'Show Play/Pause Button', 'news-ticker-for-gutenberg' ) }
								checked={ showPlayPause }
								onChange={ ( value ) => setAttributes( { showPlayPause: value } ) }
							/>
							
							<ToggleControl
								label={ __( 'Show Navigation Arrows', 'news-ticker-for-gutenberg' ) }
								checked={ showNavigation }
								onChange={ ( value ) => setAttributes( { showNavigation: value } ) }
							/>
							
							<ToggleControl
								label={ __( 'Pause on Hover', 'news-ticker-for-gutenberg' ) }
								checked={ pauseOnHover }
								onChange={ ( value ) => setAttributes( { pauseOnHover: value } ) }
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
								<TickerPreview 
					attributes={ attributes }
					tickerItems={ tickerItems }
					isLoading={ isLoading }
					error={ error }
				/>
			</div>
		</>
	);
};

export default NewsTickerBlock; 