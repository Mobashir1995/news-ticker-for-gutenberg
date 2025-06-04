/**
 * Slide Animation Logic for News Ticker
 */

// This function sets up the necessary styles and classes for the Slide animation.
// Similar to UpDown, interval and currentIndex are managed in view.js.
export function setupSlideAnimation(contentElement, items) {
    if (!items.length || !contentElement) return;

    contentElement.classList.remove('news-ticker-scroll-active', 'news-ticker-updown-active'); // Remove other animation classes
    contentElement.classList.add('news-ticker-slide-active');

    items.forEach(item => {
        if (item.parentNode !== contentElement) {
            contentElement.appendChild(item);
        }
        item.style.position = 'absolute';
        item.style.width = '100%';
        item.style.transition = `transform ${0.5}s ease-in-out, opacity ${0.5}s ease-in-out`;
    });
}
