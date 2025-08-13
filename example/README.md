# SimplePod Example Site

This is an example site demonstrating the SimplePod theme for Zola.

## Setup Instructions

1. Make sure you have
   [Zola](https://www.getzola.org/documentation/getting-started/installation/)
   installed.

2. The SimplePod theme is in the parent directory. To use it, either:

   - Copy the entire SimplePod theme directory to `themes/simplepod`, OR
   - Update the config.toml to point to the parent directory theme

3. Add your audio files to the `static/audio/` directory.

4. Run the development server:

   ```bash
   zola serve
   ```

5. Build for production:
   ```bash
   zola build
   ```

## Configuration

Edit `config.toml` to customize:

- Podcast title and description
- iTunes/Apple Podcasts metadata
- Spotify URL
- Author information
- Categories and tags

## Creating Episodes

Episodes are markdown files in the `content/` directory. Each episode should
include:

- Title and date
- Description
- Audio file path
- Duration
- Episode number
- Optional: show notes, transcript, tags

See the example episodes for the complete format.

## RSS Feed

The podcast RSS feed compatible with Apple Podcasts is automatically generated
at `/rss.xml`.
