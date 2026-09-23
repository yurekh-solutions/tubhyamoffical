# Fix 5 chiffon dress images (dr-026..dr-030):
# 1) Inpaint both watermarks OUT of the raw photo first. The Xia Qiao
#    red/gold watermark sits right ON the navy model's face in raw 43, so
#    alpha-killing it punched holes -> inpainting repairs the covered face
#    pixels instead. The dark-navy W#XFLYQ text + its anti-aliased edges
#    get inpainted too.
# 2) rembg cutout on the cleaned photo -> no watermark can survive in alpha.
# 3) Put ALL 5 on the exact same soft-ivory studio background + shadow.
# 4) Crop the top at LIPS level (FIXED hand-calibrated values), keep the
#    full dress + feet.
# Output overwrites public/images/products/dr-026-white.jpg ... (same names).
import os, sys, shutil

ROOT = r'c:\Users\yurek\OneDrive\Desktop\tubhyam\tubhyamoffical'
RAW3 = os.path.join(ROOT, 'raw_coords3', 'raw3')
CUT = os.path.join(ROOT, 'raw_coords3', 'cutout')
CLEAN = os.path.join(ROOT, 'raw_coords3', 'clean')
BAK = os.path.join(ROOT, 'raw_coords3', 'old_dr_watermarked')
OUT = os.path.join(ROOT, 'public', 'images', 'products')
for d in (CUT, CLEAN, BAK):
    os.makedirs(d, exist_ok=True)

from PIL import Image, ImageDraw, ImageFilter, ImageChops
import numpy as np
import cv2

try:
    from rembg import new_session, remove
except Exception as e:
    print('REMBG_IMPORT_FAIL', repr(e))
    sys.exit(1)

SESSION = new_session('u2net')

JOBS = [
    ('00', 'dr-026-white'),
    ('01', 'dr-028-black'),
    ('03', 'dr-029-skyblue'),
    ('04', 'dr-030-powderblue'),
]
LIPS = {'00': 0.088, '43': 0.088, '01': 0.088, '03': 0.088, '04': 0.088}
ASPECT = 0.94
TARGET_W = 1080
BG_TOP = (248, 245, 238)
BG_BOT = (233, 227, 215)
SHADOW_RGB = (170, 162, 148)


def gradient(w, h):
    img = Image.new('RGB', (w, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(1, h - 1)
        c = (int(BG_TOP[0] + (BG_BOT[0] - BG_TOP[0]) * t),
             int(BG_TOP[1] + (BG_BOT[1] - BG_TOP[1]) * t),
             int(BG_TOP[2] + (BG_BOT[2] - BG_TOP[2]) * t))
        d.line([(0, y), (w, y)], fill=c)
    return img


def clean_raw(rid):
    """Inpaint both watermarks out of the RAW photo before rembg, so the
    person mask can never contain them. The Xia Qiao red/gold watermark
    sits right ON the navy model's face in raw 43, so inpainting repairs
    the face pixels the text covered (alpha-kill punched holes instead)."""
    cp = os.path.join(CLEAN, rid + '_cl2.png')
    if os.path.exists(cp):
        return cp
    raw = Image.open(os.path.join(RAW3, rid + '.jpg')).convert('RGB')
    Wr, Hr = raw.size
    ap = raw.load()
    # bottom-right W#XFLYQ: dark navy bold text on the floor
    mb = Image.new('L', (Wr, Hr), 0)
    pb = mb.load()
    n_blue = 0
    for yy in range(int(Hr * 0.80), Hr):
        for xx in range(int(Wr * 0.66), Wr):
            r, g, b = ap[xx, yy]
            if b > 80 and b - r > 15 and b - g > 10:
                pb[xx, yy] = 255
                n_blue += 1
    mb = mb.filter(ImageFilter.MaxFilter(11))
    # top-left Xia Qiao red characters + gold lettering
    mr = Image.new('L', (Wr, Hr), 0)
    pr = mr.load()
    n_rg = 0
    for yy in range(0, int(Hr * 0.19)):
        for xx in range(0, int(Wr * 0.36)):
            r, g, b = ap[xx, yy]
            if (r > 120 and r - g > 55 and r - b > 45) or \
               (r > 150 and 110 < g < 190 and b < 125 and r - b > 60):
                pr[xx, yy] = 255
                n_rg += 1
    mr = mr.filter(ImageFilter.MaxFilter(7))
    # far-left pale gold ornament flourish (background band only)
    mg = Image.new('L', (Wr, Hr), 0)
    pg = mg.load()
    n_gold = 0
    for yy in range(0, int(Hr * 0.25)):
        for xx in range(0, int(Wr * 0.12)):
            r, g, b = ap[xx, yy]
            if r > 135 and g > 105 and b < 160 and r - b > 30 and r - g > 15 and g - b > 5:
                pg[xx, yy] = 255
                n_gold += 1
    mg = mg.filter(ImageFilter.MaxFilter(7))
    m = ImageChops.lighter(ImageChops.lighter(mb, mr), mg)
    arr = cv2.inpaint(np.array(raw), np.array(m), 5, cv2.INPAINT_TELEA)
    Image.fromarray(arr).save(cp)
    print('CLEAN', rid, 'blue', n_blue, 'redgold', n_rg, 'gold', n_gold)
    return cp


def cutout(rid):
    cp = os.path.join(CUT, rid + '_c2.png')
    if os.path.exists(cp):
        return Image.open(cp).convert('RGBA')
    src = Image.open(clean_raw(rid)).convert('RGB')
    print('rembg', rid, '...', flush=True)
    res = remove(src, session=SESSION, post_process_mask=True)
    res = res.convert('RGBA')
    res.save(cp)
    return res


def mouth_top(img):
    """First row (from the top) with lipstick-red pixels in the face center band."""
    W, H = img.size
    px = img.load()
    x_lo, x_hi = int(W * 0.46), int(W * 0.54)
    for y in range(0, min(70, H)):
        cnt = 0
        for x in range(x_lo, x_hi):
            r, g, b = px[x, y]
            if r > 120 and (r - g) > 45 and (r - b) > 35:
                cnt += 1
        if cnt >= 3:
            return y
    return None


def person_centers(rgba, alpha0, bbox, rid):
    x0, y0, x1, y1 = bbox
    if rid != '43':
        # head-band weighted centroid - bbox centre is off for posed shots
        # (e.g. dr-028's flared skirt pulls the bbox centre to the right)
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
        return [x0 + int(sum(i * s for i, s in enumerate(sums)) / tot)]
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


FIXED = {'00': 0.065, '01': 0.109, '03': 0.100, '04': 0.099}
print('FIXED pcts', FIXED)

new_imgs = []
old_imgs = []
for rid, name in JOBS:
    rgba = cutout(rid)
    alpha0 = rgba.getchannel('A').point(lambda v: 255 if v > 16 else 0)
    bbox = alpha0.getbbox()
    if not bbox:
        print('NO_PERSON', rid)
        continue
    x0, y0, x1, y1 = bbox
    pw, ph = x1 - x0, y1 - y0
    band_top = y1 - int(ph * 0.06)
    bb = alpha0.crop((0, band_top, rgba.width, y1)).getbbox()
    fx0, fx1 = (bb[0], bb[2]) if bb else (x0 + pw // 4, x0 + 3 * pw // 4)
    pct = FIXED.get(rid, LIPS.get(rid, 0.088))
    min_w = int(pw * 1.07)
    hr = int(ph * 0.07)
    W = max(int(0.947 * ph * ASPECT) + 40, min_w + 40)
    Hc = hr + ph + int(ph * 0.05)
    person_rgb = rgba.crop(bbox).convert('RGB')
    a = alpha0.crop(bbox).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
    ox = (W - pw) // 2
    oy = hr
    canvas = gradient(W, Hc)
    sh = Image.new('L', (W, Hc), 0)
    d = ImageDraw.Draw(sh)
    ry = max(8, int(ph * 0.018))
    cx = ox + ((fx0 - x0) + (fx1 - x0)) // 2
    fw = max(60, fx1 - fx0)
    yb = oy + ph
    d.ellipse([cx - int(fw * 0.6), yb - ry, cx + int(fw * 0.6), yb + ry], fill=115)
    sh = sh.filter(ImageFilter.GaussianBlur(ry * 0.8))
    canvas.paste(Image.new('RGB', (W, Hc), SHADOW_RGB), (0, 0), sh)
    canvas.paste(person_rgb, (ox, oy), a)
    centers = person_centers(rgba, alpha0, bbox, rid)

    top_src = int(ph * pct)
    bot_src = int(ph * 1.035)
    crop_h = bot_src - top_src
    crop_w = int(crop_h * ASPECT)
    if crop_w < min_w:
        crop_w = min_w
        crop_h = int(crop_w / ASPECT)
    if top_src + crop_h > Hc - hr:
        crop_h = Hc - hr - top_src
        crop_w = int(crop_h * ASPECT)
    top_c = hr + top_src
    left = (W - crop_w) // 2
    crop = canvas.crop((left, top_c, left + crop_w, top_c + crop_h))
    print('CROP', name, 'pct', pct, 'top_src', top_src)

    left = (W - crop.width) // 2
    scale = 1.0
    if crop.width > TARGET_W:
        scale = TARGET_W / crop.width
        nh = int(crop.height * scale)
        crop = crop.resize((TARGET_W, nh), Image.LANCZOS)
    outp = os.path.join(OUT, name + '.jpg')
    old = None
    if os.path.exists(outp):
        old = Image.open(outp).convert('RGB')
        bak = os.path.join(BAK, name + '.jpg')
        if not os.path.exists(bak):
            shutil.copy2(outp, bak)
    crop.save(outp, quality=92, optimize=True)
    print('DONE', name, 'person', (pw, ph), 'old', (old.size if old else None),
          'new', crop.size, 'pct_final', pct)
    fc = [round((c - left) * scale) for c in centers]
    new_imgs.append((name, crop, fc))
    if old:
        old_imgs.append((name, old))


def montage(cells, path, cell_w=300):
    ims = []
    for name, im in cells:
        r = im.resize((cell_w, int(im.height * cell_w / im.width)), Image.LANCZOS)
        ims.append((name, r))
    H = max(i.height for _, i in ims) + 16
    M = Image.new('RGB', (cell_w * len(ims), H), (255, 255, 255))
    d = ImageDraw.Draw(M)
    x = 0
    for name, i in ims:
        M.paste(i, (x, 0))
        d.text((x + 4, H - 13), name, fill=(0, 0, 0))
        x += cell_w
    M.save(path)
    print('SAVED', path, M.size)


montage([(n, c) for n, c, _ in new_imgs], os.path.join(ROOT, 'raw_coords3', 'preview_fixed.png'))
if old_imgs:
    montage(old_imgs, os.path.join(ROOT, 'raw_coords3', 'preview_old.png'))

# zoomed face strips (top 150px at each model center, x1.7) for lips QA
strips = []
for name, im, fcs in new_imgs:
    w, h = im.size
    for ci, cx in enumerate(fcs):
        x0s = max(0, min(w - 300, cx - 150))
        s = im.crop((x0s, 0, x0s + 300, min(150, h)))
        s = s.resize((int(s.width * 1.7), int(s.height * 1.7)), Image.LANCZOS)
        strips.append((name + '#' + str(ci), s))
if strips:
    sw = sum(s.width for _, s in strips) + 4 * len(strips)
    sh_ = max(s.height for _, s in strips) + 16
    M = Image.new('RGB', (sw, sh_), (255, 255, 255))
    d = ImageDraw.Draw(M)
    x = 0
    for nm, s in strips:
        M.paste(s, (x, 0))
        d.text((x + 4, sh_ - 13), nm, fill=(0, 0, 0))
        x += s.width + 4
    M.save(os.path.join(ROOT, 'raw_coords3', 'preview_faces.png'))
    print('SAVED faces', M.size)

# check the files flagged by the blue scan (bottom-right crops)
flags = ['brown1-formal.jpg', 'fp-003-plus-size.jpg', 'jn-012.jpg']
cells = []
for f in flags:
    p = os.path.join(OUT, f)
    if not os.path.exists(p):
        continue
    im = Image.open(p).convert('RGB')
    w, h = im.size
    cells.append((f, im.crop((int(w * 0.45), int(h * 0.72), w, h))))
if cells:
    montage(cells, os.path.join(ROOT, 'raw_coords3', 'check_flags.png'))

print('--- blue watermark scan over all product jpgs (bottom-right region) ---')
total = 0
for f in sorted(os.listdir(OUT)):
    if not f.lower().endswith('.jpg'):
        continue
    total += 1
    try:
        im = Image.open(os.path.join(OUT, f)).convert('RGB')
    except Exception:
        continue
    w, h = im.size
    reg = im.crop((int(w * 0.55), int(h * 0.88), w, h))
    rw, rh = reg.size
    px = reg.load()
    cnt = 0
    for yy in range(0, rh, 2):
        for xx in range(0, rw, 2):
            r, g, b = px[xx, yy]
            if b > 140 and (b - r) > 40 and (b - g) > 30:
                cnt += 1
    if cnt > 3:
        print('BLUE_FLAG', f, cnt)
print('SCAN_DONE files', total)
