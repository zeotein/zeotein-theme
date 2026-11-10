#!/usr/bin/env python3
"""
Compliance gate for the Zeotein Google Site.

  python3 qa/compliance_check.py [path/to/prescan.py]

Layer 1: the zeotein-compliance-scrub prescan (Google Ads healthcare, FDA/DSHEA, FTC
         patterns) run on every built page, including alt text, attributes and JSON-LD.
Layer 2: Zeotein house rules from the Ad Setup Guardrails, the Landing Page Headlines
         test queue, the Ad Comment Replies rules and the Ad Decisions log.
Exit code 0 only when nothing blocking is found.
"""
import sys, re, json, html, pathlib, importlib.util

ROOT = pathlib.Path(__file__).resolve().parents[1]
PRESCAN = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else None
cfg = json.loads((ROOT / "src" / "config.json").read_text())
V = cfg["vars"]


def load_prescan(path):
    spec = importlib.util.spec_from_file_location("prescan", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def all_text(raw):
    """Visible text PLUS every attribute value and JSON-LD, so alt text, titles and schema are screened too."""
    attrs = " ".join(html.unescape(v) for v in re.findall(r'(?:alt|title|aria-label|content)="([^"]*)"', raw))
    ld = " ".join(re.findall(r'<script type="application/ld\+json">(.*?)</script>', raw, re.S))
    body = re.sub(r"(?is)<(script|style).*?</\1>", " ", raw)
    body = html.unescape(re.sub(r"(?s)<[^>]+>", "\n", body))
    return body + "\n" + attrs + "\n" + ld


# ---- Layer 2: house rules -------------------------------------------------
BANNED = {  # rule -> regex, applies to every page, text + attributes + schema
    "names the mineral (Google rule: describe, never name)": r"\b(zeolite|clinoptilolite)\b",
    "detox / cleanse / toxin / heavy-metal wording": r"\b(detox\w*|cleans\w*|toxin\w*|heavy metals?|chelat\w*|purif\w*)\b",
    "immune / inflammation / disease wording": r"\b(immun\w*|inflammat\w*|disease-?\s*free|bloat\w*|gut health|brain fog)\b",
    "weight-loss or appetite-suppression wording": r"\b(weight|slim\w*|fat[- ]?burn\w*|lose \d+|lbs?\b|appetite suppress\w*|curb\w* (your )?appetite|metaboli\w*)\b",
    "GLP-1 / medication wording": r"\b(glp-?1|ozempic|wegovy|zepbound|mounjaro|semaglutide|tirzepatide|the shot|medication side)\b",
    "outcome / transformation promise": r"\b(real results|just results|proven|transform\w*|a (better|new) you|clinically)\b",
    "time of day (Jewels' rule)": r"\b(morning|evening|night|bedtime|breakfast|lunch|dinner|afternoon)\b",
    "frequency (no 'daily', 'once a day')": r"\b(daily|once a day|twice a day|every day|per day|a day)\b",
    "'first month' (always 'first order')": r"\bfirst month\b",
    "'one scoop' (a serving is two scoops)": r"\bone scoop\b",
    "retired claims: nothing hidden / third-party tested / no proprietary blend / lab tested": r"\b(nothing hidden|third[- ]party tested|no proprietary blend|lab[- ]tested)\b",
    "founder language (ownership-sensitive)": r"\b(founder|founded by|i started)\b",
    "organic collagen / bone broth / mineral (they are not organic)": r"\borganic (collagen|bone broth|zeolite|volcanic|mineral)\b",
    "counts what the bag replaces": r"\b(instead of|replaces?)\s+(two|three|four|five|six|\d+)\b",
    "em dash (build prompt: no em dashes)": r"\u2014",
}
# Quoted customer reviews are allowed to use their own words for time of day / frequency,
# but every other rule still applies to them.
REVIEW_EXEMPT = {"time of day (Jewels' rule)", "frequency (no 'daily', 'once a day')"}

PER_PAGE = {
    "cacao": {"must_not": {r"\badded sugar": "Cacao copy says 'zero sugar', never 'added sugar'", r"\b20 ?g\b": "20g is the Vegan number", r"\bone packet|stick pack": "no packet/stick wording on the bag page"}},
    "vegan": {"must_not": {r"\b23 ?g\b": "23g is Cacao only", r"\bsix ingredients\b": "Vegan has five ingredients", r"55%": "55% off is the Cacao kit offer"}},
    "home": {"must_not": {}},
}


def strip_reviews(raw):
    return re.sub(r'(?s)<figure class="rev">.*?</figure>', " ", raw)


def main():
    pres = load_prescan(PRESCAN) if PRESCAN and PRESCAN.exists() else None
    report, blocking = [], 0
    for page in cfg["pages"]:
        slug = page["slug"]
        f = next((ROOT / "dist" / "ghl").glob(f"*-{slug}.html"))
        raw = f.read_text()
        text = all_text(raw) + "\n" + page["seoTitle"] + "\n" + page["seoDescription"]
        text_no_reviews = all_text(strip_reviews(raw)) + "\n" + page["seoTitle"] + "\n" + page["seoDescription"]
        entry = {"page": slug, "file": str(f.relative_to(ROOT)), "prescan": None, "house_rules": [], "checks": {}}

        # Layer 1
        if pres:
            r = pres.scan(text, slug)
            # The prescan picks its supplement-facts spec by the first formula word it sees; the nav
            # names both formulas, so run the facts cross-check explicitly per formula instead.
            r["findings"] = [x for x in r["findings"] if x["rule"] != "supplement_facts_mismatch"]
            formula = "vegan" if slug == "vegan" else ("cacao" if slug == "cacao" else None)
            facts_m = re.search(r'<div class="facts">(.*?)</div>', raw, re.S)
            facts_text = html.unescape(re.sub(r"(?s)<[^>]+>", " ", facts_m.group(1))) if facts_m else ""
            facts_text = re.sub(r"\s+", " ", facts_text)
            if formula and not facts_text:
                r["findings"].append({"tier": "CRITICAL", "rule": "facts_table_missing", "match": slug, "context": ""})
            if formula:
                for field, expected in pres.SPEC[formula].items():
                    if field == "serving_g":
                        continue
                    m = re.search(rf"{re.escape(field)}\s*:?\s*(\d+(?:\.\d+)?)\s*(?:g|mg)?", facts_text, re.I)
                    if m and m.group(1) != expected:
                        r["findings"].append({"tier": "CRITICAL", "rule": "supplement_facts_mismatch", "match": f"{field}={m.group(1)} spec {expected}", "context": ""})
                    entry["checks"][f"spec_{formula}_{field}"] = (m.group(1) if m else None, expected)
            r["counts"] = {t: sum(1 for x in r["findings"] if x["tier"] == t) for t in ("CRITICAL", "HIGH", "MEDIUM")}
            entry["prescan"] = r

        # Layer 2
        for rule, rx in BANNED.items():
            src = text_no_reviews if rule in REVIEW_EXEMPT else text
            for m in re.finditer(rx, src, re.I):
                ctx = src[max(0, m.start() - 60): m.end() + 60].replace("\n", " ")
                entry["house_rules"].append({"rule": rule, "match": m.group(0), "context": ctx.strip()})
        for rx, why in PER_PAGE.get(slug, {}).get("must_not", {}).items():
            src = text_no_reviews
            for m in re.finditer(rx, src, re.I):
                entry["house_rules"].append({"rule": why, "match": m.group(0), "context": src[max(0, m.start()-60): m.end()+60].replace("\n", " ").strip()})

        # Structural checks
        entry["checks"]["fda_disclaimer"] = bool(re.search(r"not been evaluated by the Food and Drug Administration", text))
        entry["checks"]["product_ctas_consistent"] = sorted(set(re.findall(r'href="https://zeotein\.com/products/[^"]+">([^<]+)<', raw)))
        imgs = sorted(set(re.findall(r'<img[^>]+src="([^"]+)"', raw)))
        allowed = {v for k, v in V.items() if k.startswith("img")}
        entry["checks"]["images_all_approved"] = all(any(i.startswith(a.split("&width")[0].split("?")[0]) for a in allowed) for i in imgs)
        entry["checks"]["image_hosts"] = sorted(set(re.sub(r"^https://([^/]+)/.*", r"\1", i) for i in imgs))
        entry["checks"]["ghl_assets_referenced"] = bool(re.search(r"filesafe\.space|leadconnectorhq", raw))
        for price_key in ("cacaoKitPrice", "cacaoKitRenewal", "cacaoKitValue", "cacaoKitSave", "cacaoOncePrice", "veganKitPrice", "veganKitRenewal", "vegan7Price"):
            pass
        stray_prices = sorted(set(re.findall(r"\$\d+(?:\.\d\d)?", text)) - {v for k, v in V.items() if isinstance(v, str) and v.startswith("$")})
        entry["checks"]["prices_not_in_config"] = stray_prices

        blocking_here = len(entry["house_rules"]) + (entry["prescan"]["counts"]["CRITICAL"] if entry["prescan"] else 0)
        blocking_here += 0 if entry["checks"]["fda_disclaimer"] else 1
        blocking_here += 0 if entry["checks"]["images_all_approved"] else 1
        blocking_here += 1 if entry["checks"]["ghl_assets_referenced"] else 0
        blocking_here += len(stray_prices)
        entry["blocking"] = blocking_here
        blocking += blocking_here
        report.append(entry)

    out = ROOT / "qa" / "compliance-report.json"
    out.write_text(json.dumps(report, indent=2))
    for e in report:
        c = e["prescan"]["counts"] if e["prescan"] else {}
        print(f"{e['page']:<14} prescan CRITICAL={c.get('CRITICAL','-')} HIGH={c.get('HIGH','-')} MEDIUM={c.get('MEDIUM','-')} | house-rule hits={len(e['house_rules'])} | FDA={e['checks']['fda_disclaimer']} | images ok={e['checks']['images_all_approved']} | stray $={e['checks']['prices_not_in_config']} | blocking={e['blocking']}")
        for h in e["house_rules"]:
            print(f"    HOUSE  [{h['rule']}] '{h['match']}' :: {h['context'][:140]}")
        if e["prescan"]:
            for x in e["prescan"]["findings"]:
                if x["tier"] in ("CRITICAL", "HIGH"):
                    print(f"    {x['tier']:<8} [{x['rule']}] '{x['match']}' :: {x.get('context','')[:140]}")
    print(f"\nTOTAL BLOCKING: {blocking}")
    sys.exit(0 if blocking == 0 else 1)


if __name__ == "__main__":
    main()
