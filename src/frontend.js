/**
 * Frontend JavaScript for News Ticker Block
 */
import './frontend.scss';

class NewsTicker {
	constructor( element ) {
		this.element = element;
		this.tickerItems = element.querySelector( '.ntfg-ticker-items' );
		this.items = Array.from( this.tickerItems.children );
		this.currentIndex = 0;
		this.isPlaying = true;
		this.animationType = element.dataset.animationType || 'scrolling';
		this.animationSpeed = parseInt( element.dataset.animationSpeed ) || 50;
		this.animationDirection = element.dataset.animationDirection || 'left';
		this.pauseOnHover = element.dataset.pauseOnHover === 'true';
		
		this.init();
	}

	init() {
		if ( this.items.length === 0 ) return;

		this.setupAnimation();
		this.setupControls();
		this.setupHoverPause();
	}

	setupAnimation() {
		switch ( this.animationType ) {
			case 'scrolling':
				this.setupScrollingAnimation();
				break;
			case 'updown':
				this.setupUpDownAnimation();
				break;
			case 'sliding':
				this.setupSlidingAnimation();
				break;
			case 'typography':
				this.setupTypographyAnimation();
				break;
			case 'fade':
				this.setupFadeAnimation();
				break;
			case 'typing':
				this.setupTypingAnimation();
				break;
			case 'bounce':
				this.setupBounceAnimation();
				break;
			case 'slideup':
				this.setupSlideUpAnimation();
				break;
			case 'zoom':
				this.setupZoomAnimation();
				break;
			case 'flip':
				this.setupFlipAnimation();
				break;
			default:
				this.setupScrollingAnimation();
		}
	}

	setupScrollingAnimation() {
		const duration = ( 100 - this.animationSpeed ) * 2 + 10; // Convert speed to duration
		const direction = this.animationDirection === 'right' ? 'reverse' : 'normal';
		
		this.tickerItems.style.animation = `scroll-${ this.animationDirection } ${ duration }s linear infinite ${ direction }`;
	}

	setupUpDownAnimation() {
		this.tickerItems.style.display = 'block';
		this.tickerItems.style.animation = 'none';
		
		this.showCurrentItem();
		this.startUpDownTimer();
	}

	setupSlidingAnimation() {
		this.tickerItems.style.display = 'flex';
		this.tickerItems.style.animation = 'none';
		
		this.showCurrentItem();
		this.startSlidingTimer();
	}

	setupTypographyAnimation() {
		this.tickerItems.style.display = 'block';
		this.tickerItems.style.animation = 'none';
		
		this.showCurrentItem();
		this.startTypographyTimer();
	}

	setupFadeAnimation() {
		this.tickerItems.style.display = 'block';
		this.tickerItems.style.animation = 'none';
		
		this.showCurrentItem();
		this.startFadeTimer();
	}

	setupTypingAnimation() {
		this.tickerItems.style.display = 'block';
		this.tickerItems.style.animation = 'none';
		
		this.showCurrentItem();
		this.startTypingTimer();
	}

	setupBounceAnimation() {
		this.tickerItems.style.display = 'block';
		this.tickerItems.style.animation = 'none';
		
		this.showCurrentItem();
		this.startBounceTimer();
	}

	setupSlideUpAnimation() {
		this.tickerItems.style.display = 'block';
		this.tickerItems.style.animation = 'none';
		
		this.showCurrentItem();
		this.startSlideUpTimer();
	}

	setupZoomAnimation() {
		this.tickerItems.style.display = 'block';
		this.tickerItems.style.animation = 'none';
		
		this.showCurrentItem();
		this.startZoomTimer();
	}

	setupFlipAnimation() {
		this.tickerItems.style.display = 'block';
		this.tickerItems.style.animation = 'none';
		
		this.showCurrentItem();
		this.startFlipTimer();
	}

	showCurrentItem() {
		this.items.forEach( ( item, index ) => {
			if ( index === this.currentIndex ) {
				item.style.display = 'block';
			} else {
				item.style.display = 'none';
			}
		} );
	}

	nextItem() {
		this.currentIndex = ( this.currentIndex + 1 ) % this.items.length;
		this.showCurrentItem();
	}

	prevItem() {
		this.currentIndex = this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1;
		this.showCurrentItem();
	}

	startUpDownTimer() {
		const duration = ( 100 - this.animationSpeed ) * 50 + 1000;
		
		this.upDownTimer = setInterval( () => {
			if ( this.isPlaying ) {
				this.nextItem();
			}
		}, duration );
	}

	startSlidingTimer() {
		const duration = ( 100 - this.animationSpeed ) * 50 + 1000;
		
		this.slidingTimer = setInterval( () => {
			if ( this.isPlaying ) {
				this.nextItem();
			}
		}, duration );
	}

	startTypographyTimer() {
		const duration = ( 100 - this.animationSpeed ) * 50 + 1000;
		
		this.typographyTimer = setInterval( () => {
			if ( this.isPlaying ) {
				this.nextItem();
			}
		}, duration );
	}

	startFadeTimer() {
		const duration = ( 100 - this.animationSpeed ) * 50 + 1000;
		
		this.fadeTimer = setInterval( () => {
			if ( this.isPlaying ) {
				this.nextItem();
			}
		}, duration );
	}

	startTypingTimer() {
		const duration = ( 100 - this.animationSpeed ) * 50 + 1000;
		
		this.typingTimer = setInterval( () => {
			if ( this.isPlaying ) {
				this.nextItem();
			}
		}, duration );
	}

	startBounceTimer() {
		const duration = ( 100 - this.animationSpeed ) * 50 + 1000;
		
		this.bounceTimer = setInterval( () => {
			if ( this.isPlaying ) {
				this.nextItem();
			}
		}, duration );
	}

	startSlideUpTimer() {
		const duration = ( 100 - this.animationSpeed ) * 50 + 1000;
		
		this.slideUpTimer = setInterval( () => {
			if ( this.isPlaying ) {
				this.nextItem();
			}
		}, duration );
	}

	startZoomTimer() {
		const duration = ( 100 - this.animationSpeed ) * 50 + 1000;
		
		this.zoomTimer = setInterval( () => {
			if ( this.isPlaying ) {
				this.nextItem();
			}
		}, duration );
	}

	startFlipTimer() {
		const duration = ( 100 - this.animationSpeed ) * 50 + 1000;
		
		this.flipTimer = setInterval( () => {
			if ( this.isPlaying ) {
				this.nextItem();
			}
		}, duration );
	}

	setupControls() {
		const prevBtn = this.element.querySelector( '.ntfg-nav-prev' );
		const nextBtn = this.element.querySelector( '.ntfg-nav-next' );
		const playPauseBtn = this.element.querySelector( '.ntfg-play-pause' );

		if ( prevBtn ) {
			prevBtn.addEventListener( 'click', () => this.prevItem() );
		}

		if ( nextBtn ) {
			nextBtn.addEventListener( 'click', () => this.nextItem() );
		}

		if ( playPauseBtn ) {
			playPauseBtn.addEventListener( 'click', () => this.togglePlayPause() );
		}
	}

	setupHoverPause() {
		if ( ! this.pauseOnHover ) return;

		this.element.addEventListener( 'mouseenter', () => {
			if ( this.animationType === 'scrolling' ) {
				this.tickerItems.style.animationPlayState = 'paused';
			} else {
				this.isPlaying = false;
			}
		} );

		this.element.addEventListener( 'mouseleave', () => {
			if ( this.animationType === 'scrolling' ) {
				this.tickerItems.style.animationPlayState = 'running';
			} else {
				this.isPlaying = true;
			}
		} );
	}

	togglePlayPause() {
		const playPauseBtn = this.element.querySelector( '.ntfg-play-pause' );
		
		if ( this.animationType === 'scrolling' ) {
			if ( this.tickerItems.style.animationPlayState === 'paused' ) {
				this.tickerItems.style.animationPlayState = 'running';
				playPauseBtn.textContent = '⏸';
			} else {
				this.tickerItems.style.animationPlayState = 'paused';
				playPauseBtn.textContent = '▶';
			}
		} else {
			this.isPlaying = ! this.isPlaying;
			playPauseBtn.textContent = this.isPlaying ? '⏸' : '▶';
		}
	}

	destroy() {
		// Clear all timers
		[ 'upDownTimer', 'slidingTimer', 'typographyTimer', 'fadeTimer', 'typingTimer', 'bounceTimer', 'slideUpTimer', 'zoomTimer', 'flipTimer' ].forEach( timer => {
			if ( this[ timer ] ) {
				clearInterval( this[ timer ] );
			}
		} );
	}
}

// Initialize tickers when DOM is ready
document.addEventListener( 'DOMContentLoaded', () => {
	const tickers = document.querySelectorAll( '.ntfg-news-ticker' );
	tickers.forEach( ticker => new NewsTicker( ticker ) );
} );

// Handle dynamic content loading (for AJAX loaded content)
if ( typeof jQuery !== 'undefined' ) {
	jQuery( document ).on( 'ntfg-ticker-loaded', function( event, element ) {
		new NewsTicker( element );
	} );
} 