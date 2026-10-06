#!/usr/bin/env bash
# build.sh — renderiza film.html e codifica o MP4 (BT.709, yuv420p), com ou sem desfoque e áudio.
#   bash build.sh preview            → out/preview.mp4   (1 amostra por quadro)
#   bash build.sh master             → out/vinheta.mp4      (4 subquadros por quadro = desfoque de movimento)
# Usa out/soundtrack.wav se existir.
set -euo pipefail
cd "$(dirname "$0")"
export PATH="/c/Users/Usuario/AppData/Local/Programs/Python/Python312:/c/Users/Usuario/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin:$PATH"
mode="${1:-preview}"
if [ "$mode" = master ]; then SUB=4; OUT=out/vinheta.mp4; CRF=14; else SUB=1; OUT=out/preview.mp4; CRF=18; fi
FR=out/frames-$mode
if [ "${2:-}" != --reuse ]; then rm -rf "$FR"; mkdir -p "$FR"; node render.mjs frames --page sting.html --sub $SUB --out "$FR"; fi
COLOR=(-pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv)
if [ $SUB -gt 1 ]; then
  VF="format=gbrpf32le,tmix=frames=$SUB,select='eq(mod(n\,$SUB)\,$((SUB-1)))',setpts=N/(60*TB),scale=out_color_matrix=bt709:out_range=tv,format=yuv420p"
  IN=(-framerate $((60*SUB)) -i "$FR/%06d.png")
else
  VF="scale=out_color_matrix=bt709:out_range=tv,format=yuv420p"
  IN=(-framerate 60 -i "$FR/%06d.png")
fi
ARGS=("${IN[@]}")
if [ -f out/soundtrack.wav ]; then ARGS+=(-i out/soundtrack.wav); fi
ARGS+=(-vf "$VF" -r 60 -c:v libx264 -preset slow -crf $CRF "${COLOR[@]}" -x264-params "colorprim=bt709:transfer=bt709:colormatrix=bt709")
if [ -f out/soundtrack.wav ]; then ARGS+=(-c:a aac -b:a 256k -ar 48000 -shortest); fi
ffmpeg -y -hide_banner -loglevel warning "${ARGS[@]}" -movflags +faststart "$OUT"
echo "→ $OUT"
