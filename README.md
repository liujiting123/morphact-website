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

## Add the real-world demo

The featured demo appears immediately below the paper header and above the teaser. Its 16:9 stage currently shows a clearly labeled placeholder.

When the final video is ready, set `src` (and optionally `poster`) on `#demo-video` in `index.html`, remove its `hidden` attribute, and remove `.demo-placeholder` and `.demo-status`. Keep `controls` and `playsinline`; playback starts only when the visitor chooses to play. The video uses `object-fit: contain`, so the recording is shown without cropping.
