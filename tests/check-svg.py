#!/usr/bin/env python3
"""Validate the SVG assets with Python's standard XML parser."""

import sys
import xml.etree.ElementTree as element_tree


for path in sys.argv[1:]:
    element_tree.parse(path)
