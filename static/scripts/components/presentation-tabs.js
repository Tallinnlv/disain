document.addEventListener('DOMContentLoaded', function () {
  const tabsContainer = document.querySelector('.tds-tabs__list');
  const tabs = Array.from(document.querySelectorAll('.tds-tabs__tab-button'));
  const panels = document.querySelectorAll('.tds-tabs__panel');
  const leftArrow = document.querySelector('.tds-tabs__scroll-left');
  const rightArrow = document.querySelector('.tds-tabs__scroll-right');

  if (!tabsContainer || tabs.length === 0) {
    console.error('Tabs container or buttons not found.');
    return;
  }

  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  const activateTab = (tab) => {
    const panelId = tab.getAttribute('aria-controls');

    tabs.forEach((t) => {
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });

    panels.forEach((panel) => panel.setAttribute('hidden', ''));

    // Select the active tab and show its panel
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    const panel = document.getElementById(panelId);
    if (panel) panel.removeAttribute('hidden');
    tab.focus();
  };

  const handleKeydown = (event) => {
    const { key } = event;
    const currentTab = event.target;
    const currentIndex = tabs.indexOf(currentTab);
    let newIndex;

    if (key === 'ArrowRight') {
      newIndex = (currentIndex + 1) % tabs.length;
    } else if (key === 'ArrowLeft') {
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (key === 'Enter' || key === ' ') {
      activateTab(currentTab);
      return;
    } else {
      return;
    }

    event.preventDefault();
    tabs[newIndex].focus();
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', handleKeydown);
  });

  const firstTab = tabs[0];
  if (firstTab) {
    firstTab.setAttribute('aria-selected', 'true');
    firstTab.setAttribute('tabindex', '0');
  }

  // Scrollable Tabs with Arrow Buttons
  if (tabsContainer.classList.contains('tds-tabs__list--scrollable')) {
    const checkArrows = () => {
      const isScrollable =
        tabsContainer.scrollWidth > tabsContainer.clientWidth;

      if (leftArrow && rightArrow) {
        const scrollLeftMax =
          tabsContainer.scrollWidth - tabsContainer.clientWidth;
        const isAtStart = tabsContainer.scrollLeft <= 0;
        const isAtEnd = tabsContainer.scrollLeft >= scrollLeftMax - 1;

        leftArrow.style.display = isScrollable && !isAtStart ? 'block' : 'none';
        rightArrow.style.display = isScrollable && !isAtEnd ? 'block' : 'none';
      }
    };

    tabsContainer.addEventListener('scroll', checkArrows);

    checkArrows();

    leftArrow?.addEventListener('click', () => {
      tabsContainer.scrollTo({
        left: tabsContainer.scrollLeft - 100,
        behavior: 'smooth',
      });
      checkArrows();
    });

    rightArrow?.addEventListener('click', () => {
      tabsContainer.scrollTo({
        left: tabsContainer.scrollLeft + 100,
        behavior: 'smooth',
      });
      checkArrows();
    });

    tabsContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - tabsContainer.offsetLeft;
      scrollLeft = tabsContainer.scrollLeft;
      tabsContainer.classList.add('dragging');
    });

    tabsContainer.addEventListener('mouseleave', () => {
      isDragging = false;
      tabsContainer.classList.remove('dragging');
    });

    tabsContainer.addEventListener('mouseup', () => {
      isDragging = false;
      tabsContainer.classList.remove('dragging');
    });

    tabsContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - tabsContainer.offsetLeft;
      const walk = (x - startX) * 2;
      tabsContainer.scrollLeft = scrollLeft - walk;
    });
  }
});
