"""Shared helpers for checking the LIVE site instead of the build.

fetch(url) -> (status, text)
live_block(base, page) -> (block_html, full_page_html): the Zeotein block as GoHighLevel serves it, cut from the
    page HTML between the block's own marker comment and the end of its script, so checks see exactly what was
    pasted (GoHighLevel's own page code is left out).
"""
import html
import urllib.error
import urllib.request

UA = {"User-Agent": "Mozilla/5.0 (zeotein live check)"}
_cache = {}


def fetch(url, timeout=40):
    if url in _cache:
        return _cache[url]
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            out = (r.status, r.read().decode("utf-8", "replace"))
    except urllib.error.HTTPError as e:
        out = (e.code, "")
    except Exception as e:  # noqa: BLE001
        out = (f"error: {e.__class__.__name__}", "")
    _cache[url] = out
    return out


def live_block(base, page):
    status, raw = fetch(base.rstrip("/") + page["path"])
    if status != 200:
        raise RuntimeError(f"{page['path']}: HTTP {status}")
    marker = f"<!-- Zeotein Google Site | {page['name']} page ({page['path']})"
    for src in (raw, html.unescape(raw)):
        start = src.find(marker)
        if start < 0:
            continue
        cat = src.find("var CATALOG = ", start)
        end = src.find("</script>", cat if cat > 0 else start)
        if end > 0:
            return src[start:end + len("</script>")], raw
    raise RuntimeError(f"{page['path']}: Zeotein block not found in the live page")
