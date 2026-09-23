# Top-of-image zooms of the 5 finals -> verify lips-level crop per image.
import os
from PIL import Image

ROOT = r'c:\Users\yurek\OneDrive\Desktop\tubhyam\tubhyamoffical'
OUT = os.path.join(ROOT, 'public', 'images', 'products')
RC = os.path.join(ROOT, 'raw_coords3')
jobs = [
    ('dr-026-white', 350, 730, 2.0),
    ('dr-028-black', 350, 730, 2.0),
    ('dr-029-skyblue', 350, 730, 2.0),
    ('dr-030-powderblue', 350, 730, 2.0),
]
i = 0
for n, x0, x1, sc in jobs:
    im = Image.open(os.path.join(OUT, n + '.jpg')).convert('RGB')
    s = im.crop((x0, 0, x1, 200))
    s = s.resize((int(s.width * sc), int(s.height * sc)), Image.LANCZOS)
    p = os.path.join(RC, 'z_top' + str(i) + '.png')
    s.save(p)
    print('SAVED', p, s.size, n, (x0, x1))
    i += 1
print('DONE')
