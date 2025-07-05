import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';

const AnimationSettings = ( { animationType, animationSpeed, animationDirection, onChange } ) => {
	const animationTypes = [
		{ label: __( 'Scrolling Ticker', 'news-ticker-for-gutenberg' ), value: 'scrolling' },
		{ label: __( 'Up Down Ticker', 'news-ticker-for-gutenberg' ), value: 'updown' },
		{ label: __( 'Left-Right Sliding', 'news-ticker-for-gutenberg' ), value: 'sliding' },
		{ label: __( 'Typography Effect', 'news-ticker-for-gutenberg' ), value: 'typography' },
		{ label: __( 'Fade Effect', 'news-ticker-for-gutenberg' ), value: 'fade' },
		{ label: __( 'Typing Effect', 'news-ticker-for-gutenberg' ), value: 'typing' },
		{ label: __( 'Bounce Effect', 'news-ticker-for-gutenberg' ), value: 'bounce' },
		{ label: __( 'Slide Up Effect', 'news-ticker-for-gutenberg' ), value: 'slideup' },
		{ label: __( 'Zoom Effect', 'news-ticker-for-gutenberg' ), value: 'zoom' },
		{ label: __( 'Flip Effect', 'news-ticker-for-gutenberg' ), value: 'flip' },
	];

	const directions = [
		{ label: __( 'Left to Right', 'news-ticker-for-gutenberg' ), value: 'left' },
		{ label: __( 'Right to Left', 'news-ticker-for-gutenberg' ), value: 'right' },
		{ label: __( 'Top to Bottom', 'news-ticker-for-gutenberg' ), value: 'top' },
		{ label: __( 'Bottom to Top', 'news-ticker-for-gutenberg' ), value: 'bottom' },
	];

	return (
		<PanelBody title={ __( 'Animation Settings', 'news-ticker-for-gutenberg' ) } initialOpen={ true }>
			<SelectControl
				label={ __( 'Animation Type', 'news-ticker-for-gutenberg' ) }
				value={ animationType }
				options={ animationTypes }
				onChange={ ( value ) => onChange( 'animationType', value ) }
				help={ __( 'Choose the type of animation for the ticker.', 'news-ticker-for-gutenberg' ) }
			/>

			<RangeControl
				label={ __( 'Animation Speed', 'news-ticker-for-gutenberg' ) }
				value={ animationSpeed }
				onChange={ ( value ) => onChange( 'animationSpeed', value ) }
				min={ 10 }
				max={ 200 }
				step={ 5 }
				help={ __( 'Adjust the speed of the animation (10 = slow, 200 = fast).', 'news-ticker-for-gutenberg' ) }
			/>

			{ ( animationType === 'scrolling' || animationType === 'sliding' ) && (
				<SelectControl
					label={ __( 'Animation Direction', 'news-ticker-for-gutenberg' ) }
					value={ animationDirection }
					options={ directions }
					onChange={ ( value ) => onChange( 'animationDirection', value ) }
					help={ __( 'Choose the direction of the animation.', 'news-ticker-for-gutenberg' ) }
				/>
			) }

			{ animationType === 'updown' && (
				<SelectControl
					label={ __( 'Animation Direction', 'news-ticker-for-gutenberg' ) }
					value={ animationDirection }
					options={ [
						{ label: __( 'Up to Down', 'news-ticker-for-gutenberg' ), value: 'up' },
						{ label: __( 'Down to Up', 'news-ticker-for-gutenberg' ), value: 'down' },
					] }
					onChange={ ( value ) => onChange( 'animationDirection', value ) }
					help={ __( 'Choose the direction of the vertical animation.', 'news-ticker-for-gutenberg' ) }
				/>
			) }

			{ animationType === 'typography' && (
				<SelectControl
					label={ __( 'Typography Effect', 'news-ticker-for-gutenberg' ) }
					value={ animationDirection }
					options={ [
						{ label: __( 'Typewriter', 'news-ticker-for-gutenberg' ), value: 'typewriter' },
						{ label: __( 'Glitch', 'news-ticker-for-gutenberg' ), value: 'glitch' },
						{ label: __( 'Wave', 'news-ticker-for-gutenberg' ), value: 'wave' },
						{ label: __( 'Rainbow', 'news-ticker-for-gutenberg' ), value: 'rainbow' },
						{ label: __( 'Bounce Letters', 'news-ticker-for-gutenberg' ), value: 'bounce' },
					] }
					onChange={ ( value ) => onChange( 'animationDirection', value ) }
					help={ __( 'Choose the typography effect for the text.', 'news-ticker-for-gutenberg' ) }
				/>
			) }

			{ animationType === 'fade' && (
				<SelectControl
					label={ __( 'Fade Effect', 'news-ticker-for-gutenberg' ) }
					value={ animationDirection }
					options={ [
						{ label: __( 'Fade In/Out', 'news-ticker-for-gutenberg' ), value: 'fade' },
						{ label: __( 'Fade In Left', 'news-ticker-for-gutenberg' ), value: 'fadeLeft' },
						{ label: __( 'Fade In Right', 'news-ticker-for-gutenberg' ), value: 'fadeRight' },
						{ label: __( 'Fade In Up', 'news-ticker-for-gutenberg' ), value: 'fadeUp' },
						{ label: __( 'Fade In Down', 'news-ticker-for-gutenberg' ), value: 'fadeDown' },
					] }
					onChange={ ( value ) => onChange( 'animationDirection', value ) }
					help={ __( 'Choose the fade effect direction.', 'news-ticker-for-gutenberg' ) }
				/>
			) }
		</PanelBody>
	);
};

export default AnimationSettings; 