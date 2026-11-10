"""OCR gate for Google-facing packaging photos (same method as the 25 Oct gate in Ad Decisions):
upscale 3x, contrast-boost, test normal + inverted, several page-segmentation modes.
Prints every word read and flags the banned set."""
import sys, re, cv2, pytesseract, json
BANNED = ["ZEOLITE", "IMMUNE", "DETOX", "INFLAMMATION", "CLINOPTILOLITE", "TOXIN", "CLEANSE"]
def variants(img):
    g = cv2.cvtColor(img, cv2.COLOR_BGRA2GRAY) if img.shape[2] == 4 else cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    g = cv2.resize(g, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8)).apply(g)
    yield "gray", clahe
    yield "inv", 255 - clahe
    _, th = cv2.threshold(clahe, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    yield "otsu", th
    yield "otsu-inv", 255 - th
def scan(path, boxes=False):
    img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if img.ndim == 2: img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    if img.shape[2] == 4:  # flatten transparency onto white
        a = img[:, :, 3:4] / 255.0
        img = (img[:, :, :3] * a + 255 * (1 - a)).astype("uint8")
    words, hits = set(), []
    for name, v in variants(img):
        for psm in (6, 11, 12):
            d = pytesseract.image_to_data(v, config=f"--psm {psm}", output_type=pytesseract.Output.DICT)
            for i, w in enumerate(d["text"]):
                w2 = re.sub(r"[^A-Za-z]", "", w).upper()
                if len(w2) < 3 or w2 == "CLEAN": continue  # brand tagline "KEEP IT CLEAN" and the CLEAN ENERGY icon
                words.add(w2)
                for b in BANNED:
                    if b in w2 or (len(w2) >= 5 and w2 in b):
                        hits.append({"word": w2, "banned": b, "variant": name, "psm": psm,
                                     "box": [d["left"][i] // 3, d["top"][i] // 3, d["width"][i] // 3, d["height"][i] // 3]})
    return sorted(words), hits
if __name__ == "__main__":
    out = {}
    for p in sys.argv[1:]:
        words, hits = scan(p)
        out[p] = {"banned_hits": sorted({h["banned"] for h in hits}), "hits": hits[:12], "words": words}
        print(p.split("/")[-1], "| BANNED READ:", out[p]["banned_hits"] or "none")
    json.dump(out, open("ocr-report.json", "w"), indent=1)
