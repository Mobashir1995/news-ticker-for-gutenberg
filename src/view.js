import { animateScroll } from './utils/animations/scrollAnimation';
import { setupUpDownAnimation } from './utils/animations/upDownAnimation';
import { setupSlideAnimation } from './utils/animations/slideAnimation';
// import { animateTyping } from './utils/animations/typingAnimation'; // Future

document.addEventListener('DOMContentLoaded', () => {
  const newsTickers = document.querySelectorAll('.wp-block-create-block-news-ticker-block');

  newsTickers.forEach((tickerElement, tickerIndex) => {
    if (!tickerElement.id) tickerElement.id = `news-ticker-${tickerIndex}`;

    const config = {
      animationType: tickerElement.dataset.animationType || 'scroll',
      tickerSpeed: parseInt(tickerElement.dataset.tickerSpeed, 10) || 5,
      tickerDirection: tickerElement.dataset.tickerDirection || 'left',
      showNavigation: tickerElement.dataset.showNavigation === 'true',
      showPlayPause: tickerElement.dataset.showPlayPause === 'true',
      pauseOnHover: tickerElement.dataset.pauseOnHover === 'true',
      showDate: tickerElement.dataset.showDate === 'true',
      queryOptions: JSON.parse(tickerElement.dataset.queryOptions || '{}'),
    };
    const contentElement = tickerElement.querySelector('.news-ticker-content');
    let items = [];
    let currentIndex = 0;
    let animationIntervalId = null;
    let isPaused = false;
    let isHoverPaused = false;

    const getIntervalSpeed = () => (11 - Math.min(10, Math.max(1, config.tickerSpeed))) * 500;
    const getAnimationDurationSpeed = () => (21 - config.tickerSpeed);

    if (config.showDate) {
      const dateElement = tickerElement.querySelector('.news-ticker-date');
      if (dateElement) dateElement.textContent = new Date().toLocaleDateString();
    }

    function prepareItems() {
      items = [];
      if (contentElement) {
        const itemNodes = contentElement.querySelectorAll('.news-item');
        itemNodes.forEach(node => { items.push(node); });
      }
      if (items.length === 0 && contentElement) {
        const noContentMsg = contentElement.querySelector('.news-items-no-content');
        if (!noContentMsg) {
            contentElement.innerHTML = '<p class="news-items-no-content">No news items to display.</p>';
        }
      }
      if (config.animationType === 'upDown' || config.animationType === 'slide' || config.animationType === 'typing'){
          items.forEach((item, idx) => {
              if(item.style) item.style.display = (idx === currentIndex) ? '' : 'none'; // Show first, hide others
          });
      }
    }

    function stopAnimation(resetScrollSpecificStyles = false) {
      clearInterval(animationIntervalId);
      animationIntervalId = null;
      if (contentElement) {
        const scrollWrapper = contentElement.querySelector('.news-ticker-scroll-wrapper');
        if (scrollWrapper && resetScrollSpecificStyles) {
            scrollWrapper.style.animationName = 'none';
            // Optionally, clear the content of scrollWrapper if it's full of clones
            // scrollWrapper.innerHTML = '';
        }
        // For other animations, removing class might be enough or specific style resets
        contentElement.classList.remove('news-ticker-scroll-active', 'news-ticker-updown-active', 'news-ticker-slide-active');
      }
    }

    function renderCurrentItem() {
        if (!items.length || !items[currentIndex]) return; // Added check for items[currentIndex]

        if (config.animationType === 'scroll') {
            if (contentElement) {
                const scrollWrapper = contentElement.querySelector('.news-ticker-scroll-wrapper');
                if (scrollWrapper) {
                    scrollWrapper.style.animationPlayState = (isPaused || isHoverPaused) ? 'paused' : 'running';
                }
            }
            return;
        }

        items.forEach((item, idx) => {
            if (!(item instanceof Node) || !item.style) return;
            item.style.display = 'block'; // Make sure it's block for transforms to work as expected
            item.style.opacity = (idx === currentIndex) ? '1' : '0';

            if (config.animationType === 'upDown') {
                item.style.transform = `translateY(${idx === currentIndex ? '0' : (idx < currentIndex ? '-100%' : '100%')})`;
            } else if (config.animationType === 'slide') {
                const directionMultiplier = (config.tickerDirection === 'left' || config.tickerDirection === 'up') ? 1 : -1;
                let transformValue = '0';
                // Determine if the item is to the "left" or "right" of the current for sliding effect
                if (idx !== currentIndex) {
                    // This logic might need adjustment based on desired visual for items coming from left/right
                    transformValue = (idx < currentIndex ? -directionMultiplier : directionMultiplier) * 100 + '%';
                }
                item.style.transform = `translateX(${transformValue})`;
            } else { // Default or typing (basic version)
                item.style.transform = (idx === currentIndex) ? 'translateY(0)' : 'translateY(100%)';
            }
        });
    }

    function startAnimation() {
        if (isPaused && !isHoverPaused) return;
        if (items.length === 0) {
            if (contentElement && !contentElement.querySelector('.news-items-no-content')) {
                 contentElement.innerHTML = '<p class="news-items-no-content">No news items to display.</p>';
            }
            return;
        }

        stopAnimation(true); // Pass true to reset scroll styles if scroll was active

        // Ensure items are direct children of contentElement for upDown/slide if they manage absolute positioning
        // This might be redundant if prepareItems and PHP rendering already ensure this structure.
        if (config.animationType === 'upDown' || config.animationType === 'slide' || config.animationType === 'typing') {
            // Clear contentElement only if we are about to re-append items for these animation types
            // This prevents clearing items that are already correctly placed by PHP.
            // The setup functions should handle adding items to contentElement if they are not already there.
            // contentElement.innerHTML = ''; // This line might be too aggressive
            // items.forEach(item => contentElement.appendChild(item));
        }

        renderCurrentItem(); // Set initial state for non-scroll animations BEFORE starting them

        switch (config.animationType) {
            case 'scroll':
                animateScroll(contentElement, items, config, getAnimationDurationSpeed, stopAnimation);
                break;
            case 'upDown':
                setupUpDownAnimation(contentElement, items);
                renderCurrentItem();
                animationIntervalId = setInterval(() => {
                    if (isPaused || isHoverPaused) return;
                    currentIndex = (currentIndex + 1) % items.length;
                    renderCurrentItem();
                }, getIntervalSpeed());
                break;
            case 'slide':
                setupSlideAnimation(contentElement, items);
                renderCurrentItem();
                animationIntervalId = setInterval(() => {
                    if (isPaused || isHoverPaused) return;
                    currentIndex = (currentIndex + 1) % items.length;
                    renderCurrentItem();
                }, getIntervalSpeed());
                break;
            case 'typing':
                setupUpDownAnimation(contentElement, items); // Placeholder setup
                renderCurrentItem();
                animationIntervalId = setInterval(() => {
                    if (isPaused || isHoverPaused) return;
                    currentIndex = (currentIndex + 1) % items.length;
                    renderCurrentItem(); // Placeholder action
                }, getIntervalSpeed());
                break;
            default:
                console.warn(`Unknown animation type: ${config.animationType}`);
                if (items.length > 0 && contentElement) {
                    contentElement.innerHTML = '';
                    const firstItemClone = items[0].cloneNode(true);
                    firstItemClone.style.cssText = '';
                    firstItemClone.style.display = 'block';
                    contentElement.appendChild(firstItemClone);
                 }
        }
    }

    const prevButton = tickerElement.querySelector('.news-ticker-prev-button');
    const nextButton = tickerElement.querySelector('.news-ticker-next-button');
    const playPauseButton = tickerElement.querySelector('.news-ticker-play-pause-button');

    if (config.showNavigation) {
        if(prevButton) {
            prevButton.addEventListener('click', () => {
                if (!items.length) return;
                currentIndex = (currentIndex - 1 + items.length) % items.length;
                isPaused = true; isHoverPaused = false;
                if(playPauseButton) playPauseButton.textContent = 'Play';
                stopAnimation(false); // Don't aggressively reset scroll styles on nav click
                renderCurrentItem();
            });
        }
        if(nextButton) {
            nextButton.addEventListener('click', () => {
                if (!items.length) return;
                currentIndex = (currentIndex + 1) % items.length;
                isPaused = true; isHoverPaused = false;
                if(playPauseButton) playPauseButton.textContent = 'Play';
                stopAnimation(false);
                renderCurrentItem();
            });
        }
    } else {
        if(prevButton && prevButton.parentNode) prevButton.parentNode.style.display = 'none';
        else if (prevButton) prevButton.style.display = 'none';
        if(nextButton && nextButton.parentNode !== (prevButton ? prevButton.parentNode : null) && nextButton.parentNode ) nextButton.parentNode.style.display = 'none';
        else if (nextButton) nextButton.style.display = 'none';
    }

    if (config.showPlayPause && playPauseButton) {
        playPauseButton.addEventListener('click', () => {
            isPaused = !isPaused; isHoverPaused = false;
            playPauseButton.textContent = isPaused ? 'Play' : 'Pause';
            if (isPaused) {
                stopAnimation(false); // Don't reset scroll styles, just pause interval/CSS animation
                renderCurrentItem(); // This will set scrollPlayState to paused
            } else {
                renderCurrentItem(); // Ensure current item is correctly displayed before starting
                startAnimation();
            }
        });
    } else if (playPauseButton) {
        if(playPauseButton.parentNode) playPauseButton.parentNode.style.display = 'none';
        else playPauseButton.style.display = 'none';
    }

    if (config.pauseOnHover) {
      tickerElement.addEventListener('mouseenter', () => {
        if (!isPaused) {
          isHoverPaused = true;
          // For interval based, interval checks isHoverPaused.
          // For CSS animation, renderCurrentItem will set play state.
          renderCurrentItem();
        }
      });
      tickerElement.addEventListener('mouseleave', () => {
        if (!isPaused && isHoverPaused) {
          isHoverPaused = false;
          // For interval based, interval will resume.
          // For CSS animation, renderCurrentItem will set play state.
          renderCurrentItem();
          // If animation was interval based and stopped, it might need a nudge if interval already fired
          // but for simplicity, we assume the interval continues to check or CSS animation state handles it.
          // If not actively in an interval (e.g. upDown was paused by hover), startAnimation might be needed
          // if the animation is not just a CSS play-state change.
          // Let's ensure startAnimation is called if it's not a continuous CSS scroll
          if (config.animationType !== 'scroll') {
            startAnimation(); // Re-check conditions and resume interval if needed
          }
        }
      });
    }

    prepareItems();
    if (items.length > 0) {
        renderCurrentItem();
        if (!isPaused) startAnimation();
    }
  });
});
