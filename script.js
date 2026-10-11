// The manuscript tables are the single source of numbers for the interactive charts.
// Without JavaScript, both benchmarks, their tables, and the media links remain available.
const escapeText = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const signed = (value) => `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toFixed(2)}%`;
const benchmarkData = new Map();
for (const table of document.querySelectorAll('.results-table:not(.ablation-table)')) {
  const labels = [...table.querySelectorAll('thead th')].slice(2,7).map(cell => cell.textContent.trim());
  const backbones = [...table.tBodies].map(group => {
    const rows = [...group.rows];
    const scores = row => [...row.querySelectorAll('.suite-cell, .mean-cell')].map(cell => Number(cell.textContent.trim()));
    return {name: rows[0].querySelector('.backbone-cell').innerHTML, text: rows[0].querySelector('.backbone-cell').textContent, baseline: scores(rows[0]), ours: scores(rows[1])};
  });
  benchmarkData.set(table.dataset.benchmark, {labels, backbones});
}
let chartMetric = 'success';
function benchmarkSVG(data, model, metric) {
  const plotWidth = 232;
  const differences = data.backbones.flatMap(m => m.ours.map((v,i) => v-m.baseline[i]));
  const min = metric === 'success' ? 0 : Math.min(0, Math.floor(Math.min(...differences)));
  const max = metric === 'success' ? 100 : Math.ceil(Math.max(...differences)/10)*10;
  const x = value => (value-min)/(max-min)*plotWidth;
  const ticks = metric === 'success' ? [0,50,100] : [min, ...(min < 0 ? [0] : []), max/2, max];
  const title = `${model.text}: ${metric === 'success' ? 'success rate' : 'absolute gain over baseline'}`;
  const description = data.labels.map((label,i) => `${label}: baseline ${model.baseline[i].toFixed(2)}%, MorphAct ${model.ours[i].toFixed(2)}%, gain ${signed(model.ours[i]-model.baseline[i])}`).join('. ');
  let svg = `<svg class="benchmark-chart" viewBox="-8 -2 307 284" role="img" aria-label="${escapeText(title+'. '+description)}"><title>${escapeText(title)}</title><desc>${escapeText(description)}</desc>`;
  svg += '<rect x="-7" y="206" width="306" height="49" rx="3" fill="#f0f4ec"/>';
  for (const tick of ticks) {
    svg += `<line class="${tick === 0 ? 'chart-zero' : 'chart-gridline'}" x1="${x(tick)}" x2="${x(tick)}" y1="17" y2="255"/>`;
    svg += `<text class="tick-label" x="${x(tick)}" y="275" text-anchor="${tick === min ? 'start' : tick === max ? 'end' : 'middle'}">${tick}${metric === 'success' ? '%' : ''}</text>`;
  }
  data.labels.forEach((label,i) => {
    const y = i*52;
    const gain = model.ours[i]-model.baseline[i];
    svg += `<g><title>${escapeText(`${label}: ${model.baseline[i].toFixed(2)}% → ${model.ours[i].toFixed(2)}% (${signed(gain)})`)}</title><text class="suite-label" x="0" y="${y+10}"${i === 4 ? ' font-weight="600"' : ''}>${escapeText(label)}</text><text class="gain-label${gain < -0.005 ? ' negative-label' : ''}" x="290" y="${y+10}" text-anchor="end">${signed(gain)}</text>`;
    if (metric === 'success') {
      svg += `<rect class="bar-baseline" x="0" y="${y+19}" width="${x(model.baseline[i])}" height="7" rx="1"/><text class="bar-value" x="290" y="${y+26}" text-anchor="end">${model.baseline[i].toFixed(2)}</text><rect class="bar-ours" x="0" y="${y+31}" width="${x(model.ours[i])}" height="9" rx="1"/><text class="bar-value ours-value" x="290" y="${y+40}" text-anchor="end">${model.ours[i].toFixed(2)}</text>`;
    } else {
      svg += `<rect class="${gain < -0.005 ? 'bar-negative' : 'bar-ours'}" x="${Math.min(x(0),x(gain))}" y="${y+23}" width="${Math.abs(x(gain)-x(0))}" height="13" rx="1"/>`;
      if (Math.abs(gain) < 0.005) svg += `<circle cx="${x(0)}" cy="${y+29.5}" r="2.5" fill="#7f8e79"/>`;
    }
    svg += '</g>';
  });
  return svg+'</svg>';
}
function renderBenchmarks() {
  for (const [key,data] of benchmarkData) {
    const container = document.querySelector(`[data-charts="${key}"]`);
    container.innerHTML = data.backbones.map(model => `<article class="backbone-chart"><div class="backbone-heading"><h4>${model.name}</h4><span class="mean-gain">${signed(model.ours[4]-model.baseline[4])}</span></div><p class="backbone-summary">${model.baseline[4].toFixed(2)}<span class="score-arrow" aria-hidden="true">→</span><strong>${model.ours[4].toFixed(2)}%</strong><small>${data.labels[4].toLowerCase()} success</small></p>${benchmarkSVG(data,model,chartMetric)}</article>`).join('');
    container.hidden = false;
    document.querySelector(`#panel-${key} .legend`).innerHTML = chartMetric === 'success'
      ? '<span class="baseline-key">Baseline</span><span class="ours-key">+ MorphAct</span>'
      : '<span class="ours-key">Improvement</span><span class="negative-key">Decline</span>';
  }
  document.querySelector('#results > .chart-note').textContent = chartMetric === 'success' ? 'Success rates use a 0–100% scale. Displayed gains are absolute success-rate differences.' : 'Gain scales are shared across backbones within each benchmark. Gains are absolute success-rate differences; negative changes extend left of zero.';
}
renderBenchmarks();
const metricControls = document.querySelector('.chart-modes');
metricControls.hidden = false;
metricControls.addEventListener('click', event => {
  const button = event.target.closest('[data-metric]');
  if (!button) return;
  chartMetric = button.dataset.metric;
  metricControls.querySelectorAll('button').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
  renderBenchmarks();
});
const tabList = document.querySelector('[role="tablist"]');
const tabs = [...tabList.querySelectorAll('[role="tab"]')];
function selectBenchmark(selectedTab) {
  for (const tab of tabs) {
    const active = tab === selectedTab;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  }
}
tabList.hidden = false;
selectBenchmark(tabs[0]);
for (const tab of tabs) {
  tab.addEventListener('click', () => selectBenchmark(tab));
  tab.addEventListener('keydown', event => {
    const index = tabs.indexOf(tab);
    let next;
    if (event.key === 'ArrowRight') next = (index+1)%tabs.length;
    else if (event.key === 'ArrowLeft') next = (index-1+tabs.length)%tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length-1;
    else return;
    event.preventDefault();
    selectBenchmark(tabs[next]);
    tabs[next].focus();
  });
}
const ablationTable = document.querySelector('.ablation-table');
const ablationRows = [...ablationTable.tBodies[0].rows];
const ablationSelect = document.getElementById('ablation-suite');
const ablationChart = document.getElementById('ablation-chart');
function renderAblation() {
  const index = Number(ablationSelect.value);
  const suite = ablationSelect.selectedOptions[0].textContent;
  ablationChart.innerHTML = ablationRows.map((row,i) => {
    const name = row.querySelector('th').childNodes[0].textContent.trim();
    const score = Number(row.querySelectorAll('td')[index].textContent);
    return `<div class="ablation-row${i === 0 ? ' ours' : ''}" aria-label="${escapeText(`${name}, ${suite}: ${score.toFixed(2)}%`)}"><span class="variant-name">${escapeText(name)}</span><span class="ablation-track" aria-hidden="true"><span class="ablation-fill" style="width:${score}%"></span></span><span class="ablation-value">${score.toFixed(2)}</span></div>`;
  }).join('')+'<div class="ablation-axis" aria-hidden="true"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div>';
  ablationChart.hidden = false;
}
ablationSelect.closest('label').hidden = false;
ablationSelect.addEventListener('change', renderAblation);
renderAblation();

const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of navLinks) {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-15% 0px -60% 0px' });
  document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));
}

const figureDialog = document.getElementById('figure-dialog');
if (typeof figureDialog.showModal === 'function') {
  const canvas = figureDialog.querySelector('.dialog-canvas');
  const image = canvas.querySelector('img');
  const title = figureDialog.querySelector('#figure-dialog-title');
  const zoomButton = figureDialog.querySelector('[data-zoom]');
  const originalLink = figureDialog.querySelector('[data-original]');
  let previousOverflow = '';

  function setZoom(zoomed) {
    canvas.classList.toggle('is-zoomed', zoomed);
    image.style.setProperty('--zoom-width', `${Math.min(image.naturalWidth, Math.max(canvas.clientWidth * 2, 1200))}px`);
    zoomButton.setAttribute('aria-pressed', String(zoomed));
    zoomButton.setAttribute('aria-label', zoomed ? 'Fit figure to window' : 'Zoom in');
    if (!zoomed) canvas.scrollTo(0, 0);
  }

  for (const link of document.querySelectorAll('[data-lightbox]')) {
    link.addEventListener('click', (event) => {
      // Preserve new-tab and download gestures on the underlying image link.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      title.textContent = link.dataset.figureTitle;
      originalLink.href = link.href;
      previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      figureDialog.showModal();
      setZoom(false);
    });
  }
  zoomButton.addEventListener('click', () => setZoom(!canvas.classList.contains('is-zoomed')));
  image.addEventListener('click', () => setZoom(!canvas.classList.contains('is-zoomed')));
  figureDialog.querySelector('[data-close]').addEventListener('click', () => figureDialog.close());
  figureDialog.addEventListener('click', (event) => {
    if (event.target !== figureDialog) return;
    const bounds = figureDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) figureDialog.close();
  });
  figureDialog.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow;
    setZoom(false);
  });
}

// Task links remain direct video links when native dialogs are unavailable.
const videoDialog = document.getElementById('video-dialog');
if (typeof videoDialog.showModal === 'function') {
  const player = videoDialog.querySelector('video');
  let videoPreviousOverflow = '';
  for (const link of document.querySelectorAll('[data-video]')) {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      document.getElementById('demo-video').pause();
      videoDialog.querySelector('#video-dialog-title').textContent = link.dataset.task;
      videoDialog.querySelector('[data-video-description]').textContent = link.dataset.description;
      player.poster = link.dataset.poster;
      player.src = link.href;
      player.setAttribute('aria-label', `${link.dataset.task}: paired MorphAct and pi 0.5 trials`);
      videoPreviousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      videoDialog.showModal();
      player.play().catch(() => { /* Native controls allow playback if autoplay is restricted. */ });
    });
  }
  videoDialog.querySelector('[data-close-video]').addEventListener('click', () => videoDialog.close());
  videoDialog.addEventListener('click', event => {
    if (event.target !== videoDialog) return;
    const bounds = videoDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) videoDialog.close();
  });
  videoDialog.addEventListener('close', () => {
    player.pause();
    player.removeAttribute('src');
    player.load();
    document.documentElement.style.overflow = videoPreviousOverflow;
  });
}

// Keep the initial light poster clear; reveal native controls when playback starts.
const heroPlayer = document.getElementById('demo-video');
const heroPlay = document.querySelector('.hero-play');
heroPlayer.controls = false;
heroPlay.hidden = false;
heroPlay.addEventListener('click', () => {
  heroPlayer.controls = true;
  heroPlay.hidden = true;
  heroPlayer.focus();
  heroPlayer.play().catch(() => { heroPlay.hidden = false; });
});
heroPlayer.addEventListener('play', () => {
  heroPlayer.controls = true;
  heroPlay.hidden = true;
});
