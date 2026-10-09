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

- `index.html`: research narrative, native MathML equations, task videos, result values, and resource controls.
- `styles.css`: article typography, figure and equation layouts, and basic responsive styling.
- `script.js`: keyboard-accessible benchmark tabs, section navigation, and figure zoom. Both benchmarks and direct image links remain available without JavaScript.
- `assets/`: manuscript figures, emblem, institution logos, and video exports.

The homepage follows the method from changing adaptation demands to generated low-rank factors, representation-coupled generation, learning, and chunk-level reuse. It uses a narrow reading column with wider figures, equations, and demonstrations. Equations use native MathML and need no external rendering library. Keep their accessible `aria-label` text consistent with the mathematical markup when editing them.

The arXiv and Code controls are deliberately disabled and have no destination. Replace each with an anchor when the corresponding public URL is ready. Author order, affiliation numbers, equal-contribution marks, and corresponding-author marks are maintained in the `.paper-credits` block of `index.html`. Institution logo sources are listed in `assets/institutions/README.md`.

Figures and evaluation settings follow the MorphAct manuscript, specifically `sections/experiments.tex` and its `figures/` directory. Simulation scores match the updated results table in `MorphAct/Code/README.md` (2026-10-09). LIBERO uses 50 rollouts per task and averages the four suite success rates. Meta-World uses 20 rollouts per task and an equal-weight average of the four difficulty groups. Gains are percentage points.

The method equations follow `sections/method.tex` in the arXiv manuscript. Factors use the row-vector convention: A has shape input-width × rank and B has shape rank × output-width. Both generator outputs and the adapted action condition are refreshed once per replanning observation and reused across the native solver evaluations for that chunk. Training uses the native action objective; trainable parameters include the generators, state projection, and projectors retained by the adaptation configuration.

The teaser is a direct 144-dpi render of the manuscript figure `figures/morphact-teaser.pdf` (3199 × 1106 pixels, updated 2026-10-08). The matching original PDF is included in `assets/` and linked from the figure caption.

## Real-world demo

The 63-second real-world demo appears immediately below the paper header. `assets/morphact-demo-v14.mp4` is the 1080p, 30 fps video; `assets/morphact-demo-v14.jpg` is a frame extracted from it. The full video is a lossless remux of `MorphAct/Demos/demo-edit-v14/export/MorphAct_demo_v14_1080p.mp4` with MP4 metadata moved to the beginning for web playback.

The real-world section uses four bimanual tasks: Letter arrangement, Bottle handling, Object sorting, and Drawer storage. Their paired 9-second overview clips are 720p web encodes of the corresponding v14 segments. Asset sources and playback speeds are recorded in `assets/demos/README.md`. Each pair contains separate MorphAct and π0.5 trials with equal playback speed within that task. The page presents qualitative demonstrations without assigning them aggregate success rates from other tasks.

To update the video, add the new video and poster assets and update `src` and `poster` on `#demo-video` in `index.html`. Use versioned asset names so visitors receive the current video. Keep `controls` and `playsinline`; playback starts only when the visitor chooses to play. The video uses `object-fit: contain`, so the recording is shown without cropping.
