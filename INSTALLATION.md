# News Ticker for Gutenberg - Installation Guide

## Prerequisites

### System Requirements
- **WordPress**: 6.0 or higher
- **PHP**: 8.0 or higher
- **Node.js**: 18 or higher (for development)
- **npm**: 9 or higher

### Recommended
- **WordPress**: 6.5 or higher
- **PHP**: 8.1 or higher
- **Node.js**: 20 or higher
- **Modern browser** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

## Installation Steps

### 1. Download/Clone the Plugin

```bash
# Option 1: Clone from GitHub
git clone https://github.com/your-username/news-ticker-for-gutenberg.git
cd news-ticker-for-gutenberg

# Option 2: Download ZIP and extract
# Download from GitHub releases and extract to wp-content/plugins/
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Or if you prefer yarn
yarn install
```

### 3. Build the Plugin

```bash
# Build for production
npm run build

# Or for development with watch
npm run dev
```

### 4. Activate the Plugin

1. Copy the plugin folder to your WordPress `wp-content/plugins/` directory
2. Go to WordPress Admin → Plugins
3. Find "News Ticker for Gutenberg" and click "Activate"

## Development

### Development Commands

```bash
# Start development server with watch
npm run dev

# Build for production
npm run build

# Lint JavaScript code
npm run lint:js

# Lint CSS/SCSS code
npm run lint:css

# Format code
npm run format

# Update WordPress packages
npm run packages-update

# Create plugin ZIP
npm run plugin-zip
```

### Development Environment

The plugin uses modern WordPress development tools:

- **@wordpress/scripts 27.0.0** - Build tools and development server
- **React 18.3.1** - Latest React with concurrent features
- **Gutenberg API v4** - Latest block API
- **PHP 8.0+** - Modern PHP with type hints

## Features Overview

### Animation Types
- Scrolling, Up-Down, Sliding, Typography, Fade, Typing, Bounce, Slide Up, Zoom, Flip

### Content Sources
- WordPress posts (any post type)
- Custom content repeater
- Taxonomy filtering
- Specific post selection

### Styling Options
- Colors, typography, spacing, borders
- Responsive design
- Accessibility features

### Controls
- Play/pause, navigation arrows
- Pause on hover
- Adjustable speed

## Troubleshooting

### Common Issues

1. **Build fails**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Block not appearing**
   - Check if plugin is activated
   - Clear browser cache
   - Check browser console for errors

3. **PHP version error**
   - Upgrade to PHP 8.0 or higher
   - Contact your hosting provider

4. **Node.js version error**
   - Upgrade to Node.js 18 or higher
   - Use nvm to manage Node.js versions

### Debug Mode

Enable WordPress debug mode in `wp-config.php`:
```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );
```

## Support

- **Documentation**: [Plugin Wiki](https://github.com/your-username/news-ticker-for-gutenberg/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/news-ticker-for-gutenberg/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/news-ticker-for-gutenberg/discussions)

## Technology Stack

### Latest Versions
- **WordPress**: 6.5+
- **PHP**: 8.0+
- **React**: 18.3.1
- **Node.js**: 18+
- **Gutenberg API**: v4
- **@wordpress/scripts**: 27.0.0

### WordPress Packages
- **@wordpress/blocks**: 13.0.0
- **@wordpress/components**: 26.0.0
- **@wordpress/data**: 10.0.0
- **@wordpress/core-data**: 6.0.0
- **@wordpress/block-editor**: 13.0.0
- **@wordpress/element**: 6.0.0
- **@wordpress/hooks**: 4.0.0
- **@wordpress/i18n**: 5.0.0
- **@wordpress/icons**: 10.0.0
- **@wordpress/date**: 5.0.0

## License

GPL v2 or later - Same as WordPress 