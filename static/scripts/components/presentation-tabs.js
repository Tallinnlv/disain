/**
 * Tabs
 *
 * Progressive enhancement for `.tds-tabs`: WAI-ARIA tabs with manual
 * activation (Left/Right/Home/End move focus, Enter/Space/click select), plus
 * scroll arrows and drag-to-scroll for `.tds-tabs__list--scrollable`.
 * Tabs with `aria-disabled="true"` stay focusable but cannot be selected.
 */
(function () {
  const VISIBLE = 'tds-tabs__scroll-button--visible';

  const initTabs = (tabsEl) => {
    if (tabsEl.dataset.tabsInitialised) return;
    tabsEl.dataset.tabsInitialised = 'true';

    const list = tabsEl.querySelector('.tds-tabs__list');
    const tabs = list ? Array.from(list.querySelectorAll('[role="tab"]')) : [];
    if (tabs.length === 0) return;

    const isDisabled = (tab) => tab.getAttribute('aria-disabled') === 'true';
    const panelFor = (tab) =>
      document.getElementById(tab.getAttribute('aria-controls') || '');
    const selectedTab = () =>
      tabs.find((tab) => tab.getAttribute('aria-selected') === 'true');

    const selectTab = (tab) => {
      if (isDisabled(tab)) return;
      tabs.forEach((other) => {
        const selected = other === tab;
        other.setAttribute('aria-selected', selected ? 'true' : 'false');
        other.tabIndex = selected ? 0 : -1;
        const panel = panelFor(other);
        if (panel) panel.hidden = !selected;
      });
    };

    // Exactly one tab is in the Tab order (the selected one), without
    // changing which tab the markup says is selected.
    const tabbable =
      selectedTab() ||
      tabs.find((tab) => tab.getAttribute('tabindex') === '0') ||
      tabs[0];
    tabs.forEach((tab) => {
      tab.tabIndex = tab === tabbable ? 0 : -1;
    });

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(tab));

      tab.addEventListener('keydown', (event) => {
        let next;
        switch (event.key) {
          case 'ArrowRight':
            next = (index + 1) % tabs.length;
            break;
          case 'ArrowLeft':
            next = (index - 1 + tabs.length) % tabs.length;
            break;
          case 'Home':
            next = 0;
            break;
          case 'End':
            next = tabs.length - 1;
            break;
          case 'Enter':
          case ' ':
            event.preventDefault();
            selectTab(tab);
            return;
          default:
            return;
        }
        event.preventDefault();
        tabs[next].focus();
      });
    });

    // Scrollable tabs: arrows and drag-to-scroll.
    if (!list.classList.contains('tds-tabs__list--scrollable')) return;

    const leftArrow = tabsEl.querySelector('.tds-tabs__scroll-left');
    const rightArrow = tabsEl.querySelector('.tds-tabs__scroll-right');

    const setArrow = (arrow, otherArrow, visible) => {
      if (!arrow) return;
      arrow.classList.toggle(VISIBLE, visible);
      // An arrow that disappears while focused must not drop focus on <body>.
      if (!visible && document.activeElement === arrow) {
        const fallback =
          otherArrow && otherArrow.classList.contains(VISIBLE)
            ? otherArrow
            : selectedTab() || tabs[0];
        fallback.focus();
      }
    };

    const updateArrows = () => {
      const maxScroll = list.scrollWidth - list.clientWidth;
      const canScroll = maxScroll > 1;
      setArrow(leftArrow, rightArrow, canScroll && list.scrollLeft > 1);
      setArrow(
        rightArrow,
        leftArrow,
        canScroll && list.scrollLeft < maxScroll - 1,
      );
    };

    // Update once scrolling (including smooth scrolling) has finished.
    // `scrollend` is not supported everywhere, so a debounced `scroll`
    // listener is the fallback.
    let scrollTimer;
    list.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updateArrows, 150);
    });
    list.addEventListener('scrollend', () => {
      clearTimeout(scrollTimer);
      updateArrows();
    });
    window.addEventListener('resize', updateArrows);
    updateArrows();

    const scrollBy = (delta) => {
      list.scrollTo({ left: list.scrollLeft + delta, behavior: 'smooth' });
    };
    if (leftArrow) leftArrow.addEventListener('click', () => scrollBy(-100));
    if (rightArrow) rightArrow.addEventListener('click', () => scrollBy(100));

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    list.addEventListener('mousedown', (event) => {
      isDragging = true;
      startX = event.pageX - list.offsetLeft;
      startScrollLeft = list.scrollLeft;
      list.classList.add('dragging');
    });

    const stopDragging = () => {
      isDragging = false;
      list.classList.remove('dragging');
    };
    list.addEventListener('mouseleave', stopDragging);
    list.addEventListener('mouseup', stopDragging);

    list.addEventListener('mousemove', (event) => {
      if (!isDragging) return;
      event.preventDefault();
      const x = event.pageX - list.offsetLeft;
      list.scrollLeft = startScrollLeft - (x - startX) * 2;
    });
  };

  document.querySelectorAll('.tds-tabs').forEach(initTabs);
})();
