# Folha de contato de stills PNG: python tools-sheet.py <pasta> <saida.png> [largura] [colunas]
import sys, glob, os
from PIL import Image, ImageDraw, ImageFont
d, out = sys.argv[1], sys.argv[2]; W = int(sys.argv[3]) if len(sys.argv) > 3 else 480; cols = int(sys.argv[4]) if len(sys.argv) > 4 else 4
fs = sorted(glob.glob(os.path.join(d, 'f*.png'))); H = W * 9 // 16
sheet = Image.new('RGB', (cols * W, ((len(fs) + cols - 1) // cols) * (H + 22)), 'white'); dr = ImageDraw.Draw(sheet)
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGB').resize((W, H), Image.LANCZOS); x, y = (i % cols) * W, (i // cols) * (H + 22)
    sheet.paste(im, (x, y + 22)); n = int(os.path.basename(f)[1:6]); dr.text((x + 6, y + 4), f'f{n}  {n/60:.2f}s', fill='black')
sheet.save(out); print(out, sheet.size)
