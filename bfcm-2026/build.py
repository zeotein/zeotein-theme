#!/usr/bin/env python3
"""Build the BFCM 2026 + holiday guide email drafts (email-safe HTML) and the review page.

Outputs
  emails/<ID>.html   paste-ready HTML for GoHighLevel (real hosted image URLs)
  sms.json           SMS copy
  review/index.html  review page for Dana (images embedded as data URIs)

Nothing here touches GoHighLevel or Shopify. Run: python3 build.py
"""
import base64, hashlib, html, io, json, os, re, urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(ROOT, ".imgcache")

# ---------- links ----------
LP = "https://try.zeotein.com/products/30-day-cacao-bulk-bag-black-friday"   # BF Starter Kit landing page (product.cacao-lp-bf)
SALE = "https://zeotein.com/collections/bfcm-storewide-sale"                  # 30% sale collection (NOT live yet, see findings)
ACCOUNT = "https://zeotein.com/a/subscriptions/login"
GUIDE_PDF = "https://files.leadconnectorhq.com/file/6af8cdac893246071f81ddbf/zeotein-holiday-recipe-guide-nov-2026-added-recipes.pdf"

# ---------- images (all already hosted by Zeotein; no people in any of them) ----------
SH = "https://cdn.shopify.com/s/files/1/0775/5458/1717/files/"
FS = "https://assets.cdn.filesafe.space/Kch9YmRfzpmQrAs5Bchz/media/"
IMG = {
    "logo_white": SH + "zeotein_logo_white.png",
    "bag_black": FS + "6a7eedcecf50f900f2e1de0d.png",        # Cacao bag + cacao beans + scoop, black background
    "kit_black": FS + "6a816a69fe4291bd101861eb.png",        # shaker, Save-A-Scoop, 3 guides, black background
    "bagstick_black": FS + "6a7eedbf6bcf2e22ae95d717.png",   # bag + stick pack, black background
    "flatlay": SH + "Overhead_flat_lay_of_Zeotein_b_Nano_Banana_2_08845_c8143f4c-aaba-4af4-b145-0cf2fe5dec4c.png?v=1790760132&width=1200",
    "kitchen": SH + "Zeotein_bulk_protein_bag_open__Nano_Banana_2_95201_0b8d30da-b70f-43d3-b928-06b1cb7e76ee.png?v=1790760131&width=1200",
    "cacao_sticks30": SH + "zeotein-cacao-30-stick-packs-BADGED_d17cd889-315d-46a5-8308-1af7e15edd8d.png?v=1792154253&width=600",
    "cacao_sticks7": SH + "zeotein-cacao-7-stick-packs-BADGED_05154890-4fbb-444e-b445-ab3d902ead6c.png?v=1792154253&width=600",
    "vegan_sticks7": SH + "zeotein-vegan-7-stick-packs-BADGED_2f656e06-3b1e-4858-a5d2-fceda17390e9.png?v=1792154254&width=600",
    "shaker": SH + "zeotein-cleanblend-shaker-bottle-black-27oz.png?v=1791444108&width=600",
    "scoop": SH + "zeotein-save-a-scoop-protein-powder-scoop.png?v=1791447033&width=600",
    "cacao_bag": SH + "zeotein-cacao-bulk-bag-BADGED_1f1ad9f1-3eed-43bf-ad8f-3466c8b9ef9f.png?v=1792154253&width=600",
}

# ---------- tokens ----------
INK, PANEL, PANEL2 = "#0A0A0C", "#16121D", "#1F1A29"
PURPLE, TEAL, WHITE, MUTE = "#5F2D90", "#32BAC0", "#FFFFFF", "#A9A4B5"
HEAD = "Poppins,'Segoe UI',Helvetica,Arial,sans-serif"
BODY = "Inter,'Segoe UI',Helvetica,Arial,sans-serif"
DISC = ("These statements have not been evaluated by the Food and Drug Administration. "
        "This product is not intended to diagnose, treat, cure, or prevent any disease.")


def esc(s):
    return html.escape(s, quote=False)


# ---------- building blocks (table rows inside a 600px container) ----------
def topbar(text, bg=TEAL, fg=INK):
    return (f'<tr><td bgcolor="{bg}" style="background:{bg};padding:11px 20px;text-align:center;">'
            f'<p style="margin:0;font-family:{BODY};font-size:12px;font-weight:700;letter-spacing:0.14em;'
            f'text-transform:uppercase;color:{fg};">{text}</p></td></tr>')


def logo(bg=INK):
    return (f'<tr><td bgcolor="{bg}" style="background:{bg};padding:26px 20px 6px;text-align:center;">'
            f'<img src="{IMG["logo_white"]}" width="150" alt="Zeotein" style="width:150px;margin:0 auto;"></td></tr>')


def hero_big(eyebrow, big, sub, price_line=None, bg=INK):
    price = ""
    if price_line:
        price = (f'<table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:18px auto 0;">'
                 f'<tr><td bgcolor="{TEAL}" style="background:{TEAL};border-radius:999px;padding:10px 22px;">'
                 f'<p style="margin:0;font-family:{HEAD};font-size:18px;font-weight:700;color:{INK};">{price_line}</p>'
                 f'</td></tr></table>')
    return (f'<tr><td bgcolor="{bg}" class="pad" style="background:{bg};padding:22px 40px 8px;text-align:center;">'
            f'<p style="margin:0 0 10px;font-family:{BODY};font-size:13px;font-weight:700;letter-spacing:0.2em;'
            f'text-transform:uppercase;color:{TEAL};">{eyebrow}</p>'
            f'<p class="big" style="margin:0;font-family:{HEAD};font-size:92px;line-height:0.95;font-weight:800;'
            f'letter-spacing:-0.02em;color:{WHITE};">{big}</p>'
            f'<p class="h" style="margin:10px 0 0;font-family:{HEAD};font-size:28px;line-height:1.2;font-weight:700;color:{WHITE};">{sub}</p>'
            f'{price}</td></tr>')


def image(key, alt, bg=INK, pad="18px 30px 0", width=540, link=None):
    tag = f'<img src="{IMG[key]}" width="{width}" alt="{esc(alt)}" style="width:100%;max-width:{width}px;margin:0 auto;">'
    if link:
        tag = f'<a href="{link}" target="_blank">{tag}</a>'
    return f'<tr><td bgcolor="{bg}" style="background:{bg};padding:{pad};text-align:center;">{tag}</td></tr>'


def button(label, href, bg=INK, btn=TEAL, fg=INK, pad="22px 40px 6px"):
    return (f'<tr><td bgcolor="{bg}" class="pad" style="background:{bg};padding:{pad};text-align:center;">'
            f'<table role="presentation" class="btn" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto;">'
            f'<tr><td bgcolor="{btn}" style="background:{btn};border-radius:10px;">'
            f'<a href="{href}" target="_blank" style="display:inline-block;padding:17px 34px;font-family:{HEAD};font-size:18px;'
            f'font-weight:700;color:{fg};text-decoration:none;">{label}</a></td></tr></table></td></tr>')


def small(text, bg=INK, color=MUTE, pad="10px 40px 0", align="center", size=13):
    return (f'<tr><td bgcolor="{bg}" class="pad" style="background:{bg};padding:{pad};text-align:{align};">'
            f'<p style="margin:0;font-family:{BODY};font-size:{size}px;line-height:1.6;color:{color};">{text}</p></td></tr>')


def body(paras, bg=INK, color="#E9E6EF", pad="26px 44px 4px"):
    ps = "".join(f'<p style="margin:0 0 14px;font-family:{BODY};font-size:16px;line-height:1.65;color:{color};">{p}</p>' for p in paras)
    return f'<tr><td bgcolor="{bg}" class="pad" style="background:{bg};padding:{pad};">{ps}</td></tr>'


def heading(text, bg=INK, color=WHITE, pad="34px 40px 6px", size=26, eyebrow=None, eb_color=TEAL):
    eb = (f'<p style="margin:0 0 8px;font-family:{BODY};font-size:12px;font-weight:700;letter-spacing:0.18em;'
          f'text-transform:uppercase;color:{eb_color};">{eyebrow}</p>') if eyebrow else ""
    return (f'<tr><td bgcolor="{bg}" class="pad" style="background:{bg};padding:{pad};text-align:center;">{eb}'
            f'<p class="h" style="margin:0;font-family:{HEAD};font-size:{size}px;line-height:1.2;font-weight:700;color:{color};">{text}</p></td></tr>')


def kit_box(title="Everything in your Zeotein Cacao Starter Kit"):
    items = [("30-day bag of Zeotein Cacao", "30 servings, 23g protein each", "$68.99"),
             ("CleanBlend Shaker, 27 oz", "Black, BPA free", "FREE"),
             ("Save-A-Scoop", "Keeps the scoop out of the powder", "FREE"),
             ("Zeotein Starter Guide", "Digital, emailed after you order", "FREE"),
             ("Cacao + Vegan recipe guides", "Digital, emailed after you order", "FREE")]
    rows = ""
    for i, (name, note, tag) in enumerate(items):
        top = "" if i == 0 else f"border-top:1px solid #2C2538;"
        pill_bg = TEAL if tag == "FREE" else WHITE
        rows += (f'<tr><td style="{top}padding:14px 0 14px 4px;width:28px;vertical-align:top;font-family:{HEAD};font-size:18px;color:{TEAL};">&#10003;</td>'
                 f'<td style="{top}padding:14px 8px;vertical-align:top;">'
                 f'<p style="margin:0;font-family:{HEAD};font-size:16px;font-weight:600;color:{WHITE};">{name}</p>'
                 f'<p style="margin:2px 0 0;font-family:{BODY};font-size:13px;color:{MUTE};">{note}</p></td>'
                 f'<td align="right" style="{top}padding:14px 4px 14px 0;vertical-align:top;white-space:nowrap;">'
                 f'<span style="display:inline-block;background:{pill_bg};color:{INK};border-radius:6px;padding:4px 10px;'
                 f'font-family:{BODY};font-size:12px;font-weight:800;letter-spacing:0.06em;">{tag}</span></td></tr>')
    return (heading(title, bg=PANEL, eyebrow="What you get", pad="34px 34px 4px", size=24)
            + image("kit_black", "Zeotein CleanBlend shaker, Save-A-Scoop and the Starter, Cacao and Vegan guides", bg=PANEL, pad="16px 34px 0", width=500)
            + f'<tr><td bgcolor="{PANEL}" class="pad" style="background:{PANEL};padding:14px 34px 30px;">'
              f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0">{rows}</table></td></tr>')


def guarantee(bg=PANEL2):
    badge = (f'<table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>'
             f'<td width="96" height="96" align="center" valign="middle" bgcolor="{INK}" '
             f'style="width:96px;height:96px;border-radius:50%;border:3px solid {TEAL};background:{INK};text-align:center;">'
             f'<p style="margin:0;font-family:{HEAD};font-size:30px;line-height:1;font-weight:800;color:{WHITE};">30</p>'
             f'<p style="margin:2px 0 0;font-family:{BODY};font-size:10px;font-weight:700;letter-spacing:0.14em;color:{TEAL};">DAY</p>'
             f'</td></tr></table>')
    return (f'<tr><td bgcolor="{bg}" class="pad" style="background:{bg};padding:30px 34px;">'
            f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>'
            f'<td class="stack" width="120" valign="middle" style="width:120px;vertical-align:middle;">{badge}</td>'
            f'<td class="stack" valign="middle" style="vertical-align:middle;padding-left:10px;">'
            f'<p style="margin:0 0 6px;font-family:{BODY};font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:{TEAL};">Zero risk</p>'
            f'<p style="margin:0 0 6px;font-family:{HEAD};font-size:21px;line-height:1.25;font-weight:700;color:{WHITE};">30-Day Money-Back Guarantee</p>'
            f'<p style="margin:0;font-family:{BODY};font-size:15px;line-height:1.6;color:#D7D2E0;">Drink your first bag. If it is not for you within 30 days of delivery, we will refund it.</p>'
            f'</td></tr></table></td></tr>')


def trust_row(bg=INK):
    cells = [("Ships in 1 to 2", "business days"), ("Skip or cancel", "anytime"), ("4.9 / 5", "155 reviews")]
    tds = "".join(f'<td class="stack3" width="33%" align="center" style="width:33%;padding:6px;text-align:center;">'
                  f'<p style="margin:0;font-family:{HEAD};font-size:15px;font-weight:700;color:{WHITE};">{a}</p>'
                  f'<p style="margin:2px 0 0;font-family:{BODY};font-size:12px;color:{MUTE};">{b}</p></td>' for a, b in cells)
    return (f'<tr><td bgcolor="{bg}" style="background:{bg};padding:22px 24px 4px;">'
            f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>{tds}</tr></table></td></tr>')


def reviews(bg=INK):
    q = [("I absolutely love this product. The taste and ingredients are amazing.", "Mary S."),
         ("Great taste and mixes very well.", "Josh M.")]
    tds = "".join(f'<td class="stack" width="50%" valign="top" style="width:50%;padding:6px;">'
                  f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td bgcolor="{PANEL}" '
                  f'style="background:{PANEL};border-radius:12px;padding:18px;">'
                  f'<p style="margin:0 0 8px;font-size:15px;letter-spacing:2px;color:{TEAL};">&#9733;&#9733;&#9733;&#9733;&#9733;</p>'
                  f'<p style="margin:0 0 10px;font-family:{BODY};font-size:15px;line-height:1.55;color:{WHITE};">"{t}"</p>'
                  f'<p style="margin:0;font-family:{BODY};font-size:12px;color:{MUTE};">{n} &middot; Verified buyer</p>'
                  f'</td></tr></table></td>' for t, n in q)
    return (heading("4.9 out of 5 from 155 reviews", bg=bg, size=20, pad="30px 40px 8px")
            + f'<tr><td bgcolor="{bg}" style="background:{bg};padding:4px 28px 10px;"><table role="presentation" width="100%" '
              f'cellpadding="0" cellspacing="0"><tr>{tds}</tr></table></td></tr>')


def tiles(items, bg=PANEL, title=None, eyebrow=None, cta=None):
    tds = ""
    for key, name, note in items:
        tds += (f'<td class="stack2" width="25%" valign="top" style="width:25%;padding:6px;">'
                f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td bgcolor="#FFFFFF" '
                f'style="background:#FFFFFF;border-radius:12px;padding:10px;text-align:center;">'
                f'<img src="{IMG[key]}" width="110" alt="{esc(name)}" style="width:100%;max-width:110px;margin:0 auto;"></td></tr></table>'
                f'<p style="margin:8px 0 0;font-family:{HEAD};font-size:13px;line-height:1.3;font-weight:600;color:{WHITE};text-align:center;">{name}</p>'
                f'<p style="margin:2px 0 0;font-family:{BODY};font-size:12px;color:{TEAL};text-align:center;font-weight:700;">{note}</p></td>')
    out = heading(title, bg=bg, eyebrow=eyebrow, size=24, pad="32px 34px 10px") if title else ""
    out += (f'<tr><td bgcolor="{bg}" style="background:{bg};padding:8px 24px 6px;"><table role="presentation" width="100%" '
            f'cellpadding="0" cellspacing="0"><tr>{tds}</tr></table></td></tr>')
    if cta:
        out += button(cta[0], cta[1], bg=bg, pad="16px 40px 30px")
    return out


def kit_promo(bg=PANEL, title="60% off your Zeotein Cacao Starter Kit"):
    """Compact Starter Kit block used inside the 30% and subscriber emails."""
    return (f'<tr><td bgcolor="{bg}" class="pad" style="background:{bg};padding:30px 30px;">'
            f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>'
            f'<td class="stack" width="46%" valign="middle" style="width:46%;"><img src="{IMG["bag_black"]}" width="240" '
            f'alt="Zeotein Cacao 30-day bag" style="width:100%;max-width:240px;border-radius:10px;"></td>'
            f'<td class="stack" valign="middle" style="padding-left:18px;vertical-align:middle;">'
            f'<p style="margin:0 0 6px;font-family:{BODY};font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:{TEAL};">Black Friday</p>'
            f'<p style="margin:0 0 8px;font-family:{HEAD};font-size:22px;line-height:1.2;font-weight:700;color:{WHITE};">{title}</p>'
            f'<p style="margin:0 0 14px;font-family:{BODY};font-size:14px;line-height:1.55;color:#D7D2E0;">$68.99 for the 30-day bag, a free shaker, a free Save-A-Scoop and all three guides.</p>'
            f'<a href="{LP}" target="_blank" style="font-family:{HEAD};font-size:15px;font-weight:700;color:{TEAL};text-decoration:none;">Get my Starter Kit &rarr;</a>'
            f'</td></tr></table></td></tr>')


def sale_block(bg=PANEL2, ends="through Monday, Nov 30"):
    return (heading("30% off one-time orders, sitewide", bg=bg, eyebrow="Shopping for something else?", size=22, pad="30px 34px 4px")
            + small(f"Stick packs, Zeotein Vegan, the shaker and single ingredients like collagen, sea moss and MCT, {ends}. "
                    "It comes off at checkout. No code.", bg=bg, color="#D7D2E0", pad="8px 44px 0", size=15)
            + button("Shop 30% off", SALE, bg=bg, btn=WHITE, pad="18px 40px 30px"))


def fine_print(lines, bg=INK):
    t = "<br>".join(lines)
    return small(t, bg=bg, color="#8C8699", pad="22px 44px 8px", size=12)


def footer(bg=INK, fg="#8C8699"):
    return (f'<tr><td bgcolor="{bg}" class="pad" style="background:{bg};padding:18px 40px 34px;text-align:center;border-top:1px solid #221C2C;">'
            f'<p style="margin:0 0 6px;font-family:{BODY};font-size:12px;line-height:1.7;color:{fg};">Questions? Just reply, or email hello@zeotein.com</p>'
            f'<p style="margin:0 0 6px;font-family:{BODY};font-size:12px;line-height:1.7;color:{fg};">Zeotein LLC &middot; 4752 Silver Creek Rd, Manitowoc, WI 54220</p>'
            f'<p style="margin:0 0 10px;font-family:{BODY};font-size:12px;line-height:1.7;color:{fg};">'
            f'<a href="{{{{email.unsubscribe_link}}}}" style="color:{fg};text-decoration:underline;">Unsubscribe</a></p>'
            f'<p style="margin:0;font-family:{BODY};font-size:11px;line-height:1.6;color:#6F6A7C;">{DISC}</p></td></tr>')


def signoff(bg=INK, color="#E9E6EF"):
    return (f'<tr><td bgcolor="{bg}" class="pad" style="background:{bg};padding:6px 44px 10px;">'
            f'<p style="margin:0;font-family:{BODY};font-size:16px;line-height:1.6;color:{color};">Dana<br>'
            f'<span style="font-size:13px;color:{MUTE};">Founder, Zeotein</span></p></td></tr>')


def doc(title, preheader, rows, outer="#000000"):
    css = ("body{margin:0;padding:0}img{border:0;display:block;height:auto}a{color:inherit}"
           "@media only screen and (max-width:620px){.w{width:100%!important}.pad{padding-left:22px!important;padding-right:22px!important}"
           ".big{font-size:68px!important}.h{font-size:23px!important}.btn{width:100%!important}.btn a{display:block!important;text-align:center!important}"
           ".stack{display:block!important;width:100%!important;padding-left:0!important;padding-right:0!important;text-align:center!important}"
           ".stack img{margin:0 auto 14px!important}.stack2{display:inline-block!important;width:46%!important}}")
    return (f'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<meta name="color-scheme" content="light only"><title>{esc(title)}</title>'
            f'<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">'
            f'<style>{css}</style></head><body style="margin:0;padding:0;background:{outer};">'
            f'<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">{esc(preheader)} &#8204; &#8204; &#8204; &#8204;</div>'
            f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{outer};"><tr><td align="center" style="padding:0;">'
            f'<table role="presentation" class="w" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;">'
            f'{"".join(rows)}</table></td></tr></table></body></html>')


KIT_FINE = ["The Starter Kit is the first box of a Zeotein Cacao subscription. After your first box it renews at $99.99 every 30 days. "
            "Skip, reschedule or cancel anytime from your account.",
            "One Starter Kit per customer. Black Friday pricing ends Monday, Nov 30 at 11:59 PM CT."]

# ---------- emails ----------
EMAILS = []


def add(id_, flow, send, subject, preheader, rows, note="", replaces=""):
    EMAILS.append(dict(id=id_, flow=flow, send=send, subject=subject, preheader=preheader,
                       html=doc(f"{id_} {subject}", preheader, rows), note=note, replaces=replaces))


# BF: New and past one-time buyers (workflow d85f8d1b)
add("BF01", "BF · New and past one-time buyers", "Tue Nov 24, early access",
    "Early access: 60% off your Zeotein Cacao Starter Kit",
    "Black Friday opens Friday. Your Starter Kit is $68.99 today.",
    [topbar("Black Friday early access &middot; ends Mon Nov 30, 11:59 PM CT"), logo(),
     hero_big("You're in early", "60% OFF", "your Zeotein Cacao Starter Kit", "$68.99 for the whole kit"),
     image("bag_black", "Zeotein Cacao 30-day bag with cacao beans and scoop", link=LP),
     button("Get my Starter Kit for $68.99", LP),
     small("Bag, shaker, scoop and three guides. All in one box."),
     body(["Hi {{contact.first_name}},",
           "Black Friday opens to everyone on Friday. You get in today.",
           "Your Zeotein Cacao Starter Kit is 60% off: $68.99 for a 30-day bag of Zeotein Cacao, plus a free shaker, a free Save-A-Scoop and all three guides.",
           "It is the easiest way to start: one scoop of real protein, ready in about ten seconds with water, milk or coffee."]),
     signoff(), kit_box(), guarantee(), trust_row(), reviews(),
     button("Claim my Starter Kit", LP, pad="18px 40px 10px"), fine_print(KIT_FINE), footer()],
    replaces="BF01 template 6af26b01 (and the [DRAFT Branded] EM3 copy)",
    note="Removed the regular price and every 'first order' line without the product name. No people photos. Every link goes to the Black Friday landing page.")

add("BF03", "BF · New and past one-time buyers", "Fri Nov 27, Black Friday",
    "It's here: 60% off the Zeotein Cacao Starter Kit",
    "$68.99 for the bag, shaker, scoop and guides. Plus 30% off one-time orders.",
    [topbar("Black Friday is live &middot; ends Mon Nov 30, 11:59 PM CT"), logo(),
     hero_big("Black Friday", "60% OFF", "the Zeotein Cacao Starter Kit", "Only $68.99"),
     image("flatlay", "Zeotein Cacao bag with scoops and ingredients", pad="22px 30px 0", link=LP),
     button("Get my Starter Kit for $68.99", LP),
     body(["Hi {{contact.first_name}},",
           "Black Friday is live, and the Zeotein Cacao Starter Kit is 60% off.",
           "$68.99 gets you everything you need for your first 30 days: the bag, the shaker, the Save-A-Scoop and all three guides."]),
     signoff(), kit_box(), guarantee(), sale_block(), reviews(),
     button("Get my Starter Kit", LP, pad="18px 40px 10px"),
     fine_print(KIT_FINE + ["30% off applies to one-time orders. Excludes subscriptions, gift cards, Starter Kits and Black Friday bundles."]),
     footer()],
    replaces="BF03 template 6af30520",
    note="Headline names the product. Regular price removed. Second offer (30% sitewide) sits below the kit, not competing with it.")

add("BF04", "BF · New and past one-time buyers", "Sat Nov 28",
    "30% off one-time orders, sitewide",
    "Stick packs, Zeotein Vegan, the shaker and single ingredients. Through Monday.",
    [topbar("Black Friday weekend &middot; through Mon Nov 30"), logo(),
     hero_big("Black Friday weekend", "30% OFF", "one-time orders, sitewide"),
     tiles([("cacao_sticks30", "Cacao stick packs", "30% off"), ("vegan_sticks7", "Vegan 7-Day", "30% off"),
            ("shaker", "CleanBlend Shaker", "30% off"), ("scoop", "Save-A-Scoop", "30% off")], bg=INK),
     button("Shop 30% off", SALE),
     body(["Hi {{contact.first_name}},",
           "Not every Zeotein order is a protein order. This weekend, one-time orders are 30% off: stick packs, Zeotein Vegan, the shaker and single ingredients like collagen, sea moss and MCT.",
           "It comes off at checkout. No code, no minimum."]),
     signoff(), kit_promo(), guarantee(), fine_print(
         ["30% off applies to one-time orders. Excludes subscriptions, gift cards, Starter Kits and Black Friday bundles. Ends Monday, Nov 30 at 11:59 PM CT."]
         + KIT_FINE[:1]), footer()],
    replaces="BF04 template 6af7a011",
    note="'Everything' changed to 'sitewide' with the exclusions stated, because the 30% does not cover every product. Starter Kit block links to the landing page.")

add("BF05", "BF · New and past one-time buyers", "Sun Nov 29",
    "Ends tomorrow: 60% off your Zeotein Cacao Starter Kit",
    "One more day for $68.99 Starter Kits and 30% off one-time orders.",
    [topbar("Ends tomorrow &middot; Mon Nov 30, 11:59 PM CT"), logo(),
     hero_big("One more day", "60% OFF", "your Zeotein Cacao Starter Kit", "$68.99 until tomorrow night"),
     image("bag_black", "Zeotein Cacao 30-day bag", link=LP),
     button("Get my Starter Kit for $68.99", LP),
     body(["Hi {{contact.first_name}},",
           "Tomorrow is the last day. Your Zeotein Cacao Starter Kit is still 60% off: $68.99 for the 30-day bag, a free shaker, a free Save-A-Scoop and all three guides."]),
     signoff(), kit_box(), guarantee(), sale_block(ends="through tomorrow night"),
     fine_print(KIT_FINE + ["30% off applies to one-time orders. Excludes subscriptions, gift cards, Starter Kits and Black Friday bundles."]),
     footer()],
    replaces="BF05 template 6af30533")

add("BF06", "BF · New and past one-time buyers", "Mon Nov 30, last day",
    "Last day: 60% off the Zeotein Cacao Starter Kit",
    "Ends tonight at 11:59 PM CT.",
    [topbar("Cyber Monday &middot; ends tonight 11:59 PM CT", bg=WHITE), logo(),
     hero_big("Last day", "60% OFF", "the Zeotein Cacao Starter Kit", "$68.99 ends tonight"),
     image("bagstick_black", "Zeotein Cacao bag and stick pack", link=LP),
     button("Get my Starter Kit for $68.99", LP),
     body(["Hi {{contact.first_name}},",
           "This is the last one. At 11:59 PM CT tonight the Zeotein Cacao Starter Kit goes back to its regular price and the 30% sitewide sale ends."]),
     signoff(), kit_box(), guarantee(), sale_block(ends="until 11:59 PM CT tonight"),
     fine_print(KIT_FINE), footer()],
    replaces="BF06 template 6af30545")

# SBF: Subscribers (workflow 2f95f8b1). Four emails instead of one.
SUBFINE = ["For active Zeotein subscribers. 30% off applies to one-time items only, so your subscription price does not change. "
           "Excludes gift cards, Starter Kits and Black Friday bundles.",
           "Free Vegan 7-Day: spend $75 or more on one-time items after your 30% off, Nov 24 to Nov 30 at 11:59 PM CT. One per order. "
           "It ships in the same box."]


def sub_hero(eyebrow, sub_line):
    return [hero_big(eyebrow, "30% OFF", "one-time orders, just for subscribers"),
            heading(sub_line, size=20, pad="16px 40px 0", color=TEAL)]


add("SBF01", "SBF · Subscribers", "Tue Nov 24, subscriber early access",
    "Subscribers first: 30% off + a free Vegan 7-Day",
    "Black Friday starts early for you. One-time orders are 30% off.",
    [topbar("Subscribers only &middot; Black Friday starts now", bg=PURPLE, fg=WHITE), logo(),
     *sub_hero("Thank you for subscribing", "+ a free Vegan 7-Day when you spend $75"),
     tiles([("cacao_sticks30", "Cacao stick packs", "30% off"), ("cacao_sticks7", "Cacao 7-Day", "30% off"),
            ("shaker", "CleanBlend Shaker", "30% off"), ("scoop", "Save-A-Scoop", "30% off")], bg=INK),
     button("Shop my 30% off", SALE),
     body(["Hi {{contact.first_name}},",
           "You subscribe, so you go first. From today through Monday, Nov 30, every one-time order is 30% off. It comes off at checkout, no code.",
           "Spend $75 or more on one-time items (after your 30% off) and we will add a free Vegan 7-Day to the box.",
           "Your subscription stays exactly as it is."]),
     signoff(),
     heading("Your free Vegan 7-Day", bg=PANEL, eyebrow="Spend $75, it's on us", size=24, pad="32px 34px 4px"),
     image("vegan_sticks7", "Zeotein Vegan 7 stick packs", bg=PANEL, pad="14px 150px 4px", width=300),
     small("Seven stick packs of Zeotein Vegan, organic pumpkin seed and hemp protein. Easy to keep in a bag, a desk or the car.",
           bg=PANEL, color="#D7D2E0", pad="6px 44px 30px", size=15),
     guarantee(),
     small("Want to skip a month or move your next box? <a href=\"" + ACCOUNT + "\" style=\"color:#32BAC0;\">Manage your subscription</a>.",
           pad="22px 44px 0", size=14),
     fine_print(SUBFINE), footer()],
    replaces="SBF01 template 6af7a032 (and 6af26b1c, which uses the people photo)")

add("SBF02", "SBF · Subscribers", "Fri Nov 27, Black Friday",
    "Black Friday is here: your 30% off + free Vegan 7-Day",
    "Both run through Monday at 11:59 PM CT.",
    [topbar("Subscribers only &middot; Black Friday &middot; through Mon Nov 30", bg=PURPLE, fg=WHITE), logo(),
     *sub_hero("Black Friday", "+ a free Vegan 7-Day at $75"),
     image("kitchen", "Zeotein Cacao bag and a cacao shake on a kitchen counter", pad="22px 30px 0", link=SALE),
     button("Shop my 30% off", SALE),
     body(["Hi {{contact.first_name}},",
           "Black Friday is here and both of your offers are on through Monday.",
           "1. 30% off every one-time order. Stick packs for the car, a second shaker, collagen, sea moss, MCT.",
           "2. A free Vegan 7-Day when your one-time items come to $75 or more after the 30%."]),
     signoff(),
     tiles([("cacao_sticks7", "Cacao 7-Day", "30% off"), ("cacao_sticks30", "Cacao stick packs", "30% off"),
            ("shaker", "CleanBlend Shaker", "30% off"), ("scoop", "Save-A-Scoop", "30% off")],
           bg=PANEL, title="Easy add-ons for your next box", eyebrow="30% off", cta=("Build my $75 order", SALE)),
     fine_print(SUBFINE), footer()],
    replaces="SBF02 template 6af7a056")

add("SBF03", "SBF · Subscribers", "Sun Nov 29",
    "Your free Vegan 7-Day is still waiting",
    "Two days left. Spend $75 on one-time items and it ships in your box.",
    [topbar("Subscribers only &middot; 2 days left", bg=PURPLE, fg=WHITE), logo(),
     hero_big("Two days left", "FREE", "Vegan 7-Day with $75 of one-time items"),
     image("vegan_sticks7", "Zeotein Vegan 7 stick packs", pad="22px 150px 0", width=300),
     button("Build my $75 order", SALE),
     body(["Hi {{contact.first_name}},",
           "Two days left. Everything one-time is still 30% off, so $75 goes further than usual.",
           "Get to $75 after the 30% and your free Vegan 7-Day ships in the same box."]),
     signoff(),
     tiles([("cacao_sticks30", "Cacao stick packs", "30% off"), ("cacao_sticks7", "Cacao 7-Day", "30% off"),
            ("shaker", "CleanBlend Shaker", "30% off"), ("scoop", "Save-A-Scoop", "30% off")],
           bg=PANEL, title="Ideas to get to $75", eyebrow="30% off one-time items"),
     fine_print(SUBFINE), footer()],
    replaces="SBF03 template 6af7a078 (6af72868 says 'opposite blend', which conflicts; see findings)")

add("SBF04", "SBF · Subscribers", "Mon Nov 30, last day",
    "Last day: 30% off + your free Vegan 7-Day",
    "Both end tonight at 11:59 PM CT.",
    [topbar("Subscribers only &middot; ends tonight 11:59 PM CT", bg=WHITE, fg=INK), logo(),
     *sub_hero("Last day", "+ free Vegan 7-Day at $75, ends tonight"),
     image("bagstick_black", "Zeotein Cacao bag and stick pack"),
     button("Shop my 30% off", SALE),
     body(["Hi {{contact.first_name}},",
           "Last call. At 11:59 PM CT tonight your 30% off one-time orders and the free Vegan 7-Day both end.",
           "Thank you for being a subscriber. It is the reason we can run a Black Friday like this."]),
     signoff(), fine_print(SUBFINE), footer()],
    replaces="SBF04 template 6af7a0a1")

# Holiday guide (workflow b42fe7e6): seasonal, no Black Friday language.
HB, HP, HT = "#F6F3FA", PURPLE, "#1E1A24"


def hg_doc(rows):
    return rows


add("HG01", "HG · Holiday Guide leads", "Right after opt-in (any date)",
    "Your Holiday Recipe Guide is here",
    "26 cozy drinks and festive treats, made with Zeotein Cacao.",
    [topbar("Free Holiday Recipe Guide", bg=PURPLE, fg=WHITE),
     f'<tr><td bgcolor="{HB}" style="background:{HB};padding:34px 40px 8px;text-align:center;">'
     f'<p style="margin:0 0 10px;font-family:{BODY};font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:{TEAL};">Your guide is here</p>'
     f'<p class="h" style="margin:0;font-family:{HEAD};font-size:34px;line-height:1.15;font-weight:800;color:{HT};">26 holiday recipes, made with Zeotein Cacao</p></td></tr>',
     f'<tr><td bgcolor="{HB}" style="background:{HB};padding:22px 60px 0;text-align:center;">'
     f'<div style="background:{PURPLE};border-radius:14px;padding:44px 20px;color:#fff;font-family:{HEAD};font-size:16px;">'
     f'[Existing guide cover image: holiday-cover-v3.webp]</div></td></tr>',
     button("Download the Holiday Recipe Guide", GUIDE_PDF, bg=HB, btn=PURPLE, fg=WHITE),
     body(["Hi {{contact.first_name}},",
           "Here's your guide: 26 holiday recipes made with Zeotein Cacao, from cozy drinks to festive treats, plus the one habit we lean on all season.",
           "Save it, print it, or pull it up the next time someone asks what to bring. We hope a few of these end up on your table."],
          bg=HB, color=HT),
     signoff(bg=HB, color=HT),
     footer(bg=HB, fg="#6F6A7C")],
    replaces="HG01 template 6af89c93",
    note="Guide only, matching the website pop-up version (HGW01C). Removed the $76.99 offer and the offer.zeotein.com link. Nothing about Black Friday.")

add("HG03", "HG · Holiday Guide leads", "Day 5 after opt-in (any date)",
    "One recipe to make this week",
    "Pick one from your Holiday Recipe Guide. It takes about five minutes.",
    [topbar("From your Holiday Recipe Guide", bg=PURPLE, fg=WHITE),
     f'<tr><td bgcolor="{HB}" style="background:{HB};padding:34px 40px 8px;text-align:center;">'
     f'<p class="h" style="margin:0;font-family:{HEAD};font-size:30px;line-height:1.2;font-weight:800;color:{HT};">One recipe to make this week</p></td></tr>',
     image("flatlay", "Zeotein Cacao with scoops and ingredients on a marble counter", bg=HB, pad="20px 40px 0"),
     body(["Hi {{contact.first_name}},",
           "The busiest weeks of the year are the ones where a five-minute recipe helps most.",
           "Open your Holiday Recipe Guide and pick one thing to make this week. A warm cacao drink on a cold morning is our favorite place to start.",
           "If you make one, reply and tell us which. We read every reply."], bg=HB, color=HT),
     button("Open my Holiday Recipe Guide", GUIDE_PDF, bg=HB, btn=PURPLE, fg=WHITE, pad="8px 40px 20px"),
     signoff(bg=HB, color=HT), footer(bg=HB, fg="#6F6A7C")],
    replaces="HG03 template 6af30504 ('You're on the Black Friday early list')",
    note="Replaces the Black Friday early-list email with a seasonal follow-up that works any day in Nov or Dec. No offer, no dates.")

# ---------- SMS ----------
SMS = [
    dict(flow="BF · New and past one-time buyers", send="Tue Nov 24, 11:00 AM CT",
         text=f"Zeotein: Black Friday early access is open for you. 60% off the Zeotein Cacao Starter Kit: $68.99 for the bag, shaker, scoop + guides. Ends Mon 11/30. {LP} Reply STOP to opt out"),
    dict(flow="BF · New and past one-time buyers", send="Fri Nov 27, 11:00 AM CT",
         text=f"Zeotein: Black Friday is live. 60% off the Zeotein Cacao Starter Kit, just $68.99. Ends Mon 11/30 at 11:59pm CT. {LP} Reply STOP to opt out"),
    dict(flow="BF · New and past one-time buyers", send="Mon Nov 30, 11:00 AM CT",
         text=f"Zeotein: Last day. 60% off the Zeotein Cacao Starter Kit ($68.99) ends tonight at 11:59pm CT. {LP} Reply STOP to opt out"),
    dict(flow="SBF · Subscribers", send="Tue Nov 24, 11:00 AM CT",
         text=f"Zeotein: Thanks for subscribing. Black Friday starts early for you: 30% off one-time orders + a free Vegan 7-Day when you spend $75. Through Mon 11/30. {SALE} Reply STOP to opt out"),
    dict(flow="SBF · Subscribers", send="Fri Nov 27, 11:00 AM CT",
         text=f"Zeotein: Black Friday is here. Your 30% off one-time orders and free Vegan 7-Day at $75 run through Monday. {SALE} Reply STOP to opt out"),
    dict(flow="SBF · Subscribers", send="Mon Nov 30, 11:00 AM CT",
         text=f"Zeotein: Last day for your 30% off one-time orders + free Vegan 7-Day at $75. Ends 11:59pm CT tonight. {SALE} Reply STOP to opt out"),
]

# ---------- checks ----------
BANNED = [("—", "em dash"), ("84.99", "$84.99"), ("new customers only", "new customers only"),
          ("172.97", "regular kit value"), ("76.99", "old/regular price"), ("normally", "regular price wording"),
          ("Free shipping", "free shipping claim (threshold is $130)"), ("detox", "detox"), ("cleanse", "cleanse"),
          ("/products/30-day-cacao-bulk-bag-black-friday\"", None)]


def check():
    problems = []
    for e in EMAILS:
        txt = e["html"] + e["subject"] + e["preheader"]
        for needle, label in BANNED:
            if label and needle.lower() in txt.lower():
                problems.append(f'{e["id"]}: contains {label}')
        if "first order" in txt.lower() and "starter kit" not in txt.lower():
            problems.append(f'{e["id"]}: "first order" without naming the Starter Kit')
        for href in re.findall(r'href="([^"]+)"', e["html"]):
            if "zeotein.com/products/" in href and "try.zeotein.com/products/30-day-cacao-bulk-bag-black-friday" not in href:
                problems.append(f'{e["id"]}: links to a product page {href}')
        if "a8e191bf" in txt:
            problems.append(f'{e["id"]}: uses the people photo')
    for s in SMS:
        for needle, label in BANNED:
            if label and needle.lower() in s["text"].lower():
                problems.append(f'SMS {s["send"]}: contains {label}')
    return problems


# ---------- review page ----------
def fetch(url):
    os.makedirs(CACHE, exist_ok=True)
    p = os.path.join(CACHE, hashlib.md5(url.encode()).hexdigest())
    if not os.path.exists(p):
        with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=60) as r:
            open(p, "wb").write(r.read())
    return open(p, "rb").read()


def data_uri(url):
    from PIL import Image
    im = Image.open(io.BytesIO(fetch(url)))
    im.thumbnail((900, 900))
    buf = io.BytesIO()
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        im.save(buf, "PNG", optimize=True)
        mime = "image/png"
    else:
        im.convert("RGB").save(buf, "JPEG", quality=80)
        mime = "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(buf.getvalue()).decode()


def segments(t):
    gsm = all(ord(c) < 128 for c in t)
    per, single = (153, 160) if gsm else (67, 70)
    n = len(t)
    return 1 if n <= single else -(-n // per)


def main():
    probs = check()
    for e in EMAILS:
        open(os.path.join(ROOT, "emails", e["id"] + ".html"), "w").write(e["html"])
    json.dump(SMS, open(os.path.join(ROOT, "sms.json"), "w"), indent=2)
    uris = {u: data_uri(u) for u in IMG.values()}
    cards = []
    for e in EMAILS:
        h = e["html"]
        for u, d in uris.items():
            h = h.replace(u, d)
        cards.append(dict(id=e["id"], flow=e["flow"], send=e["send"], subject=e["subject"], preheader=e["preheader"],
                          note=e["note"], replaces=e["replaces"], html=h))
    sms = [dict(s, chars=len(s["text"]), segs=segments(s["text"])) for s in SMS]
    tpl = open(os.path.join(ROOT, "review_template.html")).read()
    page = tpl.replace("/*__DATA__*/", "const EMAILS=" + json.dumps(cards) + ";const SMS=" + json.dumps(sms) + ";")
    open(os.path.join(ROOT, "review", "index.html"), "w").write(page)
    print(f"{len(EMAILS)} emails, {len(SMS)} SMS, page {len(page)//1024} KB")
    print("CHECKS:", "clean" if not probs else probs)


if __name__ == "__main__":
    main()
