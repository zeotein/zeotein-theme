import json, os, hashlib
S = '/tmp/claude-0/-home-user-zeotein-theme/cebad199-acf9-5993-b486-6404c594be45/scratchpad/'
NEW = S + 'pdp/new/'
def R(params): return "{% render 'zt-buybox-tidy', " + params + " %}"
def load(path):
    raw = open(path, encoding='utf-8').read(); i = raw.index('{'); return raw[:i], json.loads(raw[i:])
def save(path, head, t):
    open(path, 'w', encoding='utf-8').write(head + json.dumps(t, indent=2, ensure_ascii=False) + '\n')

# ---- 1) description snippet (theme copy, shown only by the v2 'desc' part)
D = S + 'final/desc/'
snip = ["{%- comment -%}",
        "  Cacao product page copy (v2, Nov 15 2026). Rendered by zt-buybox-tidy part 'desc' on the three listed Cacao products.",
        "  Other products (including Starter Kit funnel products on the same templates) keep their own description.",
        "  Rules: lead with 14g grass-fed collagen peptides, 23g protein; no 'complete protein'; no zeolite; guarantee wording unchanged.",
        "{%- endcomment -%}",
        "{%- case handle -%}"]
for h, f in [('zeotein-cacao-bag-30', 'desc-bag.html'), ('zeotein-cacao-sticks-30', 'desc-sticks.html'), ('zeotein-cacao-sticks-7', 'desc-trial.html')]:
    snip += ["  {%- when '" + h + "' -%}", "    " + open(D + f, encoding='utf-8').read().strip()]
snip += ["{%- endcase -%}", ""]
open(NEW + 'snippets__zt-desc-cacao.liquid', 'w', encoding='utf-8').write('\n'.join(snip))

# ---- 2) Cacao templates: lead with collagen in the quick line; v2 description
for fn in ['templates__product.zeotein-cacao-30-day-bag.json', 'templates__product.cacao-30-day.json', 'templates__product.cacao-7-day.json']:
    head, t = load(NEW + fn)
    main = t['sections']['main']; b = main['blocks']; order = main['block_order']
    b['text_zt_quick']['settings']['text'] = '<strong>14g grass-fed collagen peptides. 23g protein. Zero sugar.</strong>'
    if 'zt_desc' not in b:
        b['zt_desc'] = {'type': 'custom_liquid', 'settings': {'custom_liquid': R("part: 'desc'")}}
        b['description']['disabled'] = True
        i = order.index('description'); order.insert(i, 'zt_desc')
    save(NEW + fn, head, t)
    print(fn, 'quick + desc ok')

# ---- 3) Vegan templates built from the exact live copies
SEAL_TYPE = 'shopify://apps/seal-subscriptions/blocks/subscription-widget/13b25004-a140-4ab7-b5fe-29918f759699'
VEG = {
 'templates__product.vegan-30-day.json': dict(
    old=['icon_with_text_9yKjfC', 'icon_with_text_zt2', 'text_WCVKGe', 'text_GAbVfX', 'text_WUpYpa'], current='sticks', label='Vegan 30 stick packs',
    perks=R("part: 'perks', sub_gifts: 'shaker,guides', once_text: '<b>Free with your first order:</b> 3 digital guides'"),
    review=R("part: 'review', quote: \"Love the nutty flavor and texture. … Great product, and I highly recommend it!\", name: 'K.W.'")),
 'templates__product.vegan-7-day.json': dict(
    old=['icon_with_text_aRigQD', 'icon_with_text_zt2', 'text_WcEU4c', 'text_7PHDrF', 'text_EMPACA'], current='trial', label='Vegan 7-Day pack',
    perks=R("part: 'perks', sub_gifts: '', once_text: '<b>Included:</b> the Starter Guide and 2 recipe guides, by email'"),
    review=R("part: 'review', quote: \"Great taste and mixes very well\", name: 'Josh M.'")),
}
for fn, c in VEG.items():
    raw = open(S + 'live_orig/' + fn, encoding='utf-8').read()
    t = json.loads(raw); head = ''
    main = t['sections']['main']; blocks = main['blocks']; order = main['block_order']
    badge = [x for x in order if x.startswith('judge_me_reviews_preview_badge')][0]
    seals = [x for x in order if x.startswith('seal_subscriptions')]
    if seals: seal = seals[0]
    else:
        seal = 'seal_subscriptions_subscription_widget_zt'
        blocks[seal] = {'type': SEAL_TYPE, 'settings': {'product': '{{product}}'}}
        order.append(seal)
    for x in c['old'] + [badge]: blocks[x]['disabled'] = True
    blocks['zt_rating'] = {'type': 'custom_liquid', 'settings': {'custom_liquid': R("part: 'rating'")}}
    blocks['zt_formats'] = {'type': 'custom_liquid', 'settings': {'custom_liquid': R("part: 'formats', blend: 'vegan', current: '" + c['current'] + "'")}}
    blocks['zt_perks'] = {'type': 'custom_liquid', 'settings': {'custom_liquid': c['perks']}}
    blocks['zt_trust'] = {'type': 'custom_liquid', 'settings': {'custom_liquid': R("part: 'trust'")}}
    blocks['zt_review'] = {'type': 'custom_liquid', 'settings': {'custom_liquid': c['review']}}
    blocks['zt_sticky'] = {'type': 'custom_liquid', 'settings': {'custom_liquid': R("part: 'sticky', label: '" + c['label'] + "'")}}
    fixed = ['title', 'zt_rating', 'text_zt_quick', 'zt_formats', 'price', seal, 'zt_perks', 'variant_picker', 'quantity_selector', 'buy_buttons', 'zt_trust', 'zt_review', 'zt_sticky']
    rest = [x for x in order if x not in c['old'] + [badge] + fixed]
    new = fixed + c['old'] + [badge] + rest
    assert set(new) == set(blocks), set(new) ^ set(blocks)
    main['block_order'] = new
    main['settings']['media_size'] = 'medium'
    save(NEW + fn, head, t)
    print(fn, '->', ' > '.join(x for x in new if not blocks[x].get('disabled')))
for f in sorted(os.listdir(NEW)):
    if f.startswith(('templates__', 'snippets__')):
        print(hashlib.md5(open(NEW + f, 'rb').read()).hexdigest(), f)
