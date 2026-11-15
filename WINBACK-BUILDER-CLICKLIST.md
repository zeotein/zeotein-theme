# Win-back builder click list (GHL / Automator AI, location Kch9YmRfzpmQrAs5Bchz)

Rules: nothing is published, nobody is enrolled, no trigger or workflow is turned on or off.
No step here creates or edits any custom field or custom value.
After every save, wait for the "Saved" toast. Wait 8 to 10 seconds after any editor loads before typing.

```
PART A: DRAFT copy of 988a550d
1. Left menu: Automation > Workflows. In Search type "1. Winback". Row "1. Winback, 90 Day Lapsed" shows Published. Do not touch its toggle.
2. On that row click the three dots > Duplicate (some accounts label it "Clone"). Do not open the original.
3. Open the new copy. Click the workflow name at top left. Rename to: WB · Win-back · One flow (DRAFT, awaiting Dana). Press Enter.
4. Top right: confirm the toggle reads Draft. Click Save. Wait for the "Saved" toast.
5. Click the Settings tab. Write down: Allow re-entry (on/off), Time window / allowed sending hours, Timezone. Change nothing. Click back to the Builder tab.

PART B: Last order date (goes in the order workflow, NOT the draft; the draft starts from a tag and has no order date)
6. Automation > Workflows. Search "Order Placed". Open "Shopify, Order Placed" (id ae25f20c). Click the trigger box and read its Filters.
   If it has any product or order-type filter, close the panel WITHOUT saving, go back, search "Post-Purchase Router" and open "Post-Purchase Router, v6" (id 7ee9d697). Use whichever one has no product filter.
7. Click the + directly under the trigger(s).
8. In the action search type "Update Contact Field" and choose it.
9. Action Name: Set Last order date
10. Field: Last order date. Value: click the tag / custom value icon in the value box > Order (or Shopify Order) > Created At (or Order Date). If no order date variable is offered, choose Right Now > Date.
11. Click Save Action. Then click Save in the top bar. Wait for the "Saved" toast. Do not touch the Publish toggle.
12. Check later: after the next order, open that contact and confirm Last order date is filled in.

PART C: Sale active hold (in the DRAFT only)
13. Open "WB · Win-back · One flow (DRAFT, awaiting Dana)". Wait 8 to 10 seconds for the canvas to load.
14. Click the + directly above the WB9001 email step > choose If / Else. Action Name: Sale hold check 1
15. On the first branch, rename it "Sale on". Click Add Condition and look for an existing "Custom Value" condition type. If present: choose Custom Value > Sale active, operator Is, value yes.
    If NO Custom Value condition type is offered: STOP. Close the panel without saving, remove the unsaved If / Else, create or edit nothing, and report "hold check unresolved: If/Else cannot test Custom Values in this account". Skip steps 16 to 21.
16. Rename the None branch to "Sale off". It must lead to WB9001.
17. Under the "Sale on" branch click + > Wait. Wait for: Time Delay. 1 Days. Action Name: Sale hold wait 1
18. Under that Wait click + > Go To. Target: Sale hold check 1.
19. Click Save Action, then Save in the top bar. Wait for the "Saved" toast.
20. Repeat steps 14 to 19 above WB9002 (names: Sale hold check 2, Sale hold wait 2) and above WB9003 (Sale hold check 3, Sale hold wait 3). If the draft has any SMS step, repeat above it too.
21. Click WB9001, WB9002 and WB9003 one at a time and confirm each still shows its linked template "ZEOTEIN Flow v2 - Winback 90 Email 1/2/3 (REVIEW)".
22. Final check: toggle still reads Draft. Take a screenshot of the whole canvas. Do NOT publish.
```
