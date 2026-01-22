/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for WKND Trendsetters website cleanup
 * Purpose: Remove navigation, footer, and clean site-specific elements
 * Applies to: www.wknd-trendsetters.site (all templates)
 * Generated: 2026-01-22
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
    // Remove navigation
    // EXTRACTED: Found <div class="nav secondary-nav"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.nav.secondary-nav',
      '.nav-container',
      '[role="banner"]'
    ]);

    // Remove footer
    // EXTRACTED: Found <footer class="footer inverse-footer"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'footer.footer',
      '.inverse-footer'
    ]);

    // Remove mobile menu elements
    // EXTRACTED: Found .nav-mobile-menu-button in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.nav-mobile-menu-button',
      '.w-nav-button'
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Clean up Webflow-specific attributes
    // EXTRACTED: Multiple data-w-* attributes found in captured DOM
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      // Remove Webflow tracking attributes
      el.removeAttribute('data-wf-domain');
      el.removeAttribute('data-wf-page');
      el.removeAttribute('data-wf-site');
      el.removeAttribute('data-w-tab');
      el.removeAttribute('data-duration');
      el.removeAttribute('data-animation');
      el.removeAttribute('data-easing');
      el.removeAttribute('data-easing2');
      el.removeAttribute('data-collapse');
      el.removeAttribute('data-no-scroll');
      el.removeAttribute('data-delay');
      el.removeAttribute('data-hover');
      el.removeAttribute('data-current');
      el.removeAttribute('aria-current');
    });

    // Remove remaining unwanted elements
    // Standard HTML elements - safe to use
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link'
    ]);
  }
}
