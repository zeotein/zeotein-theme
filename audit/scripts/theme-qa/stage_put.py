# Finds the latest stagedUploadsCreate result for <staged-filename> in this session's log and PUTs <localfile> to it.
import json, subprocess, sys
name, local = sys.argv[1], sys.argv[2]
p = '/root/.claude/projects/-home-user-zeotein-theme/cebad199-acf9-5993-b486-6404c594be45.jsonl'
found = None
for line in open(p):
    if name + '?X-Goog' not in line: continue
    ev = json.loads(line)
    def walk(o):
        global found
        if isinstance(o, str) and '"stagedTargets"' in o and o.strip().startswith('{'):
            try:
                d = json.loads(o)
                for t in d['data']['stagedUploadsCreate']['stagedTargets']:
                    if t['resourceUrl'].endswith('/' + name): found = t
            except Exception: pass
        elif isinstance(o, dict): [walk(v) for v in o.values()]
        elif isinstance(o, list): [walk(v) for v in o]
    walk(ev)
if not found: sys.exit('no staged target found for ' + name)
r = subprocess.run(['curl', '-sS', '-X', 'PUT', '-H', 'Content-Type: text/plain', '--data-binary', '@' + local, found['url'], '-o', '/dev/null', '-w', '%{http_code}'], capture_output=True, text=True)
print('PUT', name, r.stdout, r.stderr[:200]); print(found['resourceUrl'])
