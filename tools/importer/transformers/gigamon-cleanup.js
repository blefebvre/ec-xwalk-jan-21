/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Gigamon website cleanup
 * Purpose: Remove non-content elements and clean attributes
 * Applies to: www.gigamon.com (all templates)
 * Generated: 2026-02-02
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Page structure analysis from Gigamon solutions page
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove standard non-content elements
    // These are common HTML elements that shouldn't be in imported content
    WebImporter.DOMUtils.remove(element, [
      'script',
      'style',
      'meta',
      'link',
      'noscript'
    ]);

    // Remove header and navigation elements
    WebImporter.DOMUtils.remove(element, [
      'header',
      'nav',
      '.header',
      '.site-header',
      '.nav-wrapper',
      '.navigation',
      '.mega-menu',
      '.mega-menu-wrapper',
      '.main-nav',
      '.mobile-nav',
      '.mobile-menu',
      '.hamburger',
      '.search-overlay',
      '.search-modal',
      '[role="navigation"]',
      '[role="banner"]'
    ]);

    // Remove footer elements
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '.footer',
      '.site-footer',
      '.footer-wrapper',
      '.footer-nav',
      '.footer-links',
      '.footer-bottom',
      '[role="contentinfo"]'
    ]);

    // Remove cookie consent and privacy elements
    WebImporter.DOMUtils.remove(element, [
      '.onetrust-consent-sdk',
      '.onetrust-pc-dark-filter',
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.cookie-consent',
      '.cookie-banner',
      '.privacy-banner',
      '.gdpr-banner',
      '[id*="onetrust"]',
      '[class*="onetrust"]'
    ]);

    // Remove social sharing and language selectors
    WebImporter.DOMUtils.remove(element, [
      '.social-share',
      '.social-links',
      '.language-selector',
      '.lang-selector',
      '.share-buttons'
    ]);

    // Remove modals and overlays
    WebImporter.DOMUtils.remove(element, [
      '.modal',
      '.overlay',
      '.popup',
      '.lightbox',
      '[role="dialog"]'
    ]);

    // Re-enable scrolling if disabled by modals/overlays
    if (element.style && element.style.overflow === 'hidden') {
      element.setAttribute('style', 'overflow: scroll;');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Clean up tracking and data attributes
    // EXTRACTED: Found data-title attribute in captured DOM on section elements
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      // Remove tracking attributes
      el.removeAttribute('onclick');
      el.removeAttribute('onmouseover');
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
      // Preserve data-title as it may contain useful content info
    });

    // Remove remaining embedded content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'source',
      'svg[aria-hidden="true"]'
    ]);
  }
}
