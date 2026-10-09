# MorphAct project website

Static research page for **MorphAct: Contextual Parameterization of Vision–Language–Action Models**.

Website: https://liujiting123.github.io/morphact-website/

## Preview

No package installation or build step is needed. Serve this directory using an existing Python installation:

```bash
python3 -m http.server 8766 --bind 127.0.0.1
```

## Publish

GitHub Pages publishes the repository root on `main`. `.nojekyll` preserves the static files as written. Push changes to `main` to update the site.

## Edit

- `index.html`: content, result values, and resource controls.
- `styles.css`: responsive styling.
- `script.js`: keyboard-accessible benchmark tabs, section navigation, and figure zoom. Both benchmarks and direct image links remain available without JavaScript.
- `assets/`: original manuscript figures and emblem.

The arXiv and Code controls are deliberately disabled and have no destination. Replace each with an anchor when the corresponding public URL is ready. Author order, affiliation numbers, equal-contribution marks, and corresponding-author marks are maintained in the `.paper-credits` block of `index.html`. Institution logo sources are listed in `assets/institutions/README.md`.

Figures and reported numbers were transcribed from the MorphAct manuscript on 2026-09-28, specifically `sections/abstract.tex`, `sections/experiments.tex`, and its `figures/` directory. This page reports manuscript results; it does not independently validate experiments. Meta-World uses 20 rollouts per task and an equal-weight average of the four difficulty groups. Gains are percentage points.

The teaser is a direct 144-dpi render of the manuscript figure `figures/morphact-teaser.pdf` (3199 × 1106 pixels, updated 2026-10-08). The matching original PDF is included in `assets/` and linked from the figure caption.

## Real-world demo

The 63-second real-world demo appears immediately below the paper header. `assets/morphact-demo-v9.mp4` is the 1080p, 30 fps video; `assets/morphact-demo-v9.jpg` is its poster. The teaser belongs to the following core-idea section, after the motivation and explanation.

To update the video, add the new video and poster assets and update `src` and `poster` on `#demo-video` in `index.html`. Use versioned asset names so visitors receive the current video. Keep `controls` and `playsinline`; playback starts only when the visitor chooses to play. The video uses `object-fit: contain`, so the recording is shown without cropping.
