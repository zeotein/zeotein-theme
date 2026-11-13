import sys, base64, pathlib
K = pathlib.Path(sys.argv[1]); variant = sys.argv[2]
def b64(name): return 'data:image/png;base64,' + base64.b64encode((K / 'trim' / name).read_bytes()).decode()
shaker, scoop = b64('shaker-black.png'), b64('scoop.png')
g1, g2, g3 = b64('g-starter.png'), b64('g-cacao.png'), b64('g-vegan.png')
guides_fan = f'''<div class="fan"><img class="c l" src="{g2}" alt=""><img class="c r" src="{g3}" alt=""><img class="c m" src="{g1}" alt=""></div>'''
items = {
  'shaker': f'<div class="item"><div class="ph"><img class="tall" src="{shaker}" alt=""></div><div class="nm">Shaker</div><div class="pr"><s>$15.99</s><span class="free">FREE</span></div></div>',
  'scoop':  f'<div class="item"><div class="ph"><img class="tall" src="{scoop}" alt=""></div><div class="nm">Save-A-Scoop</div><div class="pr"><s>$6.99</s><span class="free">FREE</span></div></div>',
  'guides': f'<div class="item wide"><div class="ph">{guides_fan}</div><div class="nm">3 digital guides</div><div class="pr"><s>$40</s><span class="free">FREE</span></div></div>',
}
plus = '<div class="plus" aria-hidden="true">+</div>'
if variant == 'bag':
    row = items['shaker'] + plus + items['scoop'] + plus + items['guides']
    fine = 'Shaker with your first subscription order. Save-A-Scoop with your first bag, any purchase. Guides arrive by email. Guarantee covers your first order, one supply per customer.'
else:
    row = items['shaker'] + plus + items['guides']
    fine = 'Shaker with your first subscription order. Guides arrive by email with any first order. Guarantee covers your first order, one supply per customer.'
html = f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&display=block" rel="stylesheet">
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:1200px;height:1200px}}
body{{font-family:Poppins,sans-serif;-webkit-font-smoothing:antialiased}}
.cv{{position:relative;width:1200px;height:1200px;overflow:hidden;padding:62px 64px 0;color:#fff;
  background:radial-gradient(900px 600px at 8% 0%, #7A42B4 0%, rgba(122,66,180,0) 60%), linear-gradient(155deg,#5F2D90 0%,#46207A 48%,#2A1650 100%)}}
.eb{{display:inline-block;background:#FFD84D;color:#2E1748;font-weight:700;font-size:25px;letter-spacing:.09em;text-transform:uppercase;padding:11px 22px 10px;border-radius:999px}}
h1{{margin-top:22px;font-weight:800;font-size:100px;line-height:1.0;letter-spacing:-.025em}}
h1 span{{color:#5FD8DD}}
.card{{position:absolute;left:64px;right:64px;top:392px;height:592px;background:#fff;border-radius:36px;
  box-shadow:0 30px 60px rgba(14,6,30,.35);display:flex;align-items:stretch;justify-content:center;padding:34px 34px 30px}}
.item{{flex:1 1 0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;min-width:0}}
.ph{{flex:1;width:100%;display:flex;align-items:flex-end;justify-content:center;position:relative;padding-bottom:22px}}
.ph::after{{content:"";position:absolute;bottom:14px;left:50%;width:62%;height:22px;transform:translateX(-50%);background:radial-gradient(closest-side, rgba(46,23,72,.22), rgba(46,23,72,0));z-index:0}}
.tall{{position:relative;z-index:1;height:{'330' if variant=='bag' else '360'}px;width:auto;max-width:100%;object-fit:contain}}
.fan{{position:relative;z-index:1;width:{'300' if variant=='bag' else '420'}px;height:{'262' if variant=='bag' else '330'}px}}
.fan .c{{position:absolute;bottom:0;left:50%;height:{'232' if variant=='bag' else '300'}px;width:auto;filter:drop-shadow(0 8px 14px rgba(29,21,48,.18))}}
.fan .m{{transform:translateX(-50%);z-index:3}}
.fan .l{{transform:translateX(-50%) translateX(-{'60' if variant=='bag' else '105'}px) rotate(-9deg);transform-origin:bottom center;z-index:1}}
.fan .r{{transform:translateX(-50%) translateX({'60' if variant=='bag' else '105'}px) rotate(9deg);transform-origin:bottom center;z-index:2}}
.nm{{font-weight:700;font-size:{'36' if variant=='bag' else '42'}px;line-height:1.1;color:#1D1530;text-align:center;letter-spacing:-.01em}}
.pr{{margin-top:12px;display:flex;align-items:center;gap:12px;font-size:{'30' if variant=='bag' else '34'}px}}
.pr s{{color:#8A8299;font-weight:500;text-decoration-thickness:3px}}
.free{{background:#0B7A80;color:#fff;font-weight:800;font-size:{'25' if variant=='bag' else '28'}px;letter-spacing:.06em;padding:6px 16px 5px;border-radius:999px}}
.plus{{position:relative;z-index:5;align-self:center;flex:none;width:58px;height:58px;margin:-70px 6px 0;border-radius:50%;background:#F3EEFA;color:#5F2D90;font-weight:600;font-size:44px;line-height:58px;text-align:center}}
.ft{{position:absolute;left:64px;right:64px;top:1018px}}
.gt{{font-weight:700;font-size:40px;line-height:1.15;letter-spacing:-.01em}}
.gt span{{color:#FFD84D}}
.fine{{margin-top:14px;font-weight:500;font-size:23px;line-height:1.42;color:#DDD1EE;max-width:1040px}}
</style></head><body><div class="cv">
<div class="eb">Free with your first subscription</div>
<h1>Your Zeotein<br><span>Starter Kit</span></h1>
<div class="card">{row}</div>
<div class="ft"><div class="gt">Try it for 30 days. <span>Love it or your money back.</span></div><div class="fine">{fine}</div></div>
</div></body></html>'''
(K / f'kit-{variant}.html').write_text(html)
print('wrote', K / f'kit-{variant}.html', len(html))
