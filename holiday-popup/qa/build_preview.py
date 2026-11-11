"""Render the Liquid snippet to static HTML for local QA (mock endpoint, local cover)."""
import re, pathlib, sys
root = pathlib.Path(__file__).resolve().parent.parent
s = (root/'snippet/zt-holiday-popup.liquid').read_text()
s = re.sub(r'\{%-? comment -?%\}.*?\{%-? endcomment -?%\}', '', s, flags=re.S)
s = re.sub(r'\{%-? liquid.*?-?%\}', '', s, count=1, flags=re.S)
s = re.sub(r'\{%-? (if|endif)[^%]*-?%\}', '', s)
s = s.replace("{{ 'zt-holiday-guide-cover.webp' | asset_url }}", '../assets/zt-holiday-guide-cover.webp')
s = s.replace('{{ zt_hp_endpoint | json }}', '"/mock"')
assert '{{' not in s and '{%' not in s, 'unrendered liquid'
page = f'''<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>body{{margin:0;font-family:Poppins}} .fake{{height:2400px;background:linear-gradient(#efeae2,#d9d3c8)}} .fake h1{{margin:0;padding:120px 24px;font:800 clamp(28px,5vw,56px) Poppins;color:#2a1f4a}}</style></head>
<body><div class="fake"><h1>23G PROTEIN. SIX INGREDIENTS. ZERO SUGAR.</h1></div>{s}</body></html>'''
(root/'qa/preview.html').write_text(page)
print('ok')
