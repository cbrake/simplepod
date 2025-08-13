# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

SimplePod is a Zola theme for creating podcast websites with iTunes-compatible
RSS feeds. It generates static sites with built-in audio players, episode
management, and comprehensive podcast metadata support.

## Code formatting

After any operation that updates markdown or css files, `sp_format` (from
`envsetup.sh`) is run to apply consistent formatting.

## Essential Commands

### Development

```bash
# Start development server with live reload
zola serve

# Build production site
zola build
```

### Working with Episodes

Episodes are markdown files in the `content/` directory with required frontmatter:

- `title`: Episode title
- `date`: Publication date  
- `[extra]` section with: audio_file, duration, episode_number, season (optional)

## Architecture & Key Files

### Template System

The theme uses Zola's Tera templating engine with three core templates:

- `templates/base.html`: Main layout wrapper defining header, nav, footer
- `templates/episode/list.html`: Episode listing page with pagination
- `templates/episode/single.html`: Individual episode pages with audio player
- `templates/rss.xml`: iTunes RSS feed generation (generates at `/rss.xml`)

### Configuration Flow

1. **Theme Configuration** (`theme.toml`): Defines theme metadata and Zola
   version requirements
2. **Site Configuration** (`example/config.toml`): Contains all podcast metadata
   in `[extra]` section including iTunes-specific fields
3. **Episode Content** (`content/*.md`): Individual episodes with audio references

### iTunes RSS Feed

The RSS feed template (`templates/rss.xml`) generates a complete
iTunes-compatible feed at `/rss.xml` with:

- Podcast-level metadata from config.toml `[extra]` section
- Episode enclosures pointing to audio files in `static/audio/`
- Support for seasons, episode numbers, explicit content flags
- Proper iTunes namespace declarations and tags

### Static Assets

- Audio files: `static/audio/` (referenced in episode frontmatter)
- CSS: `static/pico.min.css` (Pico CSS framework) + `static/style.css` (custom styles)
- Images: Logo and other assets in `static/`

## Development Notes

### Adding New Features

- Template modifications affect all generated sites
- New template variables must be defined in either config.toml `[extra]` or
  episode frontmatter
- RSS feed changes require careful testing for iTunes compatibility

### Testing Changes

When modifying templates or configuration:

1. Run `zola serve` to preview changes locally
2. Check generated RSS feed at `/rss.xml`
3. Validate RSS feed with podcast validators before deployment

### Common Customizations

- Navigation links: Edit `[extra.nav_links]` in config.toml
- Podcast metadata: Modify `[extra]` section in config.toml
- Episode template: Customize `templates/episode/single.html`
- Homepage: Modify `templates/index.html` or create custom content pages
