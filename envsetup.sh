# misc functions for development of this theme

sp_format() {
	prettier --write "**/*.md" || return 1
	# Format all CSS files except pico.min.css
	find . -name "*.css" ! -name "pico.min.css" -type f -exec prettier --write {} \; || return 1
	# unfortunately, prettier cannot format html files with tags
}
