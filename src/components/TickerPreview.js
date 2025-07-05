import { __ } from '@wordpress/i18n';
import { Notice, Spinner } from '@wordpress/components';
import { format } from '@wordpress/date';

const TickerPreview = ( { attributes, tickerItems, isLoading, error } ) => {
	const {
		showLogo,
		logoUrl,
		logoAlt,
		showBreakingNews,
		breakingNewsText,
		showLiveText,
		liveText,
		showDate,
		dateFormat,
		showControls,
		showPlayPause,
		showNavigation,
		accentColor,
	} = attributes;

	if ( isLoading ) {
		return (
			<div style={ { 
				padding: '20px', 
				textAlign: 'center',
				border: '2px dashed #ddd',
				borderRadius: '4px',
				backgroundColor: '#f9f9f9'
			} }>
				<Spinner />
				<p style={ { marginTop: '10px', color: '#666' } }>
					{ __( 'Loading ticker content...', 'news-ticker-for-gutenberg' ) }
				</p>
			</div>
		);
	}

	if ( error ) {
		return (
			<Notice status="error" isDismissible={ false }>
				{ __( 'Error loading ticker content: ', 'news-ticker-for-gutenberg' ) } { error }
			</Notice>
		);
	}

	if ( ! tickerItems || tickerItems.length === 0 ) {
		return (
			<div style={ { 
				padding: '20px', 
				textAlign: 'center',
				border: '2px dashed #ddd',
				borderRadius: '4px',
				backgroundColor: '#f9f9f9'
			} }>
				<p style={ { color: '#666', margin: 0 } }>
					{ __( 'No content available for the ticker. Please configure the query settings or add custom content.', 'news-ticker-for-gutenberg' ) }
				</p>
			</div>
		);
	}

	return (
		<div className="ntfg-ticker-preview">
			{ /* Header */ }
			<div className="ntfg-ticker-header" style={ { 
				display: 'flex', 
				alignItems: 'center', 
				gap: '15px',
				marginBottom: '10px',
				flexWrap: 'wrap'
			} }>
				{ showLogo && logoUrl && (
					<div className="ntfg-logo">
						<img 
							src={ logoUrl } 
							alt={ logoAlt } 
							style={ { 
								maxHeight: '30px', 
								width: 'auto',
								borderRadius: '4px'
							} } 
						/>
					</div>
				) }
				
				{ showBreakingNews && (
					<div 
						className="ntfg-breaking-news" 
						style={ { 
							color: accentColor,
							fontWeight: 'bold',
							fontSize: '14px',
							textTransform: 'uppercase',
							letterSpacing: '0.5px'
						} }
					>
						{ breakingNewsText }
					</div>
				) }
				
				{ showLiveText && (
					<div 
						className="ntfg-live-text" 
						style={ { 
							color: accentColor,
							fontWeight: 'bold',
							fontSize: '12px',
							textTransform: 'uppercase',
							backgroundColor: accentColor,
							color: '#fff',
							padding: '2px 8px',
							borderRadius: '12px',
							animation: 'pulse 2s infinite'
						} }
					>
						{ liveText }
					</div>
				) }
				
				{ showDate && (
					<div 
						className="ntfg-date"
						style={ { 
							fontSize: '12px',
							color: '#999',
							marginLeft: 'auto'
						} }
					>
						{ format( dateFormat || 'M j, Y', new Date() ) }
					</div>
				) }
			</div>
			
			{ /* Content */ }
			<div className="ntfg-ticker-content" style={ { 
				position: 'relative',
				overflow: 'hidden',
				minHeight: '40px',
				display: 'flex',
				alignItems: 'center'
			} }>
				<div className="ntfg-ticker-items" style={ { 
					display: 'flex',
					gap: '30px',
					alignItems: 'center',
					animation: 'scroll-left 20s linear infinite',
					whiteSpace: 'nowrap'
				} }>
					{ tickerItems.map( ( item, index ) => (
						<div 
							key={ index }
							className="ntfg-ticker-item"
							style={ { 
								display: 'flex',
								alignItems: 'center',
								gap: '10px',
								minWidth: 'max-content'
							} }
						>
							{ item.url ? (
								<a 
									href={ item.url }
									target={ item.openInNewTab ? '_blank' : '_self' }
									rel={ item.openInNewTab ? 'noopener noreferrer' : '' }
									style={ { 
										color: 'inherit',
										textDecoration: 'none',
										display: 'flex',
										alignItems: 'center',
										gap: '10px'
									} }
								>
									<span style={ { fontWeight: 'bold' } }>
										{ item.title || item.content }
									</span>
									{ item.content && item.title && (
										<span style={ { color: '#999', fontSize: '0.9em' } }>
											{ item.content }
										</span>
									) }
									{ item.date && (
										<span style={ { color: '#999', fontSize: '0.8em' } }>
											{ item.date }
										</span>
									) }
								</a>
							) : (
								<>
									<span style={ { fontWeight: 'bold' } }>
										{ item.title || item.content }
									</span>
									{ item.content && item.title && (
										<span style={ { color: '#999', fontSize: '0.9em' } }>
											{ item.content }
										</span>
									) }
									{ item.date && (
										<span style={ { color: '#999', fontSize: '0.8em' } }>
											{ item.date }
										</span>
									) }
								</>
							) }
						</div>
					) ) }
				</div>
			</div>
			
			{ /* Controls */ }
			{ showControls && (
				<div className="ntfg-ticker-controls" style={ { 
					display: 'flex',
					alignItems: 'center',
					gap: '10px',
					marginTop: '10px',
					justifyContent: 'flex-end'
				} }>
					{ showNavigation && (
						<>
							<button 
								className="ntfg-nav-prev"
								style={ { 
									background: 'none',
									border: '1px solid #ddd',
									borderRadius: '50%',
									width: '30px',
									height: '30px',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '16px'
								} }
								aria-label={ __( 'Previous', 'news-ticker-for-gutenberg' ) }
							>
								‹
							</button>
							<button 
								className="ntfg-nav-next"
								style={ { 
									background: 'none',
									border: '1px solid #ddd',
									borderRadius: '50%',
									width: '30px',
									height: '30px',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '16px'
								} }
								aria-label={ __( 'Next', 'news-ticker-for-gutenberg' ) }
							>
								›
							</button>
						</>
					) }
					
					{ showPlayPause && (
						<button 
							className="ntfg-play-pause"
							style={ { 
								background: 'none',
								border: '1px solid #ddd',
								borderRadius: '50%',
								width: '30px',
								height: '30px',
								cursor: 'pointer',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: '12px'
							} }
							aria-label={ __( 'Play/Pause', 'news-ticker-for-gutenberg' ) }
						>
							▶
						</button>
					) }
				</div>
			) }

			{ /* Preview Notice */ }
			<div style={ { 
				marginTop: '15px', 
				padding: '8px 12px', 
				backgroundColor: '#e7f3ff', 
				borderRadius: '4px',
				fontSize: '11px',
				color: '#0066cc',
				textAlign: 'center'
			} }>
				{ __( 'Preview - Animation and controls will work on the frontend', 'news-ticker-for-gutenberg' ) }
			</div>

			{ /* CSS Animation for Preview */ }
			<style>
				{`
					@keyframes scroll-left {
						0% { transform: translateX(100%); }
						100% { transform: translateX(-100%); }
					}
					
					@keyframes pulse {
						0%, 100% { opacity: 1; }
						50% { opacity: 0.7; }
					}
				`}
			</style>
		</div>
	);
};

export default TickerPreview; 