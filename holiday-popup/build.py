"""Build the holiday guide signup blocks from src/.

Outputs
  dist/ghl-popup.html          GHL funnel page: Custom Code element (or page Footer Tracking Code) for the pop-up
  dist/ghl-landing-form.html   GHL funnel page: Custom Code element that replaces the native opt-in form
  snippet/zt-holiday-popup.liquid  Shopify version (parked; homepage placement is a later decision)
  qa/preview-lp.html           local QA page (mock relay) for qa/popup_check.js

Set ENDPOINT once the relay (worker/worker.js) is deployed, then rebuild.
"""
import json, pathlib
R = pathlib.Path(__file__).resolve().parent
src = lambda n: (R / 'src' / n).read_text()

ENDPOINT = ''  # e.g. https://zt-holiday-relay.<account>.workers.dev
COVER = 'https://cdn.shopify.com/s/files/1/0775/5458/1717/files/zt-holiday-guide-cover-v3-hd.webp?v=1794429264'
NEXT_URL = ''  # landing form: next funnel step, e.g. /thank-you-/-download-page (leave blank to stay on page)
FONTS = '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">'


def cfg(source, endpoint=ENDPOINT, next_url=''):
    c = {'endpoint': endpoint}
    if next_url: c['nextUrl'] = next_url  # only the landing form sets this, so the pop-up block can't blank it
    return f"<script>window.ZT_HG=Object.assign(window.ZT_HG||{{}},{json.dumps(c)});</script>"


def form(cta, source):
    return src('form.html').replace('__CTA__', cta).replace('__SOURCE__', source)


shared = f"<style>{src('form.css')}</style><script>{src('form.js')}</script>"


def popup_block(source, endpoint=ENDPOINT, cover=COVER):
    markup = src('popup.html').replace('__COVER__', cover).replace('__FORM__', form('Send My Free Guide 🎄', source))
    return (f"<!-- Zeotein holiday guide pop-up ({source}). Built by holiday-popup/build.py, do not hand-edit. -->\n"
            f"{FONTS}\n{cfg(source, endpoint)}\n{shared}\n<style>{src('popup.css')}</style>\n{markup}\n<script>{src('popup.js')}</script>\n")


def landing_block(endpoint=ENDPOINT, next_url=NEXT_URL):
    markup = src('landing-form.html').replace('__FORM__', form('Get My Free Guide 🎄', 'holiday-guide-lp'))
    return (f"<!-- Zeotein holiday guide one-step opt-in form (landing page). Built by holiday-popup/build.py. -->\n"
            f"{FONTS}\n{cfg('holiday-guide-lp', endpoint, next_url)}\n{shared}\n{markup}\n")


def main():
    (R / 'dist').mkdir(exist_ok=True)
    (R / 'dist/ghl-popup.html').write_text(popup_block('holiday-popup'))
    (R / 'dist/ghl-landing-form.html').write_text(landing_block())
    liquid = ("{%- comment -%} Zeotein holiday guide pop-up, Shopify build. PARKED: Dana scoped the pop-up to the GHL holiday guide "
              "landing page (Nov 11). Not rendered anywhere in the theme. Built by holiday-popup/build.py. {%- endcomment -%}\n"
              + popup_block('holiday-popup-store', cover="{{ 'zt-holiday-guide-cover.webp' | asset_url }}"))
    (R / 'snippet/zt-holiday-popup.liquid').write_text(liquid)
    # local QA page: landing-page context with both the inline form and the pop-up, mock relay
    page = (R / 'qa/lp_mock.html').read_text()
    page = page.replace('<!--LANDING_FORM-->', landing_block(endpoint='/mock')).replace('<!--POPUP-->', popup_block('holiday-popup', endpoint='/mock', cover='../assets/zt-holiday-guide-cover-hd.webp'))
    (R / 'qa/preview-lp.html').write_text(page)
    print('built', *[p.name for p in (R / 'dist').iterdir()])


if __name__ == '__main__':
    main()
