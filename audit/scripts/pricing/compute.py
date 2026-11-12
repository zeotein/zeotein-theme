import os
"""Pricing audit numbers. Inputs: live Shopify (Nov 12), Wennie's COGS V2 (Oct WAC), label log (Sep-Oct),
Wennie P&L Jan-Oct 2026, 90-day order export (Aug 14 - Nov 11). Output: numbers.json"""
import json, statistics as st, collections
S=os.environ.get('ZT_SCRATCH', './')  # folder holding the ship/ order exports and dl_boxes/ label workbook (not committed)
FEE=0.033; BOX=1.30
COGS=dict(bag=29.04, sticks30=38.00, day7=9.00, vegan30=43.55, shaker=4.66, scoop=3.30)
LABEL=dict(bag=9.52, sticks30=8.88, day7=7.45, bag4=11.91)          # matched single-unit orders / 10x8x2 box for 7-Day
SHIPCHG=dict(bag=12.39, sticks30=11.95, day7=10.23)                 # avg shipping paid by customers who paid (single-unit orders)
def contrib(price, cogs, label, ship_charged=0.0, gifts=0.0):
    rev=price+ship_charged; fees=FEE*rev
    parts=dict(product=cogs, ship_box_fees=label+BOX+fees, gifts=gifts)
    left=rev-cogs-label-BOX-fees-gifts
    return dict(paid=round(rev,2), cogs=round(cogs,2), label=round(label,2), box=BOX, fees=round(fees,2), gifts=round(gifts,2), left=round(left,2), margin_pct=round(left/rev*100,1), product_gm_pct=round((price-cogs)/price*100,1))
U={}
U['bag_onetime_store']=contrib(109.99, COGS['bag'], LABEL['bag'], SHIPCHG['bag'], COGS['scoop'])
U['bag_renewal_store']=contrib(99.99, COGS['bag'], LABEL['bag'], SHIPCHG['bag'])
U['bag_first_lp']=contrib(76.99, COGS['bag'], LABEL['bag'], 0, COGS['shaker']+COGS['scoop'])
U['bag_renewal_lp']=contrib(99.99, COGS['bag'], LABEL['bag'], 0)
U['sticks_renewal_store']=contrib(114.99, COGS['sticks30'], LABEL['sticks30'], SHIPCHG['sticks30'])
U['sticks_onetime_store']=contrib(134.99, COGS['sticks30'], LABEL['sticks30'], SHIPCHG['sticks30'])
U['sticks_first_lp']=contrib(91.99, COGS['sticks30'], LABEL['sticks30'], 0, COGS['shaker'])
U['day7_onetime']=contrib(39.99, COGS['day7'], LABEL['day7'], SHIPCHG['day7'])
U['day7_freeship']=contrib(39.99, COGS['day7'], LABEL['day7'], 0)
U['bf_first_bag']=contrib(68.99, COGS['bag'], LABEL['bag'], 0, COGS['shaker']+COGS['scoop'])
U['bag4_onetime']=contrib(329.97, 4*COGS['bag'], LABEL['bag4'], 0, COGS['scoop'])
# price levers (per order contribution before -> after, break-even volume lift)
def lever(a,b): return dict(before=a['left'], after=b['left'], delta=round(b['left']-a['left'],2), breakeven_volume_pct=round((a['left']/b['left']-1)*100,1))
L={}
L['bag_onetime_cut_99.99']=lever(U['bag_onetime_store'], contrib(99.99, COGS['bag'], LABEL['bag'], SHIPCHG['bag'], COGS['scoop']))
L['bag_onetime_cut_89.99']=lever(U['bag_onetime_store'], contrib(89.99, COGS['bag'], LABEL['bag'], SHIPCHG['bag'], COGS['scoop']))
L['bag_renewal_15pct_93.49']=lever(U['bag_renewal_store'], contrib(93.49, COGS['bag'], LABEL['bag'], SHIPCHG['bag']))
L['sticks_onetime_raise_139.99']=lever(U['sticks_onetime_store'], contrib(139.99, COGS['sticks30'], LABEL['sticks30'], SHIPCHG['sticks30']))
L['bag_onetime_freeship']=lever(U['bag_onetime_store'], contrib(109.99, COGS['bag'], LABEL['bag'], 0, COGS['scoop']))
L['day7_freeship']=lever(U['day7_onetime'], U['day7_freeship'])
# subscriber lifetime contribution at observed 3.35 payments per customer (Seal export Oct 27)
PAY=3.35
LT=dict(lp_bag=round(U['bag_first_lp']['left']+(PAY-1)*U['bag_renewal_lp']['left'],2),
        store_bag=round(contrib(99.99, COGS['bag'], LABEL['bag'], SHIPCHG['bag'], COGS['shaker']+COGS['scoop'])['left']+(PAY-1)*U['bag_renewal_store']['left'],2))
def payback(cac, first, renew): return round(1+max(0,(cac-first))/renew,2)
PB={c: payback(c, U['bag_first_lp']['left'], U['bag_renewal_lp']['left']) for c in (60,80,120,176,306)}
# shipping, from the joined 90-day order file
rows=json.load(open(S+'pricing/orders_joined.json'))
us=[r for r in rows if r['cc']=='US' and r['kind'] in ('web','renewal')]
web=[r for r in us if r['kind']=='web']; ren=[r for r in us if r['kind']=='renewal']
MONTHS=90/30.4
FS={}
for thr in (0,35,49,75,99,119.99):
    w=[r for r in web if r['ship']>0 and r['sub']>=thr]
    FS[str(thr)]=dict(orders_90d=len(w), per_month=round(sum(r['ship'] for r in w)/MONTHS,2))
FS['renewals_all']=dict(orders_90d=sum(1 for r in ren if r['ship']>0), per_month=round(sum(r['ship'] for r in ren)/MONTHS,2))
band=[r for r in us if r['ship']>0 and 99.99<=r['sub']<119.99 and (r['kind']=='renewal' or r['hasplan'])]
FS['subs_99.99_to_119.99']=dict(orders_90d=len(band), per_month=round(sum(r['ship'] for r in band)/MONTHS,2))
paid=[r for r in us if r['ship']>0 and r['label']]
SHIP=dict(renewals_n=len(ren), renewals_paying=sum(1 for r in ren if r['ship']>0), renewals_avg_paid=round(st.mean(r['ship'] for r in ren if r['ship']>0),2),
          markup_avg=round(st.mean(r['ship']-r['label'] for r in paid),2), markup_median=round(st.median(r['ship']-r['label'] for r in paid),2),
          web_n=len(web), web_paying=sum(1 for r in web if r['ship']>0),
          band_99_149=sum(1 for r in web if 99<=r['sub']<150), band_150_175=sum(1 for r in web if 150<=r['sub']<175))
NEWC=dict(aug=25,sep=41,oct=17)
avg_new=round(sum(NEWC.values())/3,1)
out=dict(U=U,L=L,LT=LT,PB=PB,FS=FS,SHIP=SHIP,avg_new=avg_new)
json.dump(out, open(S+'pricing/numbers.json','w'), indent=1)
for k,v in U.items(): print(f"{k:22s} paid ${v['paid']:7.2f} cogs {v['cogs']:6.2f} label {v['label']:5.2f} fees {v['fees']:5.2f} gifts {v['gifts']:5.2f} -> left ${v['left']:7.2f} ({v['margin_pct']}%)  productGM {v['product_gm_pct']}%")
print(json.dumps(dict(L=L,LT=LT,PB=PB,FS=FS,SHIP=SHIP,avg_new=avg_new), indent=1))
