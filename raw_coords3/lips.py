# Measure the exact lips row on the CLEAN raws (watermark-free) per model
# head and print suggested pcts. Brown/auburn hair is excluded via b>=g-8
# (lipstick reds have b close to or above g; warm browns have b well below g).
import os
from PIL import Image

ROOT = r'c:\Users\yurek\OneDrive\Desktop\tubhyam\tubhyamoffical'
CUT = os.path.join(ROOT, 'raw_coords3', 'cutout')
CLEAN = os.path.join(ROOT, 'raw_coords3', 'clean')
JOBS = ['00', '43', '01', '03', '04']


def person_centers(alpha0, bbox, rid):
    x0, y0, x1, y1 = bbox
    if rid != '43':
        return [(x0 + x1) // 2]
    w = x1 - x0
    sums = [0] * w
    ap = alpha0.load()
    for yy in range(y0, y1, 8):
        for xx in range(x0, x1, 2):
            if ap[xx, yy]:
                sums[xx - x0] += 1
    lo, hi = int(w * 0.35), int(w * 0.65)
    valley = min(range(lo, hi), key=lambda i: sums[i])
    tl = sum(sums[:valley]) or 1
    tr = sum(sums[valley:]) or 1
    left = sum(i * sums[i] for i in range(valley)) / tl
    right = sum(i * sums[i] for i in range(valley, w)) / tr
    return [x0 + int(left), x0 + int(right)]


def head_center(alpha0, bbox):
    """Weighted centroid of the head band - bbox center is off for posed
    shots (e.g. 01's flared dress pulls the bbox centre right)."""
    x0, y0, x1, y1 = bbox
    ap = alpha0.load()
    yy0 = y0 + 10
    yy1 = y0 + int((y1 - y0) * 0.10)
    sums = [0] * (x1 - x0)
    for xx in range(x0, x1):
        c = 0
        for yy in range(yy0, yy1, 2):
            if ap[xx, yy]:
                c += 1
        sums[xx - x0] = c
    tot = sum(sums) or 1
    return x0 + int(sum(i * s for i, s in enumerate(sums)) / tot)


def head_center(alpha0, bbox):
    """Weighted centroid of the head band - bbox center is off for posed
    shots (e.g. 01's flared dress pulls the bbox centre right)."""
    x0, y0, x1, y1 = bbox
    ap = alpha0.load()
    yy0 = y0 + 10
    yy1 = y0 + int((y1 - y0) * 0.10)
    sums = [0] * (x1 - x0)
    for xx in range(x0, x1):
        c = 0
        for yy in range(yy0, yy1, 2):
            if ap[xx, yy]:
                c += 1
        sums[xx - x0] = c
    tot = sum(sums) or 1
    return x0 + int(sum(i * s for i, s in enumerate(sums)) / tot)


for rid in JOBS:
    cu = Image.open(os.path.join(CUT, rid + '_c2.png')).convert('RGBA')
    alpha0 = cu.getchannel('A').point(lambda v: 255 if v > 16 else 0)
    bb = alpha0.getbbox()
    x0, y0, x1, y1 = bb
    ph = y1 - y0
    print('==', rid, 'bbox', bb, 'ph', ph)
    centers = person_centers(alpha0, bb, rid) if rid == '43' else [head_center(alpha0, bb)]
    print(' centers', centers)
    raw = Image.open(os.path.join(CLEAN, rid + '_cl2.png')).convert('RGB')
    rp = raw.load()
    for cx in centers:
        bx0 = max(0, cx - 60)
        bx1 = min(raw.width - 1, cx + 60)
        rows = {}
        for yy in range(y0, y0 + int(ph * 0.16)):
            cnt = 0
            for xx in range(bx0, bx1):
                r, g, b = rp[xx, yy]
                if r > 120 and r - g > 45 and r - b > 35 and g < 150 and b >= g - 8:
                    cnt += 1
            if cnt >= 2:
                rows[yy] = cnt
        if not rows:
            print('  cx', cx, 'NO LIPS FOUND')
            continue
        ys = sorted(rows)
        clusters = []
        s = ys[0]; prev = ys[0]
        for yy in ys[1:]:
            if yy - prev <= 4:
                prev = yy
            else:
                clusters.append((s, prev)); s = yy; prev = yy
        clusters.append((s, prev))
        for (c0, c1) in clusters:
            tot = sum(rows.get(y, 0) for y in range(c0, c1 + 1))
            peak = max(rows.get(y, 0) for y in range(c0, c1 + 1))
            print('  cx', cx, 'cluster y', c0, '..', c1, 'px', tot, 'peak', peak,
                  'pct_m10 %.4f' % ((c0 - y0 - 10) / ph),
                  'pct_m6 %.4f' % ((c0 - y0 - 6) / ph))
print('DONE')
