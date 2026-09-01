.PHONY: check social-preview check-social-preview install uninstall

check:
	cjs tests/check-source.js applet.js metrics.js
	cjs tests/test-metrics.js
	python3 -m json.tool metadata.json >/dev/null
	python3 -m json.tool settings-schema.json >/dev/null
	python3 tests/check-svg.py icon.svg icons/*.svg .github/social-preview-src/overlay.svg
	shellcheck install.sh uninstall.sh

social-preview:
	python3 .github/social-preview-src/render-all.py

check-social-preview:
	python3 .github/social-preview-src/render-all.py --check

install:
	./install.sh

uninstall:
	./uninstall.sh
