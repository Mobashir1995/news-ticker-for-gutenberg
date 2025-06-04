import { animateScroll } from './utils/animations/scrollAnimation.js';
import { setupUpDownAnimation } from './utils/animations/upDownAnimation.js';
import { setupSlideAnimation } from './utils/animations/slideAnimation.js';
import { setupTypingAnimation, startItemTyping } from './utils/animations/typingAnimation.js';

document.addEventListener('DOMContentLoaded', () => {
  const newsTickers = document.querySelectorAll('.wp-block-create-block-news-ticker-block');

  newsTickers.forEach((tickerElement, tickerIndex) => {
    if (!tickerElement.id) {
        tickerElement.id = `news-ticker-${tickerIndex}`;
    }

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
    let currentItemTypingCancel = null;
    let isPaused = false;
    let isHoverPaused = false;

    const getIntervalSpeed = () => (11 - Math.min(10, Math.max(1, config.tickerSpeed))) * 1000;
    const getAnimationDurationSpeed = () => (21 - config.tickerSpeed);
    const getCharSpeed = () => Math.max(30, 230 - (config.tickerSpeed * 10));
    const getTypingPauseDuration = () => getIntervalSpeed();

    if (config.showDate) {
      const dateElement = tickerElement.querySelector('.news-ticker-date');
      if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString();
      }
    }

    function prepareItems() {
      items = [];
      if (contentElement) {
        const itemNodes = contentElement.querySelectorAll('.news-item');
        itemNodes.forEach(node => {
            if (!node.dataset.originalHtml) { // Store original HTML if not already stored
                node.dataset.originalHtml = node.innerHTML;
            }
            items.push(node);
        });
      }
      if (items.length === 0 && contentElement) {
        const noContentMsg = contentElement.querySelector('.news-items-no-content');
        // Also check if the ticker element itself contains the message (if contentElement is empty)
        const tickerNoContentMsg = tickerElement.querySelector('.news-items-no-content');
        if (!noContentMsg && !tickerNoContentMsg) {
            const p = document.createElement('p');
            p.className = 'news-items-no-content';
            p.textContent = 'No news items to display.'; // User-facing, consider i18n if possible via wp.i18n
            contentElement.appendChild(p);
        }
      }
      items.forEach(item => item.style.display = 'none'); // Initially hide all items
    }

    function stopAnimation(fullReset = false) {
      clearInterval(animationIntervalId);
      animationIntervalId = null;
      if (currentItemTypingCancel) {
        currentItemTypingCancel(); // This should restore original HTML for the item being typed
        currentItemTypingCancel = null;
      }
      if (fullReset && contentElement) {
        const scrollWrapper = contentElement.querySelector('.news-ticker-scroll-wrapper');
        if (scrollWrapper) { // If scrollWrapper exists
            scrollWrapper.style.animationName = 'none'; // Stop animation
            if (scrollWrapper.parentNode === contentElement) { // Check if it's a direct child
                contentElement.removeChild(scrollWrapper); // Then remove
            } else {
                scrollWrapper.innerHTML = ''; // Fallback: just clear its content
            }
        }
        items.forEach(item => { // Restore all items to original state
            if (item.dataset.originalHtml) {
                item.innerHTML = item.dataset.originalHtml;
            }
            item.style.display = 'none';
            item.style.opacity = '';
            item.style.transform = '';
        });
        contentElement.classList.remove('news-ticker-scroll-active', 'news-ticker-updown-active', 'news-ticker-slide-active', 'news-ticker-typing-active');
      } else if (config.animationType === 'scroll' && contentElement) { // Non-fullReset, specifically for scroll pause
          const scrollWrapper = contentElement.querySelector('.news-ticker-scroll-wrapper');
          if (scrollWrapper) scrollWrapper.style.animationPlayState = 'paused';
      }
    }

    function renderCurrentItem() {
        if (!items.length || !items[currentIndex]) return;

        if (config.animationType === 'scroll') {
            if (contentElement) {
                 const scrollWrapper = contentElement.querySelector('.news-ticker-scroll-wrapper');
                 if(scrollWrapper) scrollWrapper.style.animationPlayState = (isPaused || isHoverPaused) ? 'paused' : 'running';
            }
            return;
        }

        if (config.animationType !== 'typing') {
            items.forEach((item, idx) => {
                if (!(item instanceof Node) || !item.style) return;
                item.style.display = 'block';
                item.style.opacity = (idx === currentIndex) ? '1' : '0';
                if (config.animationType === 'upDown') {
                    item.style.transform = `translateY(${idx === currentIndex ? '0' : (idx < currentIndex ? '-100%' : '100%')})`;
                } else if (config.animationType === 'slide') {
                    const dM = (config.tickerDirection === 'left' || config.tickerDirection === 'up') ? 1 : -1; // up for vertical slide
                    let tV = '0';
                    if (idx !== currentIndex) tV = (idx < currentIndex ? -dM : dM) * 100 + '%';
                    item.style.transform = `translateX(${tV})`;
                } else { // Fallback for any other non-scroll, non-typing animation
                    item.style.transform = (idx === currentIndex) ? 'translateY(0)' : 'translateY(100%)'; // Default to hide
                }
            });
        }
    }

    function processNextItem() { // Renamed from advanceToNextItemAndAnimate
        if (!items.length) return;
        // This function is responsible for setting up the *current* item based on currentIndex
        // It's called initially and after each advancement (manual or interval)

        // Restore previous item if it was typed and is not the current one
        // This is tricky because currentIndex has already advanced for interval calls.
        // Let's ensure any active typing is cancelled and restored before setting up the new current item.
        if (currentItemTypingCancel) {
            currentItemTypingCancel(); // This should restore HTML of the item it was typing
            currentItemTypingCancel = null;
        }

        items.forEach(item => item.style.display = 'none'); // Hide all items

        if (!items[currentIndex]) currentIndex = 0; // Safety for bad index

        if (config.animationType === 'typing') {
            if (items[currentIndex]) { // Check if item exists
                currentItemTypingCancel = startItemTyping(items[currentIndex], getCharSpeed(), () => {
                    // This callback is when ONE item is fully typed.
                    // If we want a pause *after* typing an item, before the main interval for next item kicks in,
                    // that would be handled by the interval duration in startAnimation.
                });
            }
        } else {
            renderCurrentItem(); // For slide/upDown, render the current item
        }
    }

    function advanceAndProcess() { // Called by interval
        if (isPaused || isHoverPaused || !items.length) return;
        currentIndex = (currentIndex + 1) % items.length;
        processNextItem();
    }

    function startAnimation() {
        if (isPaused && !isHoverPaused) return;
        if (items.length === 0) {
            if (contentElement && !contentElement.querySelector('.news-items-no-content')) {
                 contentElement.innerHTML = '<p class="news-items-no-content">No news items to display.</p>';
            }
            return;
        }

        stopAnimation(true); // Full reset of DOM and classes
        contentElement.classList.remove('news-ticker-scroll-active', 'news-ticker-updown-active', 'news-ticker-slide-active', 'news-ticker-typing-active');

        if (items.length > 0 && !items[currentIndex]) currentIndex = 0; // Reset index if out of bounds

        // Setup items for the new animation type
        items.forEach(item => {
            if(item.dataset.originalHtml) item.innerHTML = item.dataset.originalHtml; // Restore all to original
            item.style.display = 'none'; // Hide all initially
        });

        switch (config.animationType) {
            case 'scroll':
                animateScroll(contentElement, items, config, getAnimationDurationSpeed, stopAnimation);
                break;
            case 'upDown':
                setupUpDownAnimation(contentElement, items); // Sets up item styles (absolute, transition)
                processNextItem(); // Display initial item
                animationIntervalId = setInterval(advanceAndProcess, getIntervalSpeed());
                break;
            case 'slide':
                setupSlideAnimation(contentElement, items); // Sets up item styles
                processNextItem(); // Display initial item
                animationIntervalId = setInterval(advanceAndProcess, getIntervalSpeed());
                break;
            case 'typing':
                setupTypingAnimation(contentElement, items); // Hides items, stores originalHTML, clears for typing
                processNextItem(); // Type out current (first) item
                animationIntervalId = setInterval(advanceAndProcess, getTypingPauseDuration()); // Interval is for pause BETWEEN items
                break;
            default:
                if (items.length > 0 && contentElement && items[currentIndex]) {
                    contentElement.innerHTML = '';
                    const firstItemClone = items[currentIndex].cloneNode(true);
                    if(firstItemClone.dataset.originalHtml) firstItemClone.innerHTML = firstItemClone.dataset.originalHtml;
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
        if(prevButton) prevButton.addEventListener('click', () => {
            if(!items.length) return;
            stopAnimation(config.animationType === 'scroll');
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            isPaused = true; if(playPauseButton) playPauseButton.textContent = 'Play';
            processNextItem();
        });
        if(nextButton) nextButton.addEventListener('click', () => {
            if(!items.length) return;
            stopAnimation(config.animationType === 'scroll');
            currentIndex = (currentIndex + 1) % items.length;
            isPaused = true; if(playPauseButton) playPauseButton.textContent = 'Play';
            processNextItem();
        });
    } else { if(prevButton && prevButton.parentNode) prevButton.parentNode.style.display = 'none';}


    if (config.showPlayPause && playPauseButton) {
        playPauseButton.textContent = isPaused ? 'Play' : 'Pause';
        playPauseButton.addEventListener('click', () => {
            isPaused = !isPaused;
            playPauseButton.textContent = isPaused ? 'Play' : 'Pause';
            if (isPaused) {
                stopAnimation(false);
                if(config.animationType === 'scroll') renderCurrentItem(); // This sets scroll animation to 'paused' state
            } else {
                isHoverPaused = false;
                // For typing, processNextItem will restart typing on current if it was paused.
                // For others, it just ensures correct display before interval starts.
                if (config.animationType !== 'scroll') processNextItem();
                startAnimation(); // Re-initializes intervals and CSS scroll animation
            }
        });
    } else if (playPauseButton && playPauseButton.parentNode) { playPauseButton.parentNode.style.display = 'none'; }

    if (config.pauseOnHover) {
        tickerElement.addEventListener('mouseenter', () => {
            if (!isPaused) {
                isHoverPaused = true;
                stopAnimation(false); // Clears interval, pauses scroll via renderCurrentItem
                if(config.animationType === 'scroll' || config.animationType === 'typing') {
                     renderCurrentItem(); // For scroll, sets playstate. For typing, no-op but harmless.
                }
            }
        });
        tickerElement.addEventListener('mouseleave', () => {
            if (!isPaused && isHoverPaused) {
                isHoverPaused = false;
                // For typing, processNextItem will restart typing on current if it was paused.
                if (config.animationType !== 'scroll') processNextItem();
                startAnimation(); // Re-initializes interval and scroll animation state
            }
        });
    }

    prepareItems();
    if (items.length > 0) {
        // Initial display of the first item correctly based on animation type
        processNextItem();
        if (!isPaused) {
            startAnimation();
        }
    }
  });
});
