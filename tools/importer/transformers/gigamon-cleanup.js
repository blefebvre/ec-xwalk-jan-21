/**
 * Gigamon site-wide DOM cleanup transformer
 * Removes all non-content elements before and after block parsing
 */

export default function transform(hookName, element) {
  if (hookName === 'beforeTransform') {
    // ========================================
    // REMOVE HEADER AND NAVIGATION ELEMENTS
    // ========================================

    const navSelectors = [
      'nav',
      'header',
      '.navigation',
      '.nav-menu',
      '.global-navigation',
      '.component-global-navigation',
      '#mp-menu',
      '.mp-menu',
      '.mp-level',
      '.mp-back',
      '.mobile-closelogo',
      '.mobile-trigger',
      '.mobile-close-nav',
      '.header-nav',
      '.main-nav',
      '.top-nav',
      '.sticky-nav',
      '.sticky-header',
    ];
    element.querySelectorAll(navSelectors.join(', ')).forEach((el) => el.remove());

    // ========================================
    // REMOVE FOOTER ELEMENTS
    // ========================================

    const footerSelectors = [
      'footer',
      '.footer',
      '.site-footer',
      '.fat-footer',
      '.component-fat-footer',
      '.footer-container',
      '.footer-links',
      '.footer-nav',
      '.copyright',
    ];
    element.querySelectorAll(footerSelectors.join(', ')).forEach((el) => el.remove());

    // ========================================
    // REMOVE MODAL AND POPUP ELEMENTS
    // ========================================

    const modalSelectors = [
      '.modal',
      '.modal-inner',
      '.modal-content',
      '.modal-close',
      '.general-modal',
      '.component-general-modal',
      '.popup',
      '.overlay',
      '.lightbox',
      '[class*="modal--"]',
    ];
    element.querySelectorAll(modalSelectors.join(', ')).forEach((el) => el.remove());

    // ========================================
    // REMOVE COOKIE AND CONSENT BANNERS
    // ========================================

    const cookieSelectors = [
      '.cookie-banner',
      '.cookie-consent',
      '.cookie-notice',
      '.gdpr-banner',
      '.privacy-banner',
      '#onetrust-consent-sdk',
      '#cookieConsent',
      '[class*="cookie"]',
      '[id*="cookie"]',
    ];
    element.querySelectorAll(cookieSelectors.join(', ')).forEach((el) => el.remove());

    // ========================================
    // REMOVE SOCIAL AND SHARE ELEMENTS
    // ========================================

    const socialSelectors = [
      '.social-share',
      '.share-buttons',
      '.addthis',
      '.social-links',
      '.social-icons',
      '.share-widget',
      '[class*="share-"]',
      '[class*="social-"]',
    ];
    element.querySelectorAll(socialSelectors.join(', ')).forEach((el) => el.remove());

    // ========================================
    // REMOVE FORM AND SUBSCRIPTION ELEMENTS
    // ========================================

    const formSelectors = [
      '.newsletter-signup',
      '.subscribe-form',
      '.email-signup',
      '.contact-form',
      '.marketo-form',
      '[class*="newsletter"]',
      '[class*="subscribe"]',
    ];
    element.querySelectorAll(formSelectors.join(', ')).forEach((el) => el.remove());

    // ========================================
    // REMOVE CHAT AND SUPPORT WIDGETS
    // ========================================

    const chatSelectors = [
      '.chat-widget',
      '.live-chat',
      '.support-chat',
      '#drift-widget',
      '#intercom-container',
      '[class*="chat-"]',
    ];
    element.querySelectorAll(chatSelectors.join(', ')).forEach((el) => el.remove());

    // ========================================
    // REMOVE AEM/CMS ARTIFACTS
    // ========================================

    const aemSelectors = [
      '.aem-Grid:empty',
      '.aem-GridColumn:empty',
      '.par:empty',
      '.iparys_inherited:empty',
      '.newpar',
      '.new.section:empty',
      '.parsys:empty',
      '.cq-placeholder',
      '[data-sly-test]',
      '[data-sly-use]',
      '[data-sly-resource]',
      '[data-cmp-is]',
      '.experiencefragment',
    ];
    element.querySelectorAll(aemSelectors.join(', ')).forEach((el) => el.remove());

    // ========================================
    // REMOVE LINK ELEMENTS (language/stylesheet)
    // ========================================

    element.querySelectorAll('link').forEach((el) => el.remove());

    // ========================================
    // REMOVE SCRIPT AND STYLE ELEMENTS
    // ========================================

    element.querySelectorAll('script, style, noscript').forEach((el) => el.remove());

    // ========================================
    // REMOVE SEARCH ELEMENTS
    // ========================================

    const searchSelectors = [
      '.search',
      '.search-form',
      '.search-results',
      '.search-overlay',
      '.site-search',
      '[class*="search-"]',
      '[id*="search"]',
    ];
    element.querySelectorAll(searchSelectors.join(', ')).forEach((el) => el.remove());

    // ========================================
    // REMOVE BREADCRUMB ELEMENTS
    // ========================================

    const breadcrumbSelectors = [
      '.breadcrumb',
      '.breadcrumbs',
      '.component-breadcrumb',
      '[class*="breadcrumb"]',
    ];
    element.querySelectorAll(breadcrumbSelectors.join(', ')).forEach((el) => el.remove());

    // ========================================
    // REMOVE LOGIN AND ACCOUNT ELEMENTS
    // ========================================

    const loginSelectors = [
      '.login-links',
      '.login-menu',
      '.login-dropdown',
      '#login-opt',
      '[class*="login"]',
      '[id*="login"]',
      '.account-menu',
      '.user-menu',
      '.signin',
      '.sign-in',
      '[href*="/login"]',
      '[href*="/signin"]',
      '.sprite-mobile-login',
    ];
    element.querySelectorAll(loginSelectors.join(', ')).forEach((el) => el.remove());

    // ========================================
    // REMOVE LANGUAGE PICKER ELEMENTS
    // ========================================

    const languageSelectors = [
      '.lang-container',
      '.lang-options',
      '.lang-links',
      '#lang-opt',
      '.language-picker',
      '.language-selector',
      '.locale-selector',
      '.country-selector',
      '.region-selector',
      '[class*="lang-"]',
      '.sprite-mobile-language',
    ];
    element.querySelectorAll(languageSelectors.join(', ')).forEach((el) => el.remove());

    // ========================================
    // REMOVE UTILITY MENU ELEMENTS
    // ========================================

    const utilityMenuSelectors = [
      '.utility-item',
      '.utility-submenu',
      '.utility-menu',
      '.utility-bar',
      '.nav-container.lang-container',
    ];
    element.querySelectorAll(utilityMenuSelectors.join(', ')).forEach((el) => el.remove());

    // ========================================
    // REMOVE BACK TO TOP AND UTILITY ELEMENTS
    // ========================================

    const utilitySelectors = [
      '.back-to-top',
      '.scroll-to-top',
      '.skip-link',
      '.skip-nav',
      '.utility-nav',
      '.toolbar',
      '.sticky-cta',
    ];
    element.querySelectorAll(utilitySelectors.join(', ')).forEach((el) => el.remove());

    // ========================================
    // REMOVE EMPTY CONTAINERS
    // ========================================

    element.querySelectorAll('.image:empty, .component-image:empty').forEach((el) => el.remove());

    // Clean up excessive whitespace/padding classes
    element.querySelectorAll('[class*="vert-pad"]').forEach((el) => {
      const classes = el.className.split(' ').filter((c) => !c.startsWith('vert-pad'));
      if (classes.length > 0) {
        el.className = classes.join(' ');
      } else {
        el.removeAttribute('class');
      }
    });

    // ========================================
    // REMOVE HIDDEN/INVISIBLE ELEMENTS
    // ========================================

    element.querySelectorAll('[aria-hidden="true"], .hidden, .visually-hidden, .sr-only').forEach((el) => {
      if (!el.classList.contains('sr-only') || !el.textContent.trim()) {
        el.remove();
      }
    });

    // ========================================
    // REMOVE SVG ICONS IN NAVIGATION CONTEXT
    // ========================================

    element.querySelectorAll('img[src^="data:image/svg"]').forEach((img) => {
      const width = img.getAttribute('width');
      const height = img.getAttribute('height');
      if ((width && parseInt(width, 10) <= 20) || (height && parseInt(height, 10) <= 20)) {
        img.remove();
      }
    });
  }

  if (hookName === 'afterTransform') {
    // ========================================
    // CLEANUP EMPTY ELEMENTS AFTER PARSING
    // ========================================

    for (let i = 0; i < 3; i += 1) {
      element.querySelectorAll('div, section, span, p, article, aside').forEach((el) => {
        if (!el.textContent.trim() && el.children.length === 0 && !el.closest('.block')) {
          el.remove();
        }
      });
    }

    // ========================================
    // REMOVE DUPLICATE IMAGES
    // ========================================

    const seenSrcs = new Set();
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src');
      if (src && seenSrcs.has(src)) {
        if (!img.closest('.block')) {
          img.remove();
        }
      } else if (src) {
        seenSrcs.add(src);
      }
    });

    // ========================================
    // REMOVE ORPHANED WRAPPERS
    // ========================================

    element.querySelectorAll('.site-wrapper').forEach((wrapper) => {
      if (!wrapper.querySelector('.block') && !wrapper.textContent.trim()) {
        wrapper.remove();
      }
    });

    // ========================================
    // CLEAN UP ATTRIBUTES
    // ========================================

    element.querySelectorAll('[data-analytics], [data-tracking], [data-gtm]').forEach((el) => {
      el.removeAttribute('data-analytics');
      el.removeAttribute('data-tracking');
      el.removeAttribute('data-gtm');
    });
  }
}
