# Applies the Nov 10 2026 script-error fixes to local copies of theme files (named like sections__header-custom.liquid).
# Usage: python3 apply_fixes.py <dir with original files> <output dir>. Each edit must match exactly once, so it refuses
# to run against a theme whose files have drifted from the version these fixes were written for.
import sys, os
src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
EDITS = {
 'sections__header-custom.liquid': [
  ("""<script
  src="{{ 'header.js' | asset_url }}"
  type="module"
></script>
""", """{%- comment -%} header.js removed Nov 10 2026: the asset does not exist in this theme (404 on every page). {%- endcomment -%}
"""),
  ("""{% unless request.design_mode %}
  <script type="module">
    import { hydrate } from '@theme/section-hydration';
    const url = new URL(window.location.href);
    url.searchParams.delete('page');
    hydrate('{{ section.id }}', url);
  </script>
{% endunless %}
""", """{%- comment -%}
  Removed Nov 10 2026: inline module importing '@theme/section-hydration'. These layouts have no
  import map, so it threw "Failed to resolve module specifier" on every page and never ran.
  The header menus are fully server-rendered, so hydration had nothing to add.
{%- endcomment -%}
"""),
 ],
 'snippets__header-custom-actions.liquid': [
  ("""<script
  type="module"
  src="{{ 'cart-icon.js' | asset_url }}"
  fetchpriority="low"
></script>
""", """{%- comment -%} cart-icon.js removed Nov 10 2026: asset does not exist (404). Cart count is synced by the inline script below. {%- endcomment -%}
"""),
  ("""<script
  type="module"
  src="{{ 'header-actions.js' | asset_url }}"
  fetchpriority="low"
></script>
""", """{%- comment -%} header-actions.js removed Nov 10 2026: asset does not exist (404). {%- endcomment -%}
"""),
 ],
 'snippets__header-custom-drawer.liquid': [
  ("""<script
  src="{{ 'header-drawer.js' | asset_url }}"
  type="module"
  fetchpriority="low"
></script>
""", """{%- comment -%} header-drawer.js removed Nov 10 2026: asset does not exist (404). The drawer runs on native <details> plus the inline script at the end of this file. {%- endcomment -%}
"""),
  ("""<header-drawer
  class="header-drawer {{ class }}\"""", """{%- comment -%}
  Nov 10 2026: tag renamed from <header-drawer> to <zt-header-drawer>. global.js (Dawn) defines a
  <header-drawer> element that took over this menu and threw "Cannot read properties of null
  (reading 'classList')" on every open (it looks for Dawn's .header-wrapper). This menu runs on
  native <details> plus the inline script at the end of this file; the .header-drawer class is unchanged.
{%- endcomment -%}
<zt-header-drawer
  class="header-drawer {{ class }}\""""),
  ("""</header-drawer>""", """</zt-header-drawer>"""),
  ("""      if (!details.classList || !details.classList.contains('menu-drawer-container')) return;
      details.classList.toggle('menu-open', details.open);
    },""", """      if (!details.classList || !details.classList.contains('menu-drawer-container')) return;
      details.classList.toggle('menu-open', details.open);
      const summary = details.querySelector(':scope > summary');
      if (summary) summary.setAttribute('aria-expanded', details.open ? 'true' : 'false');
    },"""),
 ],
 'snippets__cart-drawer.liquid': [
  ("""{{ 'quantity-popover.css' | asset_url | stylesheet_tag }}
<script src="{{ 'cart.js' | asset_url }}" defer="defer"></script>
<script src="{{ 'quantity-popover.js' | asset_url }}" defer="defer"></script>
""", """{{ 'quantity-popover.css' | asset_url | stylesheet_tag }}
{%- comment -%}
  Nov 10 2026: the cacao-lp templates use layout/theme.cacao-lp.liquid, which already loads cart.js and
  quantity-popover.js in <head> (before cart-drawer.js). Loading cart.js a second time threw
  "CartRemoveButton has already been declared", so the copies here are skipped on those templates.
{%- endcomment -%}
{%- unless template.suffix contains 'cacao-lp' -%}
<script src="{{ 'cart.js' | asset_url }}" defer="defer"></script>
<script src="{{ 'quantity-popover.js' | asset_url }}" defer="defer"></script>
{%- endunless -%}
"""),
 ],
 'sections__buy-box-cacao-lp-v2.liquid': [
  ("""{%- unless settings.cart_type == 'drawer' -%}
  {{ 'component-cart-drawer.css' | asset_url | stylesheet_tag }}""", """{%- comment -%}
  Nov 10 2026: skipped on the cacao-lp templates. Their layout (theme.cacao-lp) always renders the cart
  drawer and loads its CSS/JS, so this second copy duplicated #CartDrawer and threw
  "CartRemoveButton / CartDrawer has already been declared".
{%- endcomment -%}
{%- unless settings.cart_type == 'drawer' or template.suffix contains 'cacao-lp' -%}
  {{ 'component-cart-drawer.css' | asset_url | stylesheet_tag }}"""),
 ],
}
ok = True
for fn, edits in EDITS.items():
    t = open(os.path.join(src, fn)).read()
    for old, new in edits:
        c = t.count(old)
        if c != 1:
            print(f'FAIL {fn}: expected 1 match, found {c} for: {old[:60]!r}'); ok = False; continue
        t = t.replace(old, new)
    open(os.path.join(dst, fn), 'w').write(t)
    print('ok', fn, len(t))
sys.exit(0 if ok else 1)
