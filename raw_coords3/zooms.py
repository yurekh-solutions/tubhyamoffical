# Diagnostic zooms for the 5 chiffon dress watermark fix.
# 1) raw 43 top-left (Xia watermark vs navy model overlap)
# 2) current dr-027 output top-left (kill damage)
# 3) current outputs top strips (lips QA, all 5)
# 4) current outputs bottom-right corners (white ghost QA)
# 5) inpaint experiment: raw cleaned with cv2.inpaint, crops to compare
import os
from PIL import Image, ImageDraw

ROOT = r'c:\Users\yurek\OneDrive\Desktop\tubhyam\tubhyamoffical'
RAW3 = os.path.join(ROOT, 'raw_coords3', 'raw3')
OUT = os.path.join(ROOT, 'public', 'images', 'products')
RC = os.path.join(ROOT, 'raw_coords3')
NAMES = ['dr-026-white', 'dr-027-navy-pink', 'dr-028-black', 'dr-029-skyblue', 'dr-030-powderblue']
RIDS = ['00', '43', '01', '03', '04']

def save(im, name, scale=1.0):
    if scale != 1.0:
        im = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
    p = os.path.join(RC, name)
    im.save(p)
    print('SAVED', name, im.size)

# 1) raw 43 top-left
raw43 = Image.open(os.path.join(RAW3, '43.jpg')).convert('RGB')
print('raw43', raw43.size)
save(raw43.crop((0, 0, 560, 340)), 'z_raw43_tl.png', 1.4)

# 2) current dr-027 top-left
fin43 = Image.open(os.path.join(OUT, 'dr-027-navy-pink.jpg')).convert('RGB')
print('fin43', fin43.size)
save(fin43.crop((0, 0, 560, 300)), 'z_fin43_tl.png', 1.4)

# 3) top strips of all finals
cells = []
for n in NAMES:
    im = Image.open(os.path.join(OUT, n + '.jpg')).convert('RGB')
    w, h = im.size
    s = im.crop((w // 2 - 240, 0, w // 2 + 240, 200))
    cells.append((n, s.resize((int(s.width * 1.4), int(s.height * 1.4)), Image.LANCZOS)))
W = sum(s.width for _, s in cells) + 4 * len(cells)
H = max(s.height for _, s in cells) + 16
M = Image.new('RGB', (W, H), (255, 255, 255))
d = ImageDraw.Draw(M)
x = 0
for n, s in cells:
    M.paste(s, (x, 0)); d.text((x + 4, H - 13), n, fill=(0, 0, 0)); x += s.width + 4
save(M, 'z_fins_tops.png')

# 4) bottom-right corners of all finals
cells = []
for n in NAMES:
    im = Image.open(os.path.join(OUT, n + '.jpg')).convert('RGB')
    w, h = im.size
    cells.append((n, im.crop((int(w * 0.42), int(h * 0.70), w, h))))
W = sum(s.width for _, s in cells) + 4 * len(cells)
H = max(s.height for _, s in cells) + 16
M = Image.new('RGB', (W, H), (255, 255, 255))
d = ImageDraw.Draw(M)
x = 0
for n, s in cells:
    M.paste(s, (x, 0)); d.text((x + 4, H - 13), n, fill=(0, 0, 0)); x += s.width + 4
save(M, 'z_fins_bottom.png')

# 5) inpaint experiment
try:
    import numpy as np
    import cv2
    print('cv2 OK', cv2.__version__)
    have = True
except Exception as e:
    print('cv2 FAIL', repr(e))
    have = False

def mask_watermarks(raw):
    Wr, Hr = raw.size
    ap = raw.load()
    m = Image.new('L', (Wr, Hr), 0)
    mp = m.load()
    n_blue = n_rg = 0
    # bottom-right blue W#XFLYQ + white glow (dilate 6)
    for yy in range(int(Hr * 0.7), Hr):
        for xx in range(int(Wr * 0.3), Wr):
            r, g, b = ap[xx, yy]
            if b > 140 and b - r > 40 and b - g > 30:
                n_blue += 1
                for dy in range(-6, 7):
                    for dx in range(-6, 7):
                        X, Y = xx + dx, yy + dy
                        if 0 <= X < Wr and 0 <= Y < Hr:
                            mp[X, Y] = 255
    # top-left red/gold Xia (dilate 3)
    for yy in range(0, int(Hr * 0.17)):
        for xx in range(0, int(Wr * 0.36)):
            r, g, b = ap[xx, yy]
            if (r > 120 and r - g > 55 and r - b > 45) or (r > 150 and 110 < g < 190 and b < 125 and r - b > 60):
                n_rg += 1
                for dy in range(-3, 4):
                    for dx in range(-3, 4):
                        X, Y = xx + dx, yy + dy
                        if 0 <= X < Wr and 0 <= Y < Hr:
                            mp[X, Y] = 255
    print('mask seeds blue', n_blue, 'red/gold', n_rg)
    return np.array(m)

if have:
    clean = {}
    for rid in RIDS:
        raw = Image.open(os.path.join(RAW3, rid + '.jpg')).convert('RGB')
        m = mask_watermarks(raw)
        arr = cv2.inpaint(np.array(raw), m, 4, cv2.INPAINT_TELEA)
        ci = Image.fromarray(arr)
        clean[rid] = ci
        print('inpainted', rid)
    save(clean['43'].crop((0, 0, 560, 340)), 'z_inp43_tl.png', 1.4)
    save(raw43.crop((760, 1235, 1080, 1495)), 'z_raw43_br.png', 2.0)
    save(clean['43'].crop((760, 1235, 1080, 1495)), 'z_inp43_br.png', 2.0)
    cells = []
    for rid in RIDS:
        im = clean[rid]
        w, h = im.size
        cells.append((rid, im.crop((int(w * 0.42), int(h * 0.70), w, h))))
    W = sum(s.width for _, s in cells) + 4 * len(cells)
    H = max(s.height for _, s in cells) + 16
    M = Image.new('RGB', (W, H), (255, 255, 255))
    d = ImageDraw.Draw(M)
    x = 0
    for n, s in cells:
        M.paste(s, (x, 0)); d.text((x + 4, H - 13), n, fill=(0, 0, 0)); x += s.width + 4
    save(M, 'z_inp_bottom.png')
print('ALL DONE')
