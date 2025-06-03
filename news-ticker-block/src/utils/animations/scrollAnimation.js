/**
 * Scroll Animation Logic for News Ticker
 */
export function animateScroll(contentElement, items, config, getAnimationDurationSpeed, stopAnimation) {
    if (!items.length || !contentElement) return;
    stopAnimation(true); // Clear previous interval and potentially reset scroll wrapper styles

    contentElement.classList.add('news-ticker-scroll-active');

    let scrollWrapper = contentElement.querySelector('.news-ticker-scroll-wrapper');
    if (!scrollWrapper) {
        scrollWrapper = document.createElement('div');
        scrollWrapper.classList.add('news-ticker-scroll-wrapper');
        contentElement.appendChild(scrollWrapper);
    }
    scrollWrapper.innerHTML = '';
    scrollWrapper.className = 'news-ticker-scroll-wrapper'; // Reset classes then add specific
    scrollWrapper.classList.add('horizontal-scroll'); // Assuming horizontal for now

    items.forEach(item => {
        const clone = item.cloneNode(true);
        // Ensure items are styled for scrolling by CSS or inline here if necessary
        // CSS classes .news-ticker-scroll-wrapper.horizontal-scroll .news-item should handle it
        scrollWrapper.appendChild(clone);
    });

    const containerWidth = contentElement.offsetWidth;
    let contentWidth = scrollWrapper.scrollWidth;

    if (contentWidth <= containerWidth && items.length === 1) {
         scrollWrapper.style.animationName = 'none';
         if(items.length === 1) { // Make sure the single item is visible
            scrollWrapper.innerHTML = ''; // Clear clones
            const singleItemClone = items[0].cloneNode(true);
            singleItemClone.style.display = 'inline-block'; // Ensure visibility
            scrollWrapper.appendChild(singleItemClone);
         }
         return;
    }

    if (contentWidth > 0 && contentWidth < containerWidth * 1.5 && items.length > 0) { // Added items.length > 0 check
        let currentTotalWidth = contentWidth;
        const maxClones = items.length * 3;
        let clonesAdded = 0;
        while (currentTotalWidth < (containerWidth * 2) && clonesAdded < maxClones) {
            items.forEach(item => {
                const clone = item.cloneNode(true);
                scrollWrapper.appendChild(clone);
                clonesAdded++;
            });
            currentTotalWidth = scrollWrapper.scrollWidth;
            if (currentTotalWidth === 0 || clonesAdded >= maxClones) break;
        }
    }

    // Ensure items.length is not zero to prevent division by zero or negative duration
    const animationSpeedFactor = items.length > 0 ? items.length * (getAnimationDurationSpeed() / 2) : getAnimationDurationSpeed();
    scrollWrapper.style.animationDuration = `${Math.max(1, animationSpeedFactor)}s`;
    scrollWrapper.style.animationName = `newsTickerScroll${config.tickerDirection === 'left' ? 'Left' : 'Right'}`;
    scrollWrapper.style.animationPlayState = 'running'; // Ensure it starts
}
