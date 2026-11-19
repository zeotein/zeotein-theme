# Never-bought price-lock emails (Jewels' version): $76.99 first order, renewal locked at $84.99 if they start within 5 days, $89.99 after.
# Layout reuses the live win-back design (src/wb1.html) so the look matches; copy is new for people who have never ordered.
import pathlib, re
root = pathlib.Path(__file__).resolve().parent
base = (root.parent / 'emails' / 'src' / 'wb1.html').read_text()
head = base[:base.index('<body')]
foot_start = base.index('<tr><td style="padding:0;font-size:0;line-height:0;"><img alt="" src="https://cdn.shopify.com/s/files/1/0775/5458/1717/files/zeo-wb-foot.jpg')
foot = base[foot_start:]
KIT = "https://cdn.shopify.com/s/files/1/0775/5458/1717/files/zeo-wb-kit-a3.jpg?v=1793920324"
CAL = "https://cdn.shopify.com/s/files/1/0775/5458/1717/files/zeo-wb-i-calendar-loop.png?v=1793920098"
CACAO = "https://cdn.shopify.com/s/files/1/0775/5458/1717/files/zeo-wb-i-cacao.png?v=1793920098"
LINK = "https://zeotein.com/products/zeotein-cacao-bag-30-intro?variant=54443603493077&amp;selling_plan=4835770581"
P = "font-family:Inter,'Segoe UI',Helvetica,Arial,sans-serif;"
H = "font-family:Poppins,'Segoe UI',Helvetica,Arial,sans-serif;"
ROW = '<tr><td align="center" bgcolor="#f7f2fc" class="pad" style="background-color:#f7f2fc;padding:0 48px;">{}</td></tr>'
def para(t): return ROW.format(f'<p style="margin:0 0 18px;{P}font-size:17px;line-height:1.7;color:#2a2440;">{t}</p>')
def big(t): return ROW.format(f'<p class="h" style="margin:6px 0 24px;{H}font-weight:800;font-size:28px;line-height:1.25;color:#4b1d6b;">{t}</p>')
def img(src, alt): return f'<tr><td style="padding:0;font-size:0;line-height:0;"><img alt="{alt}" src="{src}" style="display:block;width:100%;max-width:600px;height:auto;border:0;" width="600"/></td></tr>'
def kitcard(t): return ROW.format(f'<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:6px 0 26px;" width="100%"><tr><td align="center" bgcolor="#3a1557" style="background-color:#3a1557;background-image:linear-gradient(150deg,#5a2484 0%,#3a1557 55%,#1e6f78 100%);border-radius:28px;padding:34px 30px 36px;"><div style="width:56px;height:6px;border-radius:3px;background-color:#32bac0;margin:0 auto 18px;font-size:0;line-height:0;">&nbsp;</div><p style="margin:0;{H}font-weight:600;font-size:20px;line-height:1.5;color:#ffffff;">{t}</p></td></tr></table>')
def lockcard(label, title, line):
    return ROW.format(f'<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:4px 0 22px;" width="100%"><tr><td bgcolor="#ffffff" style="background-color:#ffffff;border-radius:26px;border:3px solid #32bac0;padding:22px 24px;text-align:center;"><div style="{H}font-weight:800;font-size:12px;letter-spacing:0.14em;color:#17797f;">{label}</div><div style="{H}font-weight:800;font-size:30px;line-height:1.2;color:#4b1d6b;margin:6px 0 4px;">$84.99 a month <span style="font-weight:600;font-size:20px;color:#8a7fa0;text-decoration:line-through;">$89.99</span></div><div style="{H}font-weight:700;font-size:18px;line-height:1.35;color:#4b1d6b;margin:0 0 10px;">{title}</div><div style="{P}font-size:16px;line-height:1.6;color:#2a2440;">{line}</div></td></tr></table>') + \
      '\n<!-- DF-TIMER-ROW: replace the src below with the Deadline Funnel email timer image URL -->\n' + \
      f'<tr><td align="center" bgcolor="#f7f2fc" class="pad" style="background-color:#f7f2fc;padding:0 48px 22px;"><img alt="Time left on your price lock" class="df-timer" src="DF_TIMER_IMAGE_URL" style="display:block;width:100%;max-width:504px;height:auto;border:0;" width="504"/></td></tr>\n'
def button(t): return ROW.format(f'<table align="center" border="0" cellpadding="0" cellspacing="0" class="btn" role="presentation" style="margin:4px auto 28px;"><tr><td align="center" bgcolor="#32bac0" style="background-color:#32bac0;border-radius:40px;box-shadow:0 6px 0 #23898e;"><!-- DF-LINK: replace href with the Deadline Funnel tracking link that wraps this URL --><a href="{LINK}" style="display:inline-block;padding:19px 36px;{H}font-weight:800;font-size:16px;letter-spacing:0.04em;color:#1c0930;text-decoration:none;" target="_blank">{t} &rarr;</a></td></tr></table>')
def iconcard(src, t): return ROW.format(f'<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:4px 0 24px;" width="100%"><tr><td bgcolor="#ffffff" style="background-color:#ffffff;border-radius:26px;border:2px solid #e8dcf4;padding:20px 22px;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tr><td style="width:96px;padding-right:16px;" valign="middle" width="96"><img alt="" src="{src}" style="display:block;width:96px;height:auto;border:0;" width="96"/></td><td style="{P}font-size:17px;line-height:1.65;color:#2a2440;text-align:left;" valign="middle">{t}</td></tr></table></td></tr></table>')
greet = '<tr><td align="center" bgcolor="#f7f2fc" class="pad" style="background-color:#f7f2fc;padding:30px 48px 0;"><p style="margin:0 0 16px;' + H + 'font-weight:700;font-size:20px;color:#4b1d6b;">Hi {{contact.first_name}},</p></td></tr>'
def sign(ps): return ROW.format(f'<p style="margin:4px 0 4px;{P}font-size:17px;color:#2a2440;">Thanks,</p><p style="margin:0 0 22px;{H}font-weight:800;font-size:20px;line-height:1.35;color:#4b1d6b;">Dana<br/>Team Zeotein</p>') + ROW.format(f'<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 30px;" width="100%"><tr><td bgcolor="#ffffff" style="background-color:#ffffff;border-radius:18px;padding:16px 22px;{P}font-size:15px;line-height:1.6;color:#5a5270;">{ps}</td></tr></table>')
def page(title, rows):
    h = head.replace(re.search(r'<title>.*?</title>', head).group(0), f'<title>{title}</title>')
    return h + '<body style="margin:0;padding:0;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tr><td align="center" style="padding:0;"><table bgcolor="#ece4f4" border="0" cellpadding="0" cellspacing="0" class="w" role="presentation" style="width:600px;max-width:600px;background-color:#ece4f4;" width="600">' + ''.join(rows) + foot
KITLINE = "Your first subscription order is the full Starter Kit for $76.99: a 30-day bag of Zeotein Cacao, a shaker, a Save-A-Scoop and all three guides."
emails = {
 'nb1': dict(subject='Your Zeotein Starter Kit, $76.99 to start', preview='Start in the next 5 days and lock in $84.99 a month.', rows=[
   img(KIT, 'The Zeotein Starter Kit: a 30-day bag of Zeotein Cacao, a shaker, a Save-A-Scoop and all three guides'), greet,
   para("You've been curious about Zeotein Cacao. Here's the easiest way to start."),
   big("23 grams of protein. Six ingredients. Thirty seconds in a shaker."),
   kitcard(KITLINE),
   lockcard('5 DAYS ONLY', 'Your price lock', 'Start in the next 5 days and every bag after your first is $84.99 instead of $89.99. The timer below is yours.'),
   button('LOCK IN $84.99 A MONTH'),
   iconcard(CAL, 'You run your subscription from your Zeotein account. Skip, reschedule or cancel any time.'),
   sign('P.S. Two scoops of Zeotein Cacao, cold milk, shake. That is 23 grams of protein in about thirty seconds.')]),
 'nb2': dict(subject='Thirty seconds, 23 grams of protein', preview='Your $84.99 price lock is still open.', rows=[
   img(KIT, 'The Zeotein Starter Kit'), greet,
   big("Thirty seconds. 23 grams of protein. Six ingredients you can read."),
   para("That's Zeotein Cacao: grass-fed bone broth protein, grass-fed collagen peptides, organic fermented cacao, organic MCT, organic sea moss and zeolite. Zero added sugar."),
   iconcard(CACAO, "The cacao is raw and fermented, and it's never alkalized. So what's in your glass is cacao doing what cacao does."),
   lockcard('STILL OPEN', 'Your price lock is still waiting', 'Start your Starter Kit for $76.99 while your timer is running and every bag after is $84.99.'),
   button('LOCK IN $84.99 A MONTH'),
   sign('P.S. Need more time with a bag? Skip or reschedule a delivery from your account whenever you like.')]),
 'nb3': dict(subject='Your $84.99 price lock ends tomorrow', preview="After that, it's $89.99 a month.", rows=[
   img(KIT, 'The Zeotein Starter Kit'), greet,
   para("This is my last note on your price lock."),
   kitcard(KITLINE),
   lockcard('LAST DAY', 'Your price lock ends tomorrow', 'After the timer runs out, the Starter Kit is still $76.99 to start, and each bag after renews at $89.99.'),
   button('LOCK IN MY PRICE'),
   iconcard(CAL, 'Skip, reschedule or cancel your subscription from your account any time.'),
   sign('P.S. Questions before you start? Write to us at hello@zeotein.com.')]),
}
for k, e in emails.items():
    html = page(e['subject'], e['rows'])
    bad = [w for w in ('—', 'complete protein', 'Complete protein', '{{contact.first_name |') if w in html]
    assert not bad, (k, bad)
    (root / 'out' / f'{k}.html').write_text(html)
    print(k, len(html), e['subject'], '|', e['preview'])
