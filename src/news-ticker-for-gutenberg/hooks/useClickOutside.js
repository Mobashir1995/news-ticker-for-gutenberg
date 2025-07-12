import { useEffect, useRef } from '@wordpress/element';

/**
 * Custom hook for detecting clicks outside of a specified element
 * @param {Function} callback - Function to call when click outside is detected
 * @param {boolean} isActive - Whether the hook should be active
 * @returns {React.RefObject} Ref to attach to the element to monitor
 */
export function useClickOutside(callback, isActive = true) {
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };

        if (isActive) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [callback, isActive]);

    return ref;
} 