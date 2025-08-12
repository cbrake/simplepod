# SimplePod

SimplePod is a Zola site generator theme used for podcasts. It has the following
features:

- generates tags needed for Apple Itunes
- has episodes
- generates a `episode/index.xml` file compatible with Apple iTunes
- when rending each espisode, there is an web audio player
- the 'example/' directory contains an exmaple site that uses this theme
- uses the pico css framework for styling

## Configuration

Add the following configuration variables to your `config.toml` file in the
`[extra]` section:

### Basic Settings

- `language` - Language code for the podcast (e.g., "en-us")
- `show_copyright` - Show copyright notice in footer (boolean, default: false)
- `podcast_description` - Long description of your podcast for the homepage
- `podcast_logo` - Path to podcast logo image (e.g., "/podcast-logo.svg")
- `media_prefix` - URL prefix for audio files. By default, files are assumed to
  be in the `static/audio` directory if this is not set.

### iTunes/Apple Podcasts Settings

- `itunes_author` - Podcast author name
- `itunes_summary` - Brief podcast summary for iTunes
- `itunes_owner_name` - Podcast owner's name
- `itunes_owner_email` - Podcast owner's email
- `itunes_image` - Full URL to podcast cover art (1400x1400 to 3000x3000 pixels
  recommended)
- `itunes_category` - Main iTunes category (e.g., "Technology")
- `itunes_subcategory` - iTunes subcategory (e.g., "Tech News")
- `itunes_explicit` - Content rating ("true" or "false")
- `itunes_type` - Podcast type ("episodic" or "serial")
- `itunes_url` - Link to your podcast on Apple Podcasts

### Additional Links

- `spotify_url` - Link to your podcast on Spotify
- `nav_links` - Array of navigation links, each with `name` and `url` fields

### Episode Front Matter

Each episode markdown file should include the following in its front matter:

```toml
+++
title = "Episode Title"
date = 2024-01-01
template = "episode/single.html"

[extra]
audio_file = "episode-001.mp3"  # File should be in static/audio/
duration = "35:42"  # Format: MM:SS or HH:MM:SS
episode_number = 1
season = 1  # Optional
explicit = false  # Optional, defaults to false
+++
```

See the `example/` directory for a complete working configuration
