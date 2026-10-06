# Vetoriza a marca completa (_arquivo/site-oficial/marca/marca-imigrantes.png) em SVG por contornos (OpenCV).
# A cinza é engordada um pouco para passar por baixo da vermelha (sem fresta na emenda).
# uso: python tools/trace-marca.py <png> <saida.svg>
import cv2, numpy as np, sys
src = sys.argv[1]; out = sys.argv[2]
im = cv2.imread(src, cv2.IMREAD_UNCHANGED)
P = 10  # margem: a seta cinza encosta na borda do PNG
im = cv2.copyMakeBorder(im, P, P, P, P, cv2.BORDER_CONSTANT, value=(0, 0, 0, 0))
print('shape', im.shape)
if im.shape[2] == 4:
    a = im[:, :, 3].astype(np.float32) / 255
    rgb = im[:, :, :3].astype(np.float32) * a[..., None] + 255 * (1 - a[..., None])
else:
    rgb = im[:, :, :3].astype(np.float32)
S = 8
big = cv2.resize(rgb, None, fx=S, fy=S, interpolation=cv2.INTER_CUBIC)
b, g, r = big[..., 0], big[..., 1], big[..., 2]
red = ((r - np.maximum(g, b)) > 60).astype(np.uint8) * 255
gray = ((np.abs(r - g) < 25) & (np.abs(g - b) < 25) & (r < 215) & (r > 60)).astype(np.uint8) * 255
def paths(mask, name):
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    mask = cv2.GaussianBlur(mask, (9, 9), 0); _, mask = cv2.threshold(mask, 127, 255, 0)
    cs, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    cs = [c for c in cs if cv2.contourArea(c) > 2000 * S]
    d = ''
    for c in cs:
        c = c[:, 0, :].astype(np.float64)
        # suaviza o contorno (janela circular) preservando as pontas das setas
        k = 30; w = np.hanning(2 * k + 1); w /= w.sum()
        sm = np.stack([np.convolve(np.r_[c[-k:, i], c[:, i], c[:k, i]], w, 'valid') for i in (0, 1)], 1)
        corner = cv2.approxPolyDP(c.astype(np.int32), 1.6 * S, True)[:, 0, :]
        sharp = []
        for i, q in enumerate(corner):
            a, z = corner[i - 1] - q, corner[(i + 1) % len(corner)] - q
            cosang = (a @ z) / (np.hypot(*a) * np.hypot(*z) + 1e-9)
            if cosang > -0.55: sharp.append(q)   # ângulo < ~123°: quina de verdade
        for q in sharp:  # nas quinas, volta ao contorno original
            dd = np.hypot(*(c - q).T); j = dd.argmin()
            for o in range(-k, k + 1): sm[(j + o) % len(c)] = c[(j + o) % len(c)] * (1 - abs(o) / (k + 1)) + sm[(j + o) % len(c)] * abs(o) / (k + 1)
        c = cv2.approxPolyDP(sm.astype(np.float32).reshape(-1, 1, 2), 0.06 * S, True)[:, 0, :] / S - P
        d += 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in c) + 'Z '
    print(name, len(cs), 'contours')
    return d
# o PNG oficial corta a base da seta cinza reta (linha 179). A borda de baixo é um arco de círculo
# (ajustado nas linhas 170–179: centro 74,122.6, raio 59.5); completa o arco até o fim (y ≈ 182)
arc = np.zeros_like(gray); cv2.circle(arc, (int((74 + P) * S), int((122.6 + P) * S)), int(59.5 * S), 255, -1)
arc[: (172 + P) * S] = 0
gray = gray | arc
# a cinza cresce só para dentro da vermelha (que é desenhada por cima): a borda externa não muda
gray = cv2.dilate(gray, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (4 * S, 4 * S))) & (gray | red)
dr, dg = paths(red, 'red'), paths(gray, 'gray')
H, W = im.shape[0] - 2 * P + 3, im.shape[1] - 2 * P
# degradês do original: a dobra da vermelha escurece embaixo à esquerda; a cinza clareia para a ponta
open(out, 'w').write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">
<defs>
<linearGradient id="mR" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#7A0104"/><stop offset=".38" stop-color="#BE0205"/><stop offset="1" stop-color="#E1060C"/></linearGradient>
<linearGradient id="mG" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#6E7176"/><stop offset=".55" stop-color="#8D9095"/><stop offset="1" stop-color="#A3A6AB"/></linearGradient>
</defs>
<path id="seta-cinza" fill="url(#mG)" d="{dg.strip()}"/>
<path id="seta-vermelha" fill="url(#mR)" d="{dr.strip()}"/>
</svg>
''')
