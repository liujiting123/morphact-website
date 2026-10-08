// Without JavaScript, both benchmarks and direct figure links remain available.
const tabList = document.querySelector('[role="tablist"]');
const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));

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
  tab.addEventListener('keydown', (event) => {
    const index = tabs.indexOf(tab);
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectBenchmark(tabs[next]);
    tabs[next].focus();
  });
}

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
  document.querySelectorAll('main > section').forEach((section) => sectionObserver.observe(section));
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
