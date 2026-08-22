.PHONY: check install uninstall

check:
	cjs tests/check-source.js applet.js metrics.js
	cjs tests/test-metrics.js
	python3 -m json.tool metadata.json >/dev/null
	python3 -m json.tool settings-schema.json >/dev/null
	shellcheck install.sh uninstall.sh

install:
	./install.sh

uninstall:
	./uninstall.sh
