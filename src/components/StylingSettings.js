import { __ } from '@wordpress/i18n';
import { 
	PanelBody, 
	ColorPalette,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

const StylingSettings = ( { 
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
	onChange 
} ) => {
	const { themeColors, customColors } = useSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		const settings = getSettings();
		return {
			themeColors: settings.colors || [],
			customColors: settings.customColors || [],
		};
	}, [] );

	const fontWeights = [
		{ label: __( 'Normal', 'news-ticker-for-gutenberg' ), value: '400' },
		{ label: __( 'Bold', 'news-ticker-for-gutenberg' ), value: '700' },
		{ label: __( 'Light', 'news-ticker-for-gutenberg' ), value: '300' },
		{ label: __( 'Medium', 'news-ticker-for-gutenberg' ), value: '500' },
		{ label: __( 'Semi Bold', 'news-ticker-for-gutenberg' ), value: '600' },
		{ label: __( 'Extra Bold', 'news-ticker-for-gutenberg' ), value: '800' },
	];

	const fontFamilies = [
		{ label: __( 'Default', 'news-ticker-for-gutenberg' ), value: '' },
		{ label: 'Arial', value: 'Arial, sans-serif' },
		{ label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
		{ label: 'Times New Roman', value: 'Times New Roman, serif' },
		{ label: 'Georgia', value: 'Georgia, serif' },
		{ label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
		{ label: 'Courier New', value: 'Courier New, monospace' },
		{ label: 'Impact', value: 'Impact, Charcoal, sans-serif' },
		{ label: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
		{ label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
		{ label: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
		{ label: 'Lucida Sans Unicode', value: 'Lucida Sans Unicode, Lucida Grande, sans-serif' },
	];

	return (
		<PanelBody title={ __( 'Styling Settings', 'news-ticker-for-gutenberg' ) } initialOpen={ false }>
			{ /* Colors */ }
			<div style={ { marginBottom: '20px' } }>
				<h4>{ __( 'Colors', 'news-ticker-for-gutenberg' ) }</h4>
				
				<div style={ { marginBottom: '15px' } }>
					<label style={ { display: 'block', marginBottom: '5px', fontWeight: 'bold' } }>
						{ __( 'Background Color', 'news-ticker-for-gutenberg' ) }
					</label>
					<ColorPalette
						value={ backgroundColor }
						onChange={ ( value ) => onChange( 'backgroundColor', value ) }
						colors={ [ ...themeColors, ...customColors ] }
					/>
				</div>

				<div style={ { marginBottom: '15px' } }>
					<label style={ { display: 'block', marginBottom: '5px', fontWeight: 'bold' } }>
						{ __( 'Text Color', 'news-ticker-for-gutenberg' ) }
					</label>
					<ColorPalette
						value={ textColor }
						onChange={ ( value ) => onChange( 'textColor', value ) }
						colors={ [ ...themeColors, ...customColors ] }
					/>
				</div>

				<div style={ { marginBottom: '15px' } }>
					<label style={ { display: 'block', marginBottom: '5px', fontWeight: 'bold' } }>
						{ __( 'Accent Color', 'news-ticker-for-gutenberg' ) }
					</label>
					<ColorPalette
						value={ accentColor }
						onChange={ ( value ) => onChange( 'accentColor', value ) }
						colors={ [ ...themeColors, ...customColors ] }
					/>
				</div>
			</div>

			{ /* Typography */ }
			<div style={ { marginBottom: '20px' } }>
				<h4>{ __( 'Typography', 'news-ticker-for-gutenberg' ) }</h4>
				
				<UnitControl
					label={ __( 'Font Size', 'news-ticker-for-gutenberg' ) }
					value={ fontSize }
					onChange={ ( value ) => onChange( 'fontSize', value ) }
					units={ [
						{ value: 'px', label: 'px', default: 16 },
						{ value: 'em', label: 'em', default: 1 },
						{ value: 'rem', label: 'rem', default: 1 },
						{ value: '%', label: '%', default: 100 },
					] }
				/>

				<SelectControl
					label={ __( 'Font Family', 'news-ticker-for-gutenberg' ) }
					value={ fontFamily }
					options={ fontFamilies }
					onChange={ ( value ) => onChange( 'fontFamily', value ) }
				/>

				<SelectControl
					label={ __( 'Font Weight', 'news-ticker-for-gutenberg' ) }
					value={ fontWeight }
					options={ fontWeights }
					onChange={ ( value ) => onChange( 'fontWeight', value ) }
				/>

				<RangeControl
					label={ __( 'Line Height', 'news-ticker-for-gutenberg' ) }
					value={ parseFloat( lineHeight ) }
					onChange={ ( value ) => onChange( 'lineHeight', value.toString() ) }
					min={ 0.5 }
					max={ 3 }
					step={ 0.1 }
				/>
			</div>

			{ /* Spacing */ }
			<div style={ { marginBottom: '20px' } }>
				<h4>{ __( 'Spacing', 'news-ticker-for-gutenberg' ) }</h4>
				
				<div style={ { marginBottom: '15px' } }>
					<label style={ { display: 'block', marginBottom: '5px', fontWeight: 'bold' } }>
						{ __( 'Padding', 'news-ticker-for-gutenberg' ) }
					</label>
					<div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } }>
						<UnitControl
							label={ __( 'Top', 'news-ticker-for-gutenberg' ) }
							value={ padding.top }
							onChange={ ( value ) => onChange( 'padding', { ...padding, top: value } ) }
							units={ [
								{ value: 'px', label: 'px', default: 10 },
								{ value: 'em', label: 'em', default: 0.5 },
								{ value: 'rem', label: 'rem', default: 0.5 },
								{ value: '%', label: '%', default: 1 },
							] }
						/>
						<UnitControl
							label={ __( 'Right', 'news-ticker-for-gutenberg' ) }
							value={ padding.right }
							onChange={ ( value ) => onChange( 'padding', { ...padding, right: value } ) }
							units={ [
								{ value: 'px', label: 'px', default: 15 },
								{ value: 'em', label: 'em', default: 0.75 },
								{ value: 'rem', label: 'rem', default: 0.75 },
								{ value: '%', label: '%', default: 1 },
							] }
						/>
						<UnitControl
							label={ __( 'Bottom', 'news-ticker-for-gutenberg' ) }
							value={ padding.bottom }
							onChange={ ( value ) => onChange( 'padding', { ...padding, bottom: value } ) }
							units={ [
								{ value: 'px', label: 'px', default: 10 },
								{ value: 'em', label: 'em', default: 0.5 },
								{ value: 'rem', label: 'rem', default: 0.5 },
								{ value: '%', label: '%', default: 1 },
							] }
						/>
						<UnitControl
							label={ __( 'Left', 'news-ticker-for-gutenberg' ) }
							value={ padding.left }
							onChange={ ( value ) => onChange( 'padding', { ...padding, left: value } ) }
							units={ [
								{ value: 'px', label: 'px', default: 15 },
								{ value: 'em', label: 'em', default: 0.75 },
								{ value: 'rem', label: 'rem', default: 0.75 },
								{ value: '%', label: '%', default: 1 },
							] }
						/>
					</div>
				</div>

				<div style={ { marginBottom: '15px' } }>
					<label style={ { display: 'block', marginBottom: '5px', fontWeight: 'bold' } }>
						{ __( 'Margin', 'news-ticker-for-gutenberg' ) }
					</label>
					<div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } }>
						<UnitControl
							label={ __( 'Top', 'news-ticker-for-gutenberg' ) }
							value={ margin.top }
							onChange={ ( value ) => onChange( 'margin', { ...margin, top: value } ) }
							units={ [
								{ value: 'px', label: 'px', default: 0 },
								{ value: 'em', label: 'em', default: 0 },
								{ value: 'rem', label: 'rem', default: 0 },
								{ value: '%', label: '%', default: 0 },
							] }
						/>
						<UnitControl
							label={ __( 'Right', 'news-ticker-for-gutenberg' ) }
							value={ margin.right }
							onChange={ ( value ) => onChange( 'margin', { ...margin, right: value } ) }
							units={ [
								{ value: 'px', label: 'px', default: 0 },
								{ value: 'em', label: 'em', default: 0 },
								{ value: 'rem', label: 'rem', default: 0 },
								{ value: '%', label: '%', default: 0 },
							] }
						/>
						<UnitControl
							label={ __( 'Bottom', 'news-ticker-for-gutenberg' ) }
							value={ margin.bottom }
							onChange={ ( value ) => onChange( 'margin', { ...margin, bottom: value } ) }
							units={ [
								{ value: 'px', label: 'px', default: 0 },
								{ value: 'em', label: 'em', default: 0 },
								{ value: 'rem', label: 'rem', default: 0 },
								{ value: '%', label: '%', default: 0 },
							] }
						/>
						<UnitControl
							label={ __( 'Left', 'news-ticker-for-gutenberg' ) }
							value={ margin.left }
							onChange={ ( value ) => onChange( 'margin', { ...margin, left: value } ) }
							units={ [
								{ value: 'px', label: 'px', default: 0 },
								{ value: 'em', label: 'em', default: 0 },
								{ value: 'rem', label: 'rem', default: 0 },
								{ value: '%', label: '%', default: 0 },
							] }
						/>
					</div>
				</div>
			</div>

			{ /* Border */ }
			<div style={ { marginBottom: '20px' } }>
				<h4>{ __( 'Border', 'news-ticker-for-gutenberg' ) }</h4>
				
				<UnitControl
					label={ __( 'Border Radius', 'news-ticker-for-gutenberg' ) }
					value={ borderRadius }
					onChange={ ( value ) => onChange( 'borderRadius', value ) }
					units={ [
						{ value: 'px', label: 'px', default: 0 },
						{ value: 'em', label: 'em', default: 0 },
						{ value: 'rem', label: 'rem', default: 0 },
						{ value: '%', label: '%', default: 0 },
					] }
				/>
			</div>
		</PanelBody>
	);
};

export default StylingSettings; 