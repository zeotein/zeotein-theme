# Rebuild each staged-upload policy from its key (same layout Shopify issues) and upload.
import json, base64, subprocess, sys
S = '/tmp/claude-0/-home-user-zeotein-theme/cebad199-acf9-5993-b486-6404c594be45/scratchpad/'
date, exp = sys.argv[2], sys.argv[3]          # e.g. 20261115T040356Z  2026-11-16T04:03:56Z
day = date[:8]
for local, rel, sig in json.load(open(sys.argv[1])):
    key = 'tmp/77554581717/files/' + rel
    pol = {"conditions": [{"Content-Type": "text/plain"}, {"success_action_status": "201"}, {"acl": "private"},
            ["content-length-range", 1, 20971520], {"bucket": "shopify-staged-uploads"}, {"key": key},
            {"x-goog-date": date}, {"x-goog-credential": "merchant-assets@shopify-tiers.iam.gserviceaccount.com/" + day + "/auto/storage/goog4_request"},
            {"x-goog-algorithm": "GOOG4-RSA-SHA256"}], "expiration": exp}
    txt = json.dumps(pol, separators=(',', ':')).replace('/', '\\/')
    b64 = base64.b64encode(txt.encode()).decode()
    cmd = ['curl', '-sS', '-o', '/dev/null', '-w', '%{http_code}', '-X', 'POST', 'https://shopify-staged-uploads.storage.googleapis.com/',
           '-F', 'Content-Type=text/plain', '-F', 'success_action_status=201', '-F', 'acl=private', '-F', 'key=' + key,
           '-F', 'x-goog-date=' + date, '-F', 'x-goog-credential=merchant-assets@shopify-tiers.iam.gserviceaccount.com/' + day + '/auto/storage/goog4_request',
           '-F', 'x-goog-algorithm=GOOG4-RSA-SHA256', '-F', 'x-goog-signature=' + sig, '-F', 'policy=' + b64, '-F', 'file=@' + S + local + ';type=text/plain']
    r = subprocess.run(cmd, capture_output=True, text=True)
    print(r.stdout, local.split('/')[-1], r.stderr[:120])
