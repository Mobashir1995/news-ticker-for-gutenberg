import { __ } from '@wordpress/i18n';
import { 
	PanelBody, 
	ToggleControl, 
	TextControl, 
	SelectControl,
	MediaUpload,
	MediaUploadCheck,
	Button,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

// Simple date formatting function to replace @wordpress/date format
const formatDate = ( formatString, date ) => {
	try {
		const d = new Date( date );
		if ( isNaN( d.getTime() ) ) return d.toLocaleDateString();
		
		const formatMap = {
			'F j, Y': d.toLocaleDateString( 'en-US', { 
				year: 'numeric', 
				month: 'long', 
				day: 'numeric' 
			} ),
			'M j, Y': d.toLocaleDateString( 'en-US', { 
				year: 'numeric', 
				month: 'short', 
				day: 'numeric' 
			} ),
			'm/d/Y': d.toLocaleDateString( 'en-US', { 
				year: 'numeric', 
				month: '2-digit', 
				day: '2-digit' 
			} ),
			'Y-m-d': d.toISOString().split( 'T' )[ 0 ],
			'jS F Y': d.toLocaleDateString( 'en-US', { 
				year: 'numeric', 
				month: 'long', 
				day: 'numeric' 
			} ).replace( /(\d+)/, ( match ) => {
				const day = parseInt( match );
				const suffix = [ 'th', 'st', 'nd', 'rd' ][ day % 10 > 3 ? 0 : ( day % 100 - day % 10 != 10 ) * day % 10 ];
				return day + suffix;
			} ),
			'l, F jS, Y': d.toLocaleDateString( 'en-US', { 
				weekday: 'long',
				year: 'numeric', 
				month: 'long', 
				day: 'numeric' 
			} ).replace( /(\d+)/, ( match ) => {
				const day = parseInt( match );
				const suffix = [ 'th', 'st', 'nd', 'rd' ][ day % 10 > 3 ? 0 : ( day % 100 - day % 10 != 10 ) * day % 10 ];
				return day + suffix;
			} ),
		};
		
		return formatMap[ formatString ] || d.toLocaleDateString();
	} catch ( error ) {
		return date.toLocaleDateString();
	}
};

const ContentSettings = ( { 
	showLogo, 
	logoUrl, 
	logoAlt, 
	showBreakingNews, 
	breakingNewsText, 
	showLiveText, 
	liveText, 
	showDate, 
	dateFormat, 
	onChange 
} ) => {
	// Ensure all props are defined with defaults
	const safeProps = {
		showLogo: showLogo || false,
		logoUrl: logoUrl || '',
		logoAlt: logoAlt || '',
		showBreakingNews: showBreakingNews || false,
		breakingNewsText: breakingNewsText || '',
		showLiveText: showLiveText || false,
		liveText: liveText || '',
		showDate: showDate || false,
		dateFormat: dateFormat || 'M j, Y',
		onChange: onChange || (() => {}),
	};
	const mediaUpload = useSelect( ( select ) => {
		try {
			return select( 'core/block-editor' ).getSettings().mediaUpload;
		} catch ( error ) {
			console.warn( 'MediaUpload not available:', error );
			return null;
		}
	}, [] );

	const dateFormats = [
		{ label: __( 'January 1, 2024', 'news-ticker-for-gutenberg' ), value: 'F j, Y' },
		{ label: __( 'Jan 1, 2024', 'news-ticker-for-gutenberg' ), value: 'M j, Y' },
		{ label: __( '01/01/2024', 'news-ticker-for-gutenberg' ), value: 'm/d/Y' },
		{ label: __( '2024-01-01', 'news-ticker-for-gutenberg' ), value: 'Y-m-d' },
		{ label: __( '1st January 2024', 'news-ticker-for-gutenberg' ), value: 'jS F Y' },
		{ label: __( 'Monday, January 1st, 2024', 'news-ticker-for-gutenberg' ), value: 'l, F jS, Y' },
	];

	return (
		<PanelBody title={ __( 'Content Settings', 'news-ticker-for-gutenberg' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Logo', 'news-ticker-for-gutenberg' ) }
				checked={ safeProps.showLogo }
				onChange={ ( value ) => safeProps.onChange( 'showLogo', value ) }
			/>

			{ safeProps.showLogo && mediaUpload && (
				<>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) => {
								safeProps.onChange( 'logoUrl', media.url );
								safeProps.onChange( 'logoAlt', media.alt || '' );
							} }
							allowedTypes={ [ 'image' ] }
							value={ safeProps.logoUrl }
							render={ ( { open } ) => (
								<div>
									{ safeProps.logoUrl ? (
										<div style={ { marginBottom: '10px' } }>
											<img 
												src={ safeProps.logoUrl } 
												alt={ safeProps.logoAlt } 
												style={ { 
													maxWidth: '100px', 
													height: 'auto',
													border: '1px solid #ddd',
													borderRadius: '4px',
													padding: '5px'
												} } 
											/>
											<Button 
												isDestructive 
												variant="tertiary" 
												onClick={ () => {
													safeProps.onChange( 'logoUrl', '' );
													safeProps.onChange( 'logoAlt', '' );
												} }
												style={ { marginLeft: '10px' } }
											>
												{ __( 'Remove', 'news-ticker-for-gutenberg' ) }
											</Button>
										</div>
									) : (
										<Button 
											variant="secondary" 
											onClick={ open }
											style={ { marginBottom: '10px' } }
										>
											{ __( 'Choose Logo', 'news-ticker-for-gutenberg' ) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>

					<TextControl
						label={ __( 'Logo Alt Text', 'news-ticker-for-gutenberg' ) }
						value={ safeProps.logoAlt }
						onChange={ ( value ) => safeProps.onChange( 'logoAlt', value ) }
						help={ __( 'Alternative text for the logo image.', 'news-ticker-for-gutenberg' ) }
					/>
				</>
			) }

			<ToggleControl
				label={ __( 'Show Breaking News', 'news-ticker-for-gutenberg' ) }
				checked={ safeProps.showBreakingNews }
				onChange={ ( value ) => safeProps.onChange( 'showBreakingNews', value ) }
			/>

			{ safeProps.showBreakingNews && (
				<TextControl
					label={ __( 'Breaking News Text', 'news-ticker-for-gutenberg' ) }
					value={ safeProps.breakingNewsText }
					onChange={ ( value ) => safeProps.onChange( 'breakingNewsText', value ) }
					help={ __( 'Text to display for breaking news section.', 'news-ticker-for-gutenberg' ) }
				/>
			) }

			<ToggleControl
				label={ __( 'Show Live Text', 'news-ticker-for-gutenberg' ) }
				checked={ safeProps.showLiveText }
				onChange={ ( value ) => safeProps.onChange( 'showLiveText', value ) }
			/>

			{ safeProps.showLiveText && (
				<TextControl
					label={ __( 'Live Text', 'news-ticker-for-gutenberg' ) }
					value={ safeProps.liveText }
					onChange={ ( value ) => safeProps.onChange( 'liveText', value ) }
					help={ __( 'Text to display for live indicator.', 'news-ticker-for-gutenberg' ) }
				/>
			) }

			<ToggleControl
				label={ __( 'Show Date', 'news-ticker-for-gutenberg' ) }
				checked={ safeProps.showDate }
				onChange={ ( value ) => safeProps.onChange( 'showDate', value ) }
			/>

			{ safeProps.showDate && (
				<SelectControl
					label={ __( 'Date Format', 'news-ticker-for-gutenberg' ) }
					value={ safeProps.dateFormat }
					options={ dateFormats }
					onChange={ ( value ) => safeProps.onChange( 'dateFormat', value ) }
					help={ __( 'Choose the format for displaying the date.', 'news-ticker-for-gutenberg' ) }
				/>
			) }

			{ safeProps.showDate && safeProps.dateFormat && (
				<div style={ { 
					marginTop: '10px', 
					padding: '10px', 
					backgroundColor: '#f0f0f0', 
					borderRadius: '4px',
					fontSize: '12px'
				} }>
					<strong>{ __( 'Preview:', 'news-ticker-for-gutenberg' ) }</strong> { formatDate( safeProps.dateFormat, new Date() ) }
				</div>
			) }
		</PanelBody>
	);
};

export default ContentSettings; 