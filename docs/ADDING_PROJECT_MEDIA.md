# Project footage

Put real gameplay clips and screenshots here, one folder per project id:

    public/media/dottie/hit-vfx.mp4
    public/media/dottie/combo.png

Then list them in `src/data/projects.ts` on that project:

    media: [
      { type: 'video', src: '/media/dottie/hit-vfx.mp4', caption: 'Hitstop + aura shader on a heavy hit' },
      { type: 'image', src: '/media/dottie/combo.png', caption: 'Afterimage trail during a combo' },
    ],

The first item becomes the cover on the start screen, game cards and case study.
Keep clips short (5–15 s), muted, MP4 (H.264), around 720p and under ~5 MB.
