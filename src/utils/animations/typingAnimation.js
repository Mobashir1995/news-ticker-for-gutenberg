/**
 * Typing Animation Logic for News Ticker
 */

// Helper to get text content, preserving simple line breaks if any
function getItemText(itemElement) {
    let text = '';
    if (itemElement.childNodes.length > 0) {
        itemElement.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                text += node.textContent + ( (node.tagName === 'P' || node.tagName === 'BR') && node.nextSibling ? '\n' : '');
            }
        });
    } else {
        text = itemElement.textContent;
    }
    return text.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
}


export function setupTypingAnimation(contentElement, items) {
    if (!items.length || !contentElement) return;
    contentElement.classList.remove('news-ticker-scroll-active', 'news-ticker-updown-active', 'news-ticker-slide-active');
    contentElement.classList.add('news-ticker-typing-active');

    items.forEach(item => {
        // Store original HTML only if not already stored, or if it's different
        // This check might be complex if content can change dynamically elsewhere
        if (!item.dataset.originalHtml) {
            item.dataset.originalHtml = item.innerHTML;
        }
        item.innerHTML = ''; // Clear content for typing
        item.style.display = 'none'; // Hide all items initially
    });
}

export function typeCharacter(itemElement, lines, currentLineIndex, charIndex, charSpeed, onLineComplete, onAllLinesComplete) {
    if (currentLineIndex >= lines.length) {
        if (onAllLinesComplete) onAllLinesComplete();
        return null;
    }

    const currentLine = lines[currentLineIndex];
    if (!currentLine && currentLineIndex < lines.length -1) { // Empty line, skip to next
        return typeCharacter(itemElement, lines, currentLineIndex + 1, 0, charSpeed, onLineComplete, onAllLinesComplete);
    }
    if (!currentLine && currentLineIndex >= lines.length -1) { // Last line is empty
        if (onAllLinesComplete) onAllLinesComplete();
        return null;
    }


    let lineDiv = itemElement.querySelector(`.typing-line-${currentLineIndex}`);
    if (!lineDiv) {
        lineDiv = document.createElement('div');
        lineDiv.className = `typing-line typing-line-${currentLineIndex}`;
        itemElement.appendChild(lineDiv);
    }

    // Remove existing cursor before adding next char
    const existingCursor = lineDiv.querySelector('.typing-cursor');
    if (existingCursor) existingCursor.remove();

    if (charIndex < currentLine.length) {
        lineDiv.textContent = currentLine.substring(0, charIndex + 1); // Build up text

        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '_';
        lineDiv.appendChild(cursor);

        return setTimeout(() => {
            typeCharacter(itemElement, lines, currentLineIndex, charIndex + 1, charSpeed, onLineComplete, onAllLinesComplete);
        }, charSpeed);
    } else {
        // Line finished
        if (onLineComplete) onLineComplete();
        return setTimeout(() => {
            typeCharacter(itemElement, lines, currentLineIndex + 1, 0, charSpeed, onLineComplete, onAllLinesComplete);
        }, charSpeed * 5); // Pause slightly longer after a line (was *3)
    }
}

export function startItemTyping(itemElement, charSpeed, onItemComplete) {
    if (!itemElement) {
        if (onItemComplete) onItemComplete();
        return null;
    }

    itemElement.innerHTML = '';
    itemElement.style.display = 'block';

    const originalContentSource = itemElement.dataset.originalHtml || '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalContentSource;
    const lines = getItemText(tempDiv);


    if (!lines.join("").trim()) {
        itemElement.innerHTML = itemElement.dataset.originalHtml || ''; // Restore if empty
        if (onItemComplete) onItemComplete();
        return null;
    }

    let currentTimeoutId = null;
    const allLinesDone = () => {
        const lastLineIndex = lines.length - 1;
        const lastLineDiv = itemElement.querySelector(`.typing-line-${lastLineIndex}`);

        if (lastLineDiv) {
            const finalCursor = document.createElement('span');
            finalCursor.className = 'typing-cursor blinking-cursor';
            finalCursor.textContent = '_';
            lastLineDiv.appendChild(finalCursor);
        } else if (itemElement && lines.length === 0) { // Case where lines might be empty after trim but originalHtml was not
            itemElement.innerHTML = itemElement.dataset.originalHtml || '';
        }


        if (onItemComplete) onItemComplete();
    };

    currentTimeoutId = typeCharacter(itemElement, lines, 0, 0, charSpeed, null, allLinesDone);
    return () => { // Cancel function
        if (currentTimeoutId) clearTimeout(currentTimeoutId);
        // Restore full original content when typing is cancelled prematurely
        if (itemElement && itemElement.dataset.originalHtml) {
            itemElement.innerHTML = itemElement.dataset.originalHtml;
        }
    };
}
