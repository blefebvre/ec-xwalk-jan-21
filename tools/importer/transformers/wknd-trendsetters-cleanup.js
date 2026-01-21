/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for WKND Trendsetters site cleanup
 * Purpose: Remove non-content elements and fix DOM issues
 * Applies to: wknd-trendsetters.site (all templates)
 * Generated: 2026-01-21
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove navigation - found in captured DOM: <div class="nav secondary-nav">
    WebImporter.DOMUtils.remove(element, [
      '.nav.secondary-nav',
      '.nav-container',
      '.w-nav-overlay'
    ]);

    // Remove footer - found in captured DOM: <footer class="footer inverse-footer">
    WebImporter.DOMUtils.remove(element, [
      'footer.footer',
      '.inverse-footer'
    ]);

    // Remove Webflow-specific elements that aren't content
    WebImporter.DOMUtils.remove(element, [
      '.w-nav-button',
      '.w-icon-dropdown-toggle'
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Clean up tracking attributes - found in captured DOM
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      // Remove Webflow-specific data attributes
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('data-w-') || attr.name.startsWith('data-wf-')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    // Remove standard non-content elements
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link'
    ]);
  }
}
