#!/bin/sh
# SPDX-License-Identifier: GPL-3.0-or-later
set -eu

project_dir=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)
data_root=${XDG_DATA_HOME:-"$HOME/.local/share"}
uuid=system-monitor@claudiu.local
applet_dir="$data_root/cinnamon/applets/$uuid"

mkdir -p "$applet_dir"
for file in applet.js metrics.js metadata.json settings-schema.json icon.svg README.md ATTRIBUTION.md LICENSE; do
    install -m 0644 "$project_dir/$file" "$applet_dir/$file"
done

printf '%s\n' "Adaptive System Monitor installed. Add or reload it in Cinnamon Applets."
