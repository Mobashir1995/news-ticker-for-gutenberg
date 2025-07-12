# News Ticker for Gutenberg - Component Architecture

This document describes the refactored component architecture for the News Ticker Gutenberg block.

## Overview

The code has been refactored following React best practices with:
- **Custom Hooks** for reusable logic
- **Modular Components** for better separation of concerns
- **Clean imports** with index files
- **Proper TypeScript-style documentation**

## File Structure

```
src/news-ticker-for-gutenberg/
├── components/
│   ├── index.js                 # Component exports
│   ├── QueryControls.js         # Main query settings
│   ├── TaxonomyFilters.js       # Taxonomy and term selection
│   ├── PostSearch.js           # Post search functionality
│   ├── SelectedPosts.js        # Selected posts management
│   ├── IncludePostsSection.js  # Wrapper for include posts
│   └── NewsTickerPreview.js    # Preview in editor
├── hooks/
│   ├── index.js                # Hook exports
│   ├── useDebounce.js          # Debounce utility
│   ├── useClickOutside.js      # Click outside detection
│   ├── usePostSearch.js        # Post search logic
│   └── useWordPressData.js     # WordPress data fetching
├── edit.js                     # Main editor component
└── editor.css                  # Editor styles
```

## Custom Hooks

### `useDebounce(value, delay)`
Debounces a value with a specified delay.

```javascript
const debouncedValue = useDebounce(searchQuery, 1000);
```

### `useClickOutside(callback, isActive)`
Detects clicks outside a specified element.

```javascript
const ref = useClickOutside(() => setShowDropdown(false), showDropdown);
```

### `usePostSearch(postType, selectedTerms)`
Handles post search functionality with pagination and filtering.

```javascript
const {
    searchQuery,
    searchResults,
    isSearchLoading,
    hasMoreResults,
    showSearchDropdown,
    setShowSearchDropdown,
    handleSearchQueryChange,
    handleLoadMore
} = usePostSearch(postType, selectedTerms);
```

### WordPress Data Hooks

#### `usePostTypes()`
Fetches available post types.

#### `useTaxonomies(postType)`
Fetches taxonomies for a specific post type.

#### `useTaxonomyTerms(taxonomies)`
Fetches terms for given taxonomies.

#### `usePosts(params)`
Fetches posts with various filters.

#### `useSelectedPosts(includePosts, postType)`
Fetches details for selected posts.

## Components

### `QueryControls`
Handles main query settings (post type, posts to show, order, etc.).

### `TaxonomyFilters`
Manages taxonomy and term selection with expandable sections.

### `PostSearch`
Provides post search functionality with dropdown results.

### `SelectedPosts`
Displays and manages the list of selected posts.

### `IncludePostsSection`
Wrapper component that combines search and selected posts.

### `NewsTickerPreview`
Displays the news ticker preview in the editor.

## Benefits of This Architecture

1. **Reusability**: Hooks and components can be easily reused
2. **Maintainability**: Each component has a single responsibility
3. **Testability**: Individual components and hooks can be tested in isolation
4. **Readability**: Code is more organized and easier to understand
5. **Performance**: Better separation allows for optimized re-renders
6. **Scalability**: Easy to add new features or modify existing ones

## Usage Example

```javascript
import { QueryControls, TaxonomyFilters } from './components';
import { usePostTypes } from './hooks';

function MyComponent({ attributes, setAttributes }) {
    const postTypes = usePostTypes();
    
    return (
        <div>
            <QueryControls 
                attributes={attributes} 
                setAttributes={setAttributes} 
            />
            <TaxonomyFilters 
                attributes={attributes} 
                setAttributes={setAttributes} 
            />
        </div>
    );
}
```

## Best Practices Followed

- **Single Responsibility Principle**: Each component/hook has one clear purpose
- **Composition over Inheritance**: Components are composed together
- **Custom Hooks**: Logic is extracted into reusable hooks
- **Proper Documentation**: JSDoc comments for all functions
- **Clean Imports**: Index files for better import organization
- **Consistent Naming**: Clear, descriptive names for all functions and components 