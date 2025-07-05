# News Ticker for Gutenberg

A comprehensive Gutenberg block for creating animated news tickers with multiple animation types, query controls, and extensive customization options.

## Features

### 🎬 Animation Types
- **Scrolling Ticker** - Horizontal scrolling animation
- **Up Down Ticker** - Vertical scrolling animation
- **Left-Right Sliding** - Smooth sliding transitions
- **Typography Effects** - Typewriter, glitch, wave, rainbow, bounce effects
- **Fade Effects** - Fade in/out with various directions
- **Typing Effect** - Typewriter-style text animation
- **Bounce Effect** - Bouncy animation transitions
- **Slide Up Effect** - Slide up from bottom
- **Zoom Effect** - Zoom in/out animations
- **Flip Effect** - 3D flip animations

### ⚙️ Control Options
- **Play/Pause Button** - Control ticker playback
- **Navigation Arrows** - Previous/Next item navigation
- **Pause on Hover** - Automatically pause when hovering
- **Adjustable Speed** - Fine-tune animation speed (10-200)

### 📊 Query Controls
- **Post Type Selection** - Choose from any registered post type
- **Taxonomy Filtering** - Filter by categories, tags, or custom taxonomies
- **Specific Post Selection** - Search and select individual posts
- **Ordering Options** - Sort by date, title, modified date, random, etc.
- **Posts Per Page** - Control how many posts to display (1-50)

### 🎨 Custom Content
- **Repeater Fields** - Add multiple custom content items
- **Title & Content** - Separate title and content fields
- **URL Links** - Add clickable links to content
- **Open in New Tab** - Control link behavior
- **Enable/Disable** - Toggle individual items on/off
- **Drag & Drop Reordering** - Reorder custom content items

### 🎨 Styling Options
- **Color Controls** - Background, text, and accent colors
- **Typography** - Font family, size, weight, line height
- **Spacing** - Padding and margin controls
- **Border Radius** - Rounded corner options
- **Responsive Design** - Mobile-friendly layouts

### 📱 Content Elements
- **Logo Display** - Upload and display channel logo
- **Breaking News Text** - Customizable breaking news label
- **Live Indicator** - Animated "LIVE" text
- **Date Display** - Multiple date format options
- **Navigation Controls** - Previous/Next buttons

## Installation

### Prerequisites
- WordPress 6.0 or higher
- PHP 8.0 or higher
- Node.js 18 or higher (for development)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/news-ticker-for-gutenberg.git
   cd news-ticker-for-gutenberg
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the plugin**
   ```bash
   npm run build
   ```

4. **Activate the plugin**
   - Copy the plugin folder to your WordPress `wp-content/plugins/` directory
   - Activate the plugin from WordPress admin

### Development

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Lint and format code**
   ```bash
   npm run lint:js
   npm run lint:css
   npm run format
   ```

## Usage

### Adding the Block

1. In the Gutenberg editor, click the "+" button to add a new block
2. Search for "News Ticker" or find it in the "Widgets" category
3. Click to add the block to your page/post

### Configuration

#### Animation Settings
- **Animation Type**: Choose from 10 different animation types
- **Animation Speed**: Adjust from 10 (slow) to 200 (fast)
- **Animation Direction**: Left, right, up, down, or specific effects

#### Content Settings
- **Logo**: Upload and configure channel logo
- **Breaking News**: Customize breaking news text
- **Live Text**: Set live indicator text
- **Date Format**: Choose from multiple date formats

#### Query Settings
- **Post Type**: Select posts, pages, or custom post types
- **Taxonomies**: Filter by categories, tags, or custom taxonomies
- **Specific Posts**: Search and select individual posts
- **Ordering**: Sort by date, title, random, etc.
- **Posts Per Page**: Control number of posts (1-50)

#### Custom Content
- **Add Items**: Click "Add Custom Content" to create new items
- **Configure**: Set title, content, URL, and link behavior
- **Reorder**: Use up/down arrows to reorder items
- **Enable/Disable**: Toggle items on/off

#### Styling
- **Colors**: Set background, text, and accent colors
- **Typography**: Choose font family, size, weight, line height
- **Spacing**: Adjust padding and margin
- **Border**: Set border radius

#### Controls
- **Show Controls**: Enable/disable control buttons
- **Play/Pause**: Show play/pause button
- **Navigation**: Show previous/next arrows
- **Pause on Hover**: Pause animation when hovering

### Frontend Features

The ticker automatically works on the frontend with:
- **Responsive Design** - Adapts to mobile and desktop
- **Accessibility** - Screen reader friendly
- **Performance** - Optimized for smooth animations
- **SEO Friendly** - Proper HTML structure
- **Print Styles** - Clean print layout

## File Structure

```
news-ticker-for-gutenberg/
├── src/
│   ├── index.js                 # Main block registration
│   ├── style.scss              # Editor styles
│   ├── frontend.js             # Frontend JavaScript
│   ├── frontend.scss           # Frontend styles
│   └── blocks/
│       └── news-ticker/
│           ├── index.js        # Main block component
│           ├── block.json      # Block metadata and registration
│           ├── render.php      # Server-side rendering
│           ├── index.css       # Editor styles
│           ├── style-index.css # Frontend styles
│           ├── components/     # Block components
│           │   ├── AnimationSettings.js
│           │   ├── ContentSettings.js
│           │   ├── QuerySettings.js
│           │   ├── CustomContentSettings.js
│           │   ├── StylingSettings.js
│           │   └── TickerPreview.js
│           └── hooks/
│               └── useTickerData.js
├── build/                      # Built assets
├── news-ticker-for-gutenberg.php  # Main plugin file
├── package.json               # Dependencies
└── README.md                  # This file
```

## Data Management

The plugin uses WordPress core data module for efficient data fetching:

### Core Data Integration
- **Post Types** - Uses `@wordpress/core-data` to fetch available post types
- **Taxonomies** - Uses `@wordpress/core-data` to fetch taxonomy terms
- **Posts** - Uses `@wordpress/core-data` to fetch and search posts
- **Terms** - Uses `@wordpress/core-data` to fetch and search taxonomy terms

### Custom Hooks
- `useTickerData()` - Main hook for fetching ticker content
- `usePostTypes()` - Hook for getting available post types
- `useTaxonomies()` - Hook for getting available taxonomies
- `useSearchPosts()` - Hook for searching posts
- `useSearchTerms()` - Hook for searching taxonomy terms

### Data Flow

The plugin uses WordPress core data module for all data operations:

1. **Post Types** - Fetched via `@wordpress/core-data` store
2. **Taxonomies** - Fetched via `@wordpress/core-data` store  
3. **Posts** - Fetched and searched via `@wordpress/core-data` store
4. **Terms** - Fetched and searched via `@wordpress/core-data` store

This approach provides better performance, caching, and integration with WordPress core.

## Technology Stack

### Core Technologies
- **WordPress 6.5+** - Latest WordPress version
- **PHP 8.0+** - Modern PHP with type hints and features
- **React 18.3.1** - Latest React with concurrent features
- **Gutenberg API v4** - Latest block API

### WordPress Packages
- **@wordpress/scripts 27.0.0** - Latest build tools
- **@wordpress/blocks 13.0.0** - Block registration and utilities
- **@wordpress/components 26.0.0** - UI components
- **@wordpress/data 10.0.0** - State management
- **@wordpress/core-data 6.0.0** - WordPress data integration
- **@wordpress/block-editor 13.0.0** - Editor components
- **@wordpress/element 6.0.0** - React utilities
- **@wordpress/hooks 4.0.0** - WordPress hooks
- **@wordpress/i18n 5.0.0** - Internationalization
- **@wordpress/icons 10.0.0** - Icon library
- **@wordpress/date 5.0.0** - Date utilities

### Development Tools
- **Node.js 18+** - Modern JavaScript runtime
- **npm** - Package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Sass** - CSS preprocessing

## Customization

### Adding Custom Animation Types

```javascript
// In your theme or plugin
wp.hooks.addFilter(
	'ntfg.animationTypes',
	'my-theme/custom-animations',
	( animationTypes ) => {
		return [
			...animationTypes,
			{
				value: 'custom-animation',
				label: 'Custom Animation',
				className: 'ntfg-custom-animation',
			},
		];
	}
);
```

### Customizing Ticker Styles

```scss
// In your theme's stylesheet
.ntfg-news-ticker {
	// Custom styles
	&.ntfg-custom-theme {
		background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
		border-radius: 20px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
	}
}
```

### Filtering Ticker Content

```php
// In your theme's functions.php
add_filter( 'ntfg_ticker_items', function( $items, $attributes ) {
	// Modify items before display
	foreach ( $items as &$item ) {
		$item['title'] = 'Custom: ' . $item['title'];
	}
	return $items;
}, 10, 2 );
```

## Performance Optimization

### Built-in Optimizations
- **Lazy Loading** - Content loads only when needed
- **Caching** - WordPress core data caching
- **Minification** - Production builds are minified
- **Tree Shaking** - Unused code is eliminated
- **Code Splitting** - Separate editor and frontend bundles

### Best Practices
- **Conditional Loading** - Assets load only when block is used
- **Efficient Queries** - Optimized database queries
- **Responsive Images** - Proper image sizing
- **Accessibility** - WCAG 2.1 AA compliant

## Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Internet Explorer** 11 (with polyfills)

## Accessibility

The plugin follows WCAG 2.1 AA guidelines:
- **Keyboard Navigation** - Full keyboard support
- **Screen Readers** - Proper ARIA labels and roles
- **High Contrast** - Supports high contrast mode
- **Reduced Motion** - Respects user motion preferences
- **Focus Management** - Clear focus indicators

## Troubleshooting

### Common Issues

1. **Block not appearing in editor**
   - Check if the plugin is activated
   - Clear browser cache
   - Check browser console for errors

2. **Animations not working**
   - Ensure JavaScript is enabled
   - Check for CSS conflicts
   - Verify animation settings

3. **Posts not loading**
   - Check post type permissions
   - Verify taxonomy settings
   - Check for plugin conflicts

### Debug Mode

Enable debug mode by adding to `wp-config.php`:
```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
```

### Support

- **Documentation**: [Plugin Wiki](https://github.com/your-username/news-ticker-for-gutenberg/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/news-ticker-for-gutenberg/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/news-ticker-for-gutenberg/discussions)

## Changelog

### 1.0.0
- Initial release
- 10 animation types
- WordPress data module integration
- Modern React 18.3.1
- Gutenberg API v4
- PHP 8.0+ support

## License

This plugin is licensed under the GPL v2 or later.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Credits

- Built with modern WordPress technologies
- Uses WordPress core data module
- Follows WordPress coding standards
- Implements accessibility best practices
