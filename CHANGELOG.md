# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

A theme is a contract with the sites that install it, so the version number
describes what a site owner has to do to move forward. A major release means
editing `config.toml`, the episode front matter, or an overridden template. A
minor release adds something a site can choose to use. A patch release changes
only what the templates render.

## [unreleased]

### Added

- `extra.newsletter_form_action`, which renders an email signup form that posts
  to a hosted newsletter service. The form appears in the footer of every page
  and again on the home page below the hero, where it reaches readers who are
  deciding whether to follow the show. `extra.newsletter_title` and
  `extra.newsletter_description` adjust the wording around it. Sites that leave
  these unset render the footer exactly as before.

## [v0.2.0] - 2026-08-11

### Added

- `extra.guid` on an episode, which sets the item's `<guid>`. A podcast moved
  from another site generator keeps the identifiers its episodes were first
  published with, so subscribers' clients do not treat the back catalogue as new
  downloads. Episodes without it keep using the permalink.
- `extra.feed_description`, which sets the feed's channel `<description>`
  independently of `config.description`. Sites whose show blurb differs from
  their meta description no longer have to choose between them.
- `extra.itunes_subtitle`, which publishes a channel-level `<itunes:subtitle>`.
- A `feed_path` variable that a wrapper template can set before including
  `rss.xml`, so a feed rendered at another location points its `atom:link` at
  itself. This lets a site publish the feed at a path inherited from a previous
  generator.

### Fixed

- Episode descriptions were escaped inside the `<description>` CDATA block, so
  an apostrophe reached podcast clients as `&#x27;` rather than as itself.
- The navigation link template passed the `starting_with` test a positional
  argument, which Zola 0.23 rejects at parse time, so no page rendered. The
  argument is now named.

## [v0.1.0] - 2026-08-06

The first tagged release. Sites installed before now track `main` directly and
can move to the tag without changing their configuration.

### Added

- An iTunes-compatible RSS feed at `/rss.xml`, covering enclosures, durations,
  episode and season numbers, explicit flags, and per-episode artwork.
  `media_prefix` points the enclosures at audio hosted away from the site.
- A web audio player and a download link on every episode page.
- Client-side full-text search over every episode, built on the search index
  Zola generates. Search runs in the browser, with no external service involved.
- Tag and author pages, from the `tags` and `authors` taxonomies.
- Static pages under `content/pages/`, which render without the audio player and
  episode navigation.
- Styling through pico.css, so a site needs no build step and no npm packages.
- Optional Fathom analytics, a call-to-action line, and configurable navigation
  links.
- A demo site at the repository root, published to GitHub Pages, that doubles as
  a starting point for a new podcast.

### Fixed

- Episode navigation. The previous and next links read `page.earlier` and
  `page.later`, which Zola renamed to `page.lower` and `page.higher` in 0.20, so
  every episode page rendered an empty navigation element.
- Logo proportions. The navigation and hero rules set both a width and a height,
  which stretched any logo that was not square. Both now use
  `object-fit: contain`, so a wordmark keeps its shape in the same footprint.
- `min_version` in `theme.toml`, which claimed 0.19.0 while the templates need
  0.20.0.

### Removed

- `extra.simplepod_version` from `theme.toml`. Nothing read it, and a version
  string with no release behind it could only drift from the tags.
