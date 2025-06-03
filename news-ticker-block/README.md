# News Ticker Gutenberg Block

A customizable Gutenberg block for displaying a news ticker with various animation effects, advanced content sourcing, and comprehensive styling options. This block is dynamically rendered using PHP.

## Description

The News Ticker Block allows you to create engaging and visually distinct news tickers directly within the WordPress Gutenberg editor. You can display posts from your site (with advanced selection controls), add multiple custom content items via a repeater, and choose from several animation styles, and now meticulously control the appearance of every part of the ticker.

## Features

*   **Dynamically Rendered:** Ensures easier updates and maintenance.
*   **Multiple Animation Types:** Scrolling, Up/Down, Left-Right Sliding. (Typing effect is a placeholder).
*   **Adjustable Ticker Speed & Direction.**
*   **Navigation & Play/Pause Controls.**
*   **Pause on Hover Option.**
*   **Advanced Content Sourcing:**
    *   Dynamic Post Type selection.
    *   Taxonomy & Term selection (searchable).
    *   Specific Post selection (searchable by title).
    *   Custom Content Repeater (multiple RichText items).
    *   Custom content appends to queried posts.
*   **Comprehensive Styling & Typography Options:**
    *   **Ticker Container:** Control background color, padding (top, right, bottom, left), border (width, style, color, radius).
    *   **Header Area:** Control background color, padding (top, bottom).
    *   **Header Heading:** Control text color, font family, font size, font weight.
    *   **Content Items Area:** Control background color.
    *   **Individual News Items (Global Style):** Control text color, link color (for queried posts), font family, font size, line height.
    *   **Navigation/Controls Buttons:** Control background color, text color, border color.
*   **Block Alignment:** Supports "Wide" and "Full" alignments if the theme allows.
*   **Customizable Display Elements:** Logo, "Breaking News" heading text, "Live" text, Date.

## Installation

### From WordPress Admin (Zip):
1.  Download the plugin as a ZIP file.
2.  Go to `Plugins > Add New` in WordPress admin.
3.  Click `Upload Plugin`, choose the ZIP, and activate.

### From Source (Development):
1.  Clone/download the repository.
2.  In the plugin's root directory (`news-ticker-block`), run:
    *   `npm install` (Installs dependencies like `@wordpress/scripts`, `uuid`).
    *   `npm run build` (for production) or `npm run start` (for development).
3.  Copy `news-ticker-block` directory to `wp-content/plugins/`.
4.  Activate from WordPress admin.

## Usage

1.  Open a post/page in the Gutenberg editor.
2.  Add the "News Ticker" block.
3.  **Configure the Ticker (Inspector Panel on the right):**
    *   **Ticker Settings Panel:** Animation type, speed, direction.
    *   **Content Source Panel:** Configure post type, taxonomy/terms, specific posts, or add custom items via the repeater.
    *   **Styling Panels (New!):**
        *   **Container Styling:** Adjust background, padding, and border for the entire ticker block.
        *   **Header Styling:** Customize background, padding, and font properties for the header text.
        *   **Content Items Styling:** Set background for the content area, and global text/link colors and typography for news items.
        *   **Controls (Buttons) Styling:** Change background, text, and border colors for navigation and play/pause buttons.
        *   *Note:* While these settings are applied on the front-end, the editor preview may not reflect all detailed style changes live.
    *   **Display Elements Panel:** Upload logo, set heading text, toggle "Live" text, date visibility.
    *   **Ticker Controls Panel:** Toggle navigation arrows, play/pause button, pause on hover.
4.  The block supports "Wide" and "Full" alignments via the block toolbar if your theme supports them.
5.  Save and view on the front-end to see all configurations and styles applied.

## Styling

The block now includes extensive built-in styling options. Base structural styles and interactive effects (like link hovers) are in `style.scss`. Most visual details are applied as inline styles based on your editor settings. You can still override styles using your theme's custom CSS if needed (e.g., by targeting `.wp-block-create-block-news-ticker-block` or its inner elements).

## Known Issues / Limitations (Current Version)

*   **Typing Animation:** The "Typography Effect" is still a placeholder.
*   **Seamless Scroll Animation:** May require fine-tuning for perfect seamlessness.
*   **`posts_per_page` for WP_Query:** Hardcoded in PHP; could be a future attribute.
*   **Dynamic Link Color in Custom RichText:** The "Item Link Color" setting primarily affects links in queried posts. Links manually created within RichText custom items will inherit the "Item Text Color" or their own RichText formatting.

EOF_README
