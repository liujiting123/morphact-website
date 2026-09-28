// Progressive enhancement: both benchmark summaries remain readable without JS.
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
