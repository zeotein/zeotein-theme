# Build v2 single-ingredient templates from the exact live copies in src/.
import json, sys, pathlib
SRC = pathlib.Path('src'); OUT = pathlib.Path('new'); OUT.mkdir(exist_ok=True)
LABELS = {
  'organic-cacao': 'Organic cacao powder', 'zeolite': 'Zeolite powder', 'bone-broth': 'Bone broth powder',
  'collagen-peptides': 'Collagen peptides', 'mct': 'MCT oil powder', 'organic-seamoss': 'Sea moss powder',
  'lions-mane': "Lion's mane powder", 'hemp': 'Hemp protein powder', 'pumpkin-seed-protein': 'Pumpkin seed protein',
}
for name in sys.argv[1:]:
    t = json.loads((SRC / f'{name}.json').read_text(encoding='utf-8'))
    main = t['sections']['main']; b = main['blocks']
    b['zt_rating'] = {'type': 'custom_liquid', 'settings': {'custom_liquid': "{% render 'zt-buybox-tidy', part: 'rating', rating: '4.9', orders: '1,500+', scope: 'store' %}"}}
    b['zt_trust'] = {'type': 'custom_liquid', 'settings': {'custom_liquid': "{% render 'zt-buybox-tidy', part: 'trust', kind: 'single' %}"}}
    b['zt_sticky'] = {'type': 'custom_liquid', 'settings': {'custom_liquid': "{% render 'zt-buybox-tidy', part: 'sticky', label: '" + LABELS[name].replace("'", '’') + "', product: product %}"}}
    for k in ('judge_me_reviews_preview_badge_zt', 'text_hyPQYJ', 'zt_ship_free'):
        if k in b: b[k]['disabled'] = True
    old = main['block_order']
    head = ['title', 'zt_rating', 'judge_me_reviews_preview_badge_zt', 'price', 'zt_servings', 'variant_picker', 'quantity_selector', 'buy_buttons', 'zt_trust', 'zt_chips', 'text_hyPQYJ', 'zt_ship_free']
    rest = [k for k in old if k not in head]
    main['block_order'] = [k for k in head if k in b] + rest + ['zt_sticky']
    assert set(main['block_order']) == set(b), (set(b) ^ set(main['block_order']))
    main['settings']['media_size'] = 'medium'
    out = json.dumps(t, indent=2, ensure_ascii=False) + '\n'
    (OUT / f'product.{name}.json').write_text(out, encoding='utf-8')
    print(name, 'order:', main['block_order'])
