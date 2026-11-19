# Win-back hold, 19 Nov 2026

At 8:00 AM CT, Dana said: "Can we hold off on the win-back sequence ... wait till tomorrow? Because I need Orbit to look through things."

## What changed (one value, reversible)

| | |
|---|---|
| Value | GoHighLevel custom value **Sale active** (`{{ custom_values.sale_active }}`, id GP17CuDpTqOpdjRpDipR) |
| Change | `no` to `yes` |
| When | 19 Nov 14:10 UTC (8:10 AM CT), via the Automator `update-custom-value` call |
| Other values | Sale start (2026-11-20) and Sale end (2026-12-01) are unchanged |
| Backup | BACKUP-custom-values-before.json |

## Why this holds the win-back

The live win-back flow is "WB · Win-back · One flow" (dbb240d7). It has a "Sale hold check" in front of WB9001, WB9002 and WB9003:
- If Sale active is yes, it waits 1 day and checks again.
- If Sale active is no, it sends.

WB9002 ("Thirty seconds, 23 grams of protein", template 6aece9685ca36a018031898a) was due to about 205 lapsed buyers at 10:35 AM CT today. With Sale active set to yes, those contacts wait instead.

This hold was due to start tomorrow anyway. The scheduled task "Sale active ON for Black Friday" turns it on at 12:00 AM CT on 20 Nov, and nothing offer-based goes out from 20 Nov to 1 Dec.

The scheduled task "Sale active OFF after Cyber Monday" sets it back to no at 12:00 AM CT on 1 Dec. WB9002 then goes out at the first daily check after that, about 10:35 AM CT on 1 Dec. WB9003 follows 3 days later.

The Recipe Guide Invite G2 is also dated 1 Dec, if that campaign gets built.

Per the 18 Nov notes, only the win-back flows carry this check. The paused-subscriber (PS) and cancelled-subscriber win-back (WBC) checks are still queued for the builder.

## To undo

Set Sale active back to `no` before tomorrow 12:00 AM CT. The waiting contacts get WB9002 at their next daily check.

## Verification

A check is scheduled for 10:50 AM CT. It looks for any WB9002 email sent after 10:30 AM CT today and confirms Sale active is still yes.
