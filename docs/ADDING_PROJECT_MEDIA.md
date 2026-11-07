# Project footage

Put real gameplay clips and screenshots here, one folder per project id:

    public/media/dottie/hit-vfx.mp4
    public/media/dottie/combo.png

Then list them in `src/data/projects.ts` on that project:

    media: [
      { type: 'video', src: 'media/dottie/hit-vfx.mp4', caption: 'Hitstop + aura shader on a heavy hit' },
      { type: 'image', src: 'media/dottie/combo.png', caption: 'Afterimage trail during a combo' },
    ],

The first item becomes the cover on the start screen, game cards and case study.
Keep clips short (5–15 s), muted, MP4 (H.264), around 720p and under ~5 MB.

## Convention used on this site

- `media/<id>/cover.mp4` + `cover.jpg`: 8 s silent 720p loop, shown on cards and the start screen (first media entry).
- `media/<id>/<name>.mp4` + `<name>.jpg`: the full recording at 1080p, shown with controls on the case study page.
- Keep every file under 100 MB (GitHub's hard limit). Trim long recordings to the best few minutes.

Source recordings live in `C:\Users\Vinay sankar\Videos\Screen Recordings`. Encode with ffmpeg:

    # full video, 1080p, high quality
    ffmpeg -i IN.mp4 -vf "scale=-2:1080:flags=lanczos" -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart OUT.mp4
    # 8 s cover loop starting at 30 s, silent, 720p
    ffmpeg -ss 30 -t 8 -i IN.mp4 -an -vf "scale=-2:720:flags=lanczos" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart cover.mp4
    # poster frame
    ffmpeg -i OUT.mp4 -frames:v 1 -q:v 3 OUT.jpg
