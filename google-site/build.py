#!/usr/bin/env python3
"""
Build the Zeotein Google Site.

  python3 build.py

Reads  src/config.json, src/styles.css, src/partials/*, src/pages/*
Writes dist/ghl/NN-<slug>.html      one paste-ready block per GoHighLevel page (Custom Code element)
       dist/preview/<slug>/index.html  the same block wrapped in a full HTML page, for testing
       dist/manifest.json              page list with SEO title/description and block sizes

No dependencies beyond the Python standard library.
"""
import json, re, sys, datetime, pathlib, html

ROOT = pathlib.Path(__file__).resolve().parent
SRC, DIST = ROOT / "src", ROOT / "dist"

# The website-level body script that is already saved in GoHighLevel
# (Sites > Websites > Zeotein Google Site > Settings > Tracking code > Body).
# Copied verbatim into the PREVIEW only, so tests behave like production.
# The Google Ads tag, Meta pixel and Clarity are deliberately NOT copied into the
# preview, so testing never sends fake visits into the real ad accounts.
GHL_BODY_PASSTHROUGH = r"""<script>
(function () {
  var KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','gclid','gbraid','wbraid','fbclid','ttclid','msclkid','ref'];
  var HOSTS = ['zeotein.com','www.zeotein.com'];
  function passParams() {
    try {
      var page = new URLSearchParams(window.location.search);
      var keys = KEYS.filter(function (k) { return page.get(k); });
      if (!keys.length) return;
      document.querySelectorAll('a[href]').forEach(function (a) {
        if (HOSTS.indexOf(a.hostname) === -1) return;
        var url = new URL(a.href);
        var changed = false;
        keys.forEach(function (k) { if (!url.searchParams.has(k)) { url.searchParams.set(k, page.get(k)); changed = true; } });
        if (changed) a.href = url.toString();
      });
    } catch (e) {}
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', passParams); } else { passParams(); }
  window.addEventListener('load', passParams);
  document.addEventListener('click', passParams, true);
})();
</script>"""

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">')


def minify_css(css: str) -> str:
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"\s+", " ", css)
    css = re.sub(r"\s*([{};,>])\s*", r"\1", css)
    css = css.replace(";}", "}")
    return css.strip()


def squeeze_html(s: str) -> str:
    # collapse indentation between tags; keeps text content intact
    s = re.sub(r">\s*\n\s*<", "><", s)
    s = re.sub(r"\n\s+", "\n", s)
    return s.strip()


def render(text: str, vars_: dict, slug: str, depth=0) -> str:
    if depth > 6:
        raise RuntimeError("partials nested too deep")

    def inc(m):
        name = m.group(1)
        p = SRC / "partials" / f"{name}.html"
        if not p.exists():
            raise FileNotFoundError(f"missing partial {name}")
        return render(p.read_text(), vars_, slug, depth + 1)

    text = re.sub(r"\{\{>\s*([a-z0-9-]+)\s*\}\}", inc, text)

    def cur(m):
        return 'aria-current="page"' if m.group(1) == slug else ""

    text = re.sub(r"\{\{cur_([a-z0-9-]+)\}\}", cur, text)

    def var(m):
        k = m.group(1)
        if k not in vars_:
            raise KeyError(f"unknown variable {{{{{k}}}}}")
        return str(vars_[k])

    for _ in range(3):  # values may themselves contain {{placeholders}}
        new = re.sub(r"\{\{([A-Za-z0-9_]+)\}\}", var, text)
        if new == text:
            break
        text = new
    return text


def write_head_snippet(manifest):
    """dist/ghl/00-website-head.html: pasted once at the end of the website's Head tracking code.
    Fit CSS (same text as the ghl-fit block in styles.css) plus page titles/descriptions used only when a
    page's own SEO fields are empty."""
    raw = (SRC / "styles.css").read_text()
    m = re.search(r"/\* ghl-fit:start.*?\*/\n(.*?)/\* ghl-fit:end \*/", raw, re.S)
    if not m:
        raise SystemExit("styles.css: ghl-fit markers missing")
    seo = {p["path"]: [p["seoTitle"], p["seoDescription"]] for p in manifest}
    seo["/"] = seo["/home"]
    snippet = (
        "<!-- Zeotein Google Site fit: paste at the END of Website settings > Tracking code > Head -->\n"
        "<style id=\"zt-ghl-fit\">\n/* Zeotein Google Site: page blocks run edge to edge, header stays pinned */\n"
        + m.group(1).strip() + "\n</style>\n"
        "<script id=\"zt-ghl-seo\">\n"
        "/* Zeotein Google Site: page title and description, used only when a page's SEO fields are empty */\n"
        "(function () {\n"
        f"  var SEO = {json.dumps(seo, ensure_ascii=False)};\n"
        "  var m = SEO[location.pathname.replace(/\\/+$/, '') || '/'];\n"
        "  if (!m) return;\n"
        "  function apply() {\n"
        "    if (!document.title.trim()) document.title = m[0];\n"
        "    var d = document.querySelector('meta[name=\"description\"]');\n"
        "    if (!d) { d = document.createElement('meta'); d.setAttribute('name', 'description'); document.head.appendChild(d); }\n"
        "    if (!d.getAttribute('content')) d.setAttribute('content', m[1]);\n"
        "  }\n"
        "  apply();\n"
        "  document.addEventListener('DOMContentLoaded', apply);\n"
        "  window.addEventListener('load', apply);\n"
        "})();\n"
        "</script>\n"
    )
    (DIST / "ghl" / "00-website-head.html").write_text(snippet)
    print(f"built dist/ghl/00-website-head.html  {len(snippet.encode('utf-8')):>6} bytes")


def main():
    cfg = json.loads((SRC / "config.json").read_text())
    v = cfg["vars"]
    css = minify_css((SRC / "styles.css").read_text())
    js_src = (SRC / "partials" / "scripts.js").read_text()
    stamp = datetime.date.today().isoformat()

    (DIST / "ghl").mkdir(parents=True, exist_ok=True)
    (DIST / "preview").mkdir(parents=True, exist_ok=True)
    manifest = []

    for i, page in enumerate(cfg["pages"], start=1):
        slug = page["slug"]
        pv = {**v, **page.get("vars", {})}
        body = render((SRC / "pages" / page["file"]).read_text(), pv, slug)
        header = render((SRC / "partials" / "header.html").read_text(), pv, slug)
        footer = render((SRC / "partials" / "footer.html").read_text(), pv, slug)
        js = render(js_src, pv, slug)
        has_sticky = 'data-zt-sticky' in body
        root_cls = "ztg has-sticky" if has_sticky else "ztg"
        leftover = re.findall(r"\{\{[^}]*\}\}", body + header + footer + js)
        if leftover:
            raise SystemExit(f"{slug}: unresolved placeholders {leftover}")

        block = (
            f"<!-- Zeotein Google Site | {page['name']} page ({page['path']}) | built {stamp} from zeotein-theme/google-site. "
            f"Paste this whole block into ONE Custom Code element on the {page['name']} page. -->\n"
            f"{FONTS}\n<style>{css}</style>\n"
            f"<div class=\"{root_cls}\">\n{squeeze_html(header)}\n<main id=\"zt-main\">\n{squeeze_html(body)}\n</main>\n{squeeze_html(footer)}\n</div>\n"
            f"<script>\n{js.strip()}\n</script>\n"
        )
        out = DIST / "ghl" / f"{i:02d}-{slug}.html"
        out.write_text(block)

        preview = (
            "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n"
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
            f"<title>{html.escape(page['seoTitle'])}</title>\n"
            f"<meta name=\"description\" content=\"{html.escape(page['seoDescription'])}\">\n"
            "<meta name=\"robots\" content=\"noindex, nofollow\">\n"
            "<style>html,body{margin:0;padding:0;background:#fff}</style>\n</head>\n<body>\n"
            f"{block}\n<!-- GoHighLevel website-level body script (verbatim, preview parity) -->\n{GHL_BODY_PASSTHROUGH}\n"
            "</body>\n</html>\n"
        )
        pdir = DIST / "preview" / slug
        pdir.mkdir(parents=True, exist_ok=True)
        (pdir / "index.html").write_text(preview)
        if slug == "home":
            (DIST / "preview" / "index.html").write_text(preview)

        manifest.append({
            "order": i, "slug": slug, "name": page["name"], "path": page["path"],
            "seoTitle": page["seoTitle"], "seoDescription": page["seoDescription"],
            "ghlFile": f"dist/ghl/{out.name}", "bytes": len(block.encode("utf-8")),
        })
        print(f"built {out.relative_to(ROOT)}  {len(block.encode('utf-8')):>6} bytes")

    (DIST / "manifest.json").write_text(json.dumps({"built": stamp, "pages": manifest}, indent=2))
    write_head_snippet(manifest)
    print("ok")


if __name__ == "__main__":
    main()
