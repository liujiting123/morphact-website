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

The homepage introduces contextual adaptation and the paper method figure, then presents simulation results, ablations, and real-world experiments. Prose and compact equations use a reading column; paper figures, tables, and demonstrations use a wider canvas. Longer training equations are in a disclosure. Equations use native MathML and need no external rendering library. Keep their accessible `aria-label` text consistent with the mathematical markup when editing them.

The arXiv and Code controls are deliberately disabled and have no destination. Replace each with an anchor when the corresponding public URL is ready. Author order, affiliation numbers, equal-contribution marks, and corresponding-author marks are maintained in the `.paper-credits` block of `index.html`. Institution logo sources are listed in `assets/institutions/README.md`.

Figures and results follow the current local manuscript at `/Users/liujiting/论文写作/Morphact_ICLR_27` (verified 2026-10-11). The simulation tables reproduce `sections/experiments.tex`, including all four suites or difficulty groups, the overall score, and reported variance. MorphAct scores average three selected evaluations. Each LIBERO evaluation covers 40 tasks with 50 rollouts per task; each Meta-World evaluation covers 50 tasks with 20 rollouts per task. Both overall scores give equal weight to the four groups. Gains are absolute differences in success rate, displayed with `%`.

The six X-VLA ablations reproduce `sections/analysis.tex`. Their comparisons distinguish generation conditions (Constant / Task-ID / current context), module coverage, and the features used to condition action-side generation. In Unadapted, action prediction still receives adapted VLM features; only the action generator uses pre-adaptation features.

The method equations follow `sections/method.tex`. Factors use the row-vector convention: A has shape input-width × rank and B has shape rank × output-width. Both generator outputs and the adapted action condition are refreshed once per replanning observation and reused across the native solver evaluations for that chunk. Training uses the native action objective; trainable parameters include the generators, state projection, and projectors retained by the adaptation configuration.

The teaser is a direct 144-dpi render of the manuscript figure `figures/morphact-teaser.pdf` (3199 × 1106 pixels, updated 2026-10-08). The matching original PDF is included in `assets/` and linked from the figure caption.

`assets/morphact-method.png` is a direct 144-dpi render of the current `figures/method.pdf` (2662 × 1331 pixels). Its original PDF is included as `assets/morphact-method.pdf`. The figure includes joint learning and chunk-level reuse; the older `morphact-overview.png` is retained but is no longer displayed.

## Real-world demo

The 63-second real-world demo appears immediately below the paper header. `assets/morphact-demo-light-v14.mp4` is the 1080p, 30 fps light edition; its matching JPEG poster shows the paired robots at 6 seconds. The light edition recomposes the v14 timeline on the page's cream background, with green/purple titles. Robot footage receives no color filter. Completion markers, playback speeds, detail replays, and transition timing are preserved. The opening method segment uses the current paper figure. Original dark exports remain available in `assets/`.

The real-world section uses the manuscript names: Sort Letters, Deliver Water, Sort Hardware, and Cabinet Storage. Their paired 9-second overview clips are 720p encodes of the light v14 segments. Asset sources and playback speeds are recorded in `assets/demos/README.md`. Each pair contains separate MorphAct and π0.5 trials with equal playback speed within that task. Success rates reproduce the matching four tasks in `sections/experiments.tex`, each evaluated over 50 physical rollouts per method; they do not describe only the displayed clip.

`tools/render_light_demo.py` rebuilds the light edition from the existing local v12/v14 projects and current manuscript. It requires an existing FFmpeg and Python/Pillow runtime. Its verification decodes all five outputs and compares the recomposed footage regions with the source. Review intermediates are written outside the site in `/tmp/morphact-light-demo`.

To update the video, add the new video and poster assets and update `src` and `poster` on `#demo-video` in `index.html`. Use versioned asset names so visitors receive the current video. Keep `controls` and `playsinline`; playback starts only when the visitor chooses to play. The video uses `object-fit: contain`, so the recording is shown without cropping.
