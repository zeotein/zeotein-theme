import sys, json, cv2
sys.path.insert(0, '/home/user/zeotein-theme/google-site/tools')
from garble import garble_word
D = '/tmp/claude-0/-home-user-zeotein-theme/de92fffb-0446-5b62-b9a6-c9f40b3b41b9/scratchpad/garbled'
# measured on 4x gridded close-ups; sticks7 is the same mockup shifted +50 px
S30 = [('ZEOLITE', (47, 697, 30, 9), 1), ('IMMUNE', (41, 826, 25, 7), 0), ('DETOX', (136, 826, 20, 7), 0),
       ('ZEOLITE', (234, 697, 31, 9), 1), ('IMMUNE', (229, 826, 23, 7), 0), ('DETOX', (325, 826, 20, 7), 0)]
JOBS = {'vegan-sticks30': S30, 'vegan-sticks7': [(w, (x + 50, y, ww, h), p) for w, (x, y, ww, h), p in S30]}
log = json.load(open(f'{D}/garble-log.json'))
for name, jobs in JOBS.items():
    img = cv2.imread(f'{D}/{name}.png', cv2.IMREAD_UNCHANGED)
    for i, (word, box, pad) in enumerate(jobs):
        img, info = garble_word(img, box, pad=pad, seed=31 + i)
        log[name][f'{word}@stick{i // 3 + 1}'] = {'tight_box': box, 'glyph_groups': info['segments'], 'order': info['order']}
        print(f'{name:15} stick{i // 3 + 1} {word:8} box {box} groups {info["segments"]} order {info["order"]}')
    cv2.imwrite(f'{D}/{name}.png', img)
    cv2.imwrite(f'{D}/{name}-640.png', cv2.resize(img, (640, 640), interpolation=cv2.INTER_AREA))
json.dump(log, open(f'{D}/garble-log.json', 'w'), indent=1, default=int)
