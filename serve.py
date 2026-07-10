#!/usr/bin/env python3
"""Local dev server for the static portfolio, mirroring Netlify's behavior:
- serves files from this repo (the folder this script lives in)
- "/" -> index.html
- extensionless clean URLs fall back to "<path>.html" (matches _redirects)

Run directly:  python3 serve.py [port]
Port resolution: $PORT, then the first CLI arg, then 4321.
No dependencies — uses only the Python standard library.
"""
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

# Root is the directory containing this script, so it works no matter where
# the repo is cloned or which working directory the process is launched from.
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def translate_path(self, path):
        local = super().translate_path(path)
        # Clean-URL routing: if the path has no extension and isn't a real file,
        # try "<path>.html" (covers the /design-system-calendar redirect, etc.).
        if not os.path.isdir(local) and not os.path.isfile(local):
            _, ext = os.path.splitext(local)
            if not ext and os.path.isfile(local + ".html"):
                return local + ".html"
        return local


def main():
    port = int(os.environ.get("PORT") or (sys.argv[1] if len(sys.argv) > 1 else 4321))
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"Serving {ROOT} at http://127.0.0.1:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
