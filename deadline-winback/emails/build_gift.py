# Builds the three gift-version win-back emails from the live WB9001-WB9003 templates.
# Adds a free Vegan 7-Day card, a countdown slot for the Deadline Funnel timer, and marks every button for the DF tracking link.
import pathlib, re, sys
src = pathlib.Path('src'); out = pathlib.Path('out'); out.mkdir(exist_ok=True)
VEG = "https://cdn.shopify.com/s/files/1/0775/5458/1717/files/zeotein-vegan-protein-powder-stick-pack-image.png?v=1791950684"
P = "font-family:Inter,'Segoe UI',Helvetica,Arial,sans-serif;"
H = "font-family:Poppins,'Segoe UI',Helvetica,Arial,sans-serif;"

def gift_card(head, line):
    return f'''<tr><td align="center" bgcolor="#f7f2fc" class="pad" style="background-color:#f7f2fc;padding:0 48px;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:4px 0 22px;" width="100%"><tr><td bgcolor="#ffffff" style="background-color:#ffffff;border-radius:26px;border:3px solid #32bac0;padding:20px 22px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tr><td style="width:128px;padding-right:16px;" valign="middle" width="128"><img alt="Zeotein Vegan stick packs" src="{VEG}" style="display:block;width:128px;height:auto;border:0;border-radius:14px;" width="128"/></td>
<td style="{P}text-align:left;" valign="middle"><div style="{H}font-weight:800;font-size:12px;letter-spacing:0.14em;color:#17797f;">FREE GIFT &middot; 5 DAYS ONLY</div><div style="{H}font-weight:800;font-size:21px;line-height:1.3;color:#4b1d6b;margin:4px 0 8px;">{head}</div><div style="font-size:16px;line-height:1.6;color:#2a2440;">{line}</div></td></tr></table></td></tr></table></td></tr>
<!-- DF-TIMER-ROW: replace the src below with the Deadline Funnel email timer image URL (keep width 600) -->
<tr><td align="center" bgcolor="#f7f2fc" class="pad" style="background-color:#f7f2fc;padding:0 48px 22px;"><img alt="Time left on your free Vegan 7-Day" class="df-timer" src="DF_TIMER_IMAGE_URL" style="display:block;width:100%;max-width:504px;height:auto;border:0;" width="504"/></td></tr>
'''

def build(name, subject, preview, title, head, line, btn, after_marker):
    h = (src / name).read_text()
    h = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', h, count=1)
    # gift card goes right before the first button row
    i = h.find(after_marker)
    assert i > 0, name
    row_start = h.rfind('<tr><td align="center" bgcolor="#f7f2fc"', 0, i)
    h = h[:row_start] + gift_card(head, line) + h[row_start:]
    h = h.replace('START MY SUBSCRIPTION AT $76.99 &rarr;', btn)
    h = h.replace('<a href="https://try.zeotein.com"', '<!-- DF-LINK: replace href with the Deadline Funnel tracking link --><a href="https://try.zeotein.com"')
    assert '—' not in h
    return h

emails = [
 ('wb1.html','gift1.html','Your Starter Kit, plus a free Vegan 7-Day','Yours for the next 5 days.','Your Starter Kit, plus a free Vegan 7-Day',
  'Your free Zeotein Vegan 7-Day','Order your Starter Kit in the next 5 days and we add seven single-serve sticks of our plant-based blend, on us. It shows as $0.00 at checkout. The timer below is yours.',
  'CLAIM MY KIT + FREE 7-DAY &rarr;','START MY SUBSCRIPTION AT $76.99'),
 ('wb2.html','gift2.html','Thirty seconds, 23 grams of protein','Your free Vegan 7-Day is still set aside.','Thirty seconds, 23 grams of protein',
  'Still set aside for you','Your free Zeotein Vegan 7-Day comes with your Starter Kit while your timer is running.',
  'CLAIM MY KIT + FREE 7-DAY &rarr;','START MY SUBSCRIPTION AT $76.99'),
 ('wb3.html','gift3.html','Your free Vegan 7-Day ends tomorrow','Last day for the gift.','Your free Vegan 7-Day ends tomorrow',
  'Last day for your free 7-Day','After the timer runs out, the Starter Kit is still $76.99, without the gift.',
  'CLAIM MY FREE 7-DAY &rarr;','START MY SUBSCRIPTION AT $76.99'),
]
for s,o,subj,pre,title,head,line,btn,marker in emails:
    html = build(s,subj,pre,title,head,line,btn,marker)
    (out/o).write_text(html)
    print(o, len(html), subj, '|', pre)
