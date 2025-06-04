/**
 * Up/Down Animation Logic for News Ticker
 */

// This function sets up the necessary styles and classes for the UpDown animation.
// The actual interval and currentIndex management will still reside in view.js.
export function setupUpDownAnimation(contentElement, items) {
    if (!items.length || !contentElement) return;

    contentElement.classList.remove('news-ticker-scroll-active', 'news-ticker-slide-active'); // Remove other animation classes
    contentElement.classList.add('news-ticker-updown-active');

    // Ensure items are direct children of contentElement for absolute positioning to work correctly relative to it.
    // This might involve re-appending if items were previously in a different structure (e.g. scrollWrapper).
    items.forEach(item => {
        if (item.parentNode !== contentElement) {
             // If item was, for example, in a scrollWrapper that's a child of contentElement,
             // we need to move it to be a direct child of contentElement.
             // However, if items are already direct children of some other wrappers (e.g. queried-wrapper, custom-wrapper)
             // that are themselves children of contentElement, this logic might be too simple.
             // The assumption from prepareItems is that `items` are the DOM nodes to be animated.
             // `view.js` `startAnimation` should ensure items are ready or appended to contentElement.
            contentElement.appendChild(item);
        }
        item.style.position = 'absolute';
        item.style.width = '100%';
        item.style.transition = `transform ${0.5}s ease-in-out, opacity ${0.5}s ease-in-out`;
    });
}
