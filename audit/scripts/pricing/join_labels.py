import os
import sys, json, openpyxl, datetime as dt, collections, statistics as st
S=os.environ.get('ZT_SCRATCH', './')  # folder holding the ship/ order exports and dl_boxes/ label workbook (not committed)
wb=openpyxl.load_workbook(S+'dl_boxes/boxes.xlsx', data_only=True)
ws=wb['Labels']
hdr=[ws.cell(5,c).value for c in range(1,20)]
print('Labels header row5:', hdr)
lab=collections.defaultdict(list)
for r in range(6, ws.max_row+1):
    order=ws.cell(r,3).value; cost=ws.cell(r,13).value
    if order is None or not isinstance(cost,(int,float)): continue
    key=str(order).strip().lstrip('#')
    lab[key].append(dict(cost=cost, box=ws.cell(r,16).value, svc=ws.cell(r,7).value, dest=ws.cell(r,5).value))
print('label rows keyed:', len(lab), 'sample keys', list(lab)[:5])
orders=[]
for f in ['orders_p1.json','orders_p2.json','orders_p3.json']:
    orders+=json.load(open(S+'ship/'+f))
seen=set(); rows=[]
for o in orders:
    if o['name'] in seen: continue
    seen.add(o['name'])
    if o['test'] or o['cancelledAt']: continue
    src=o['sourceName'] or ''
    sub=float(o['currentSubtotalPriceSet']['shopMoney']['amount']); ship=float(o['totalShippingPriceSet']['shopMoney']['amount'])
    cc=(o.get('shippingAddress') or {}).get('countryCodeV2')
    kind='renewal' if src=='subscription_contract_checkout_one' else ('web' if src=='web' else src or 'other')
    hasplan=any(li['sellingPlan'] for li in o['lineItems']['nodes'])
    titles=[(li['title'], li['quantity']) for li in o['lineItems']['nodes']]
    t=dt.datetime.fromisoformat(o['createdAt'].replace('Z','+00:00'))
    k=o['name'].lstrip('#')
    L=lab.get(k)
    rows.append(dict(name=k,t=t,sub=sub,ship=ship,cc=cc,kind=kind,hasplan=hasplan,titles=titles,label=sum(x['cost'] for x in L) if L else None, box=(L[0]['box'] if L else None)))
json.dump([dict(r, t=r['t'].isoformat()) for r in rows], open(S+'pricing/orders_joined.json','w'))
print('orders', len(rows), 'with label match', sum(1 for r in rows if r['label'] is not None))
print('date range', min(r['t'] for r in rows).date(), max(r['t'] for r in rows).date())
# classify
def cls(r):
    if r['kind']=='renewal': return 'renewal'
    if r['kind']=='web': return 'web-sub-first' if r['hasplan'] else 'web-one-time'
    return 'other:'+r['kind']
by=collections.defaultdict(list)
for r in rows:
    if r['cc']!='US': continue
    by[cls(r)].append(r)
print()
for k,v in by.items():
    m=[r for r in v if r['label'] is not None]
    paid=[r for r in v if r['ship']>0]
    print(f"{k:16s} n={len(v):3d} paying_ship={len(paid):3d} ({len(paid)/len(v)*100:4.0f}%) avg_sub=${st.mean(r['sub'] for r in v):7.2f} avg_ship_charged=${st.mean(r['ship'] for r in v):5.2f} (when paid ${st.mean(r['ship'] for r in paid) if paid else 0:5.2f}) | label-matched n={len(m)} avg_label=${st.mean(r['label'] for r in m) if m else 0:5.2f} net_ship_subsidy/order=${(st.mean(r['label']-r['ship'] for r in m)) if m else 0:5.2f}")
