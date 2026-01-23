/**
 * Site-wide DOM cleanup transformer
 * Runs before and after block parsing to clean up Webflow-specific markup
 *
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element (typically document.body or main)
 * @param {Object} payload - { document, url, html, params }
 */
export default function transform(hookName, element, payload) {
  const { document } = payload;

  if (hookName === 'beforeTransform') {
    // Remove cookie banners, modals, popups (before any processing)
    const overlaySelectors = [
      '.cookie-banner',
      '.consent-banner',
      '[data-cookie]',
      '.modal',
      '.popup',
      '.overlay',
    ];
    overlaySelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => el.remove());
    });

    // Remove scripts, styles, noscript
    const scriptSelectors = ['script', 'style', 'noscript', 'link[rel="stylesheet"]'];
    scriptSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => el.remove());
    });

    // Remove Webflow-specific data attributes (but keep elements)
    const allElements = document.querySelectorAll('*');
    allElements.forEach((el) => {
      const attrs = [...el.attributes];
      attrs.forEach((attr) => {
        if (attr.name.startsWith('data-w-') || attr.name.startsWith('data-wf-')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    // Make hidden accordion/dropdown content visible for parsing
    // Webflow hides inactive tabs and dropdowns with aria-hidden
    const dropdownLists = document.querySelectorAll('.w-dropdown-list, .w-tab-pane');
    dropdownLists.forEach((el) => {
      el.removeAttribute('aria-hidden');
      el.style.removeProperty('display');
    });
  }

  if (hookName === 'afterTransform') {
    // Remove navigation elements AFTER block parsing
    const navSelectors = [
      '.nav',
      '.secondary-nav',
      'nav',
      '[role="navigation"]',
      '[role="banner"]',
      '.w-nav',
      '.navbar',
    ];
    navSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => el.remove());
    });

    // Remove footer elements AFTER block parsing
    const footerSelectors = [
      'footer',
      '.footer',
      '[role="contentinfo"]',
      '.footer-section',
    ];
    footerSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => el.remove());
    });

    // Remove remaining hidden elements (but not dropdown content)
    const hiddenSelectors = [
      '.w-condition-invisible',
    ];
    hiddenSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => el.remove());
    });

    // Final cleanup - remove non-content elements
    const cleanupSelectors = [
      'iframe',
      'form:not([data-keep])',
      '.social-links',
      '.social-icons',
    ];
    cleanupSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => el.remove());
    });

    // Clean up empty divs
    const emptyDivs = document.querySelectorAll('div:empty');
    emptyDivs.forEach((div) => {
      if (!div.querySelector('*') && !div.textContent.trim()) {
        div.remove();
      }
    });
  }
}
