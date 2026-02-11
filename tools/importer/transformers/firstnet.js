/**
 * FirstNet site-wide DOM transformer
 * Cleans up DOM before and after block parsing
 */

export default function transform(hookName, element) {
  if (hookName === 'beforeTransform') {
    // Basic cleanup - remove scripts, styles, iframes
    element.querySelectorAll('script, style, noscript, iframe').forEach((el) => el.remove());
    element.querySelectorAll('[hidden]').forEach((el) => el.remove());

    // HEADER/NAV REMOVAL: Find hero source element and remove everything before it
    // Must run in beforeTransform since afterTransform only has TABLE elements (from createBlock)
    const heroSource = element.querySelector('.marquee-heading');
    if (heroSource) {
      // Walk up the entire ancestor chain from hero to body,
      // at each level removing all previous siblings (nav, empty divs, breadcrumbs)
      let current = heroSource;
      while (current && current !== element) {
        let sibling = current.previousElementSibling;
        while (sibling) {
          const toRemove = sibling;
          sibling = sibling.previousElementSibling;
          toRemove.remove();
        }
        current = current.parentElement;
      }
    }
  }

  if (hookName === 'afterTransform') {

    // Remove navigation paragraphs by content patterns
    // Skip paragraphs inside TABLE elements (parsed blocks from createBlock)
    element.querySelectorAll('p').forEach((p) => {
      if (p.closest('table')) return;
      const text = p.textContent.toLowerCase().trim();
      // Menu and search patterns
      if (text === 'menu' || text.includes('search form') || text.includes('search search')) {
        p.remove();
        return;
      }
      // Sign up / log in patterns
      if (text.includes('sign up') && text.includes('log in')) {
        p.remove();
        return;
      }
      // Navigation link labels
      if (text === 'products' || text === 'about' || text === 'get started' || text === 'features' ||
          text === 'highlights' || text === 'trending' || text.includes('top devices') || text.includes('top offers') ||
          text.includes('customer stories') || text.includes('plans and devices') || text === 'enter item label link') {
        p.remove();
        return;
      }
    });

    // Remove navigation lists
    element.querySelectorAll('ul').forEach((ul) => {
      const links = ul.querySelectorAll('a');
      if (links.length >= 2) {
        const navPatterns = ['individual plans', 'agency plans', 'international plans', 'cell boosters',
          'phones', 'connected devices', 'tablets', 'featured apps', 'app catalog', 'firstnet fusion',
          'firstnet rapid response', 'firstnet and family', 'what is firstnet', 'newsroom', 'events',
          'health and wellness', 'firstnet promise', 'enhanced solutions', 'response operations',
          'healthcare', 'law enforcement', 'fire and rescue', 'utilities', 'ems', 'fleet management',
          'school safety', 'complete profile', 'complete verification', 'agency sign up',
          'how to pay bill', 'shop hot spot', 'international day pass', 'migrate your account',
          'activate esim'];
        const linkTexts = Array.from(links).map((l) => l.textContent.toLowerCase());
        const navCount = linkTexts.filter((t) => navPatterns.some((p) => t.includes(p))).length;
        if (navCount >= 1) {
          ul.remove();
        }
      }
    });

    // Remove paragraphs with navigation icons
    element.querySelectorAll('p').forEach((p) => {
      const img = p.querySelector('img[src*="icon"], img[src*="functional-icon"]');
      const link = p.querySelector('a');
      if (img && link) {
        const text = link.textContent.toLowerCase();
        const navLinkPatterns = ['rate plans', 'coverage', 'firstnet devices', 'mission-critical',
          'offers', 'firstnet apps', 'who\'s eligible', 'contact us', 'industry solutions'];
        if (navLinkPatterns.some((p) => text.includes(p))) {
          p.remove();
        }
      }
    });

    // FOOTER REMOVAL: Remove footer containers by class patterns
    const footerSelectors = [
      '.firstnet-footer-container-mp',
      '.footer-column',
      '.footer-heading',
      '.footer-links',
      '.cookie-disclaimer-component',
      '.gatingContainer',
      '.gating-inner',
      '[class*="footer"]',
      '.follow-us-desktop',
      '.uws-badge__wrapper',
      '.nuance-chat-floating-container',
      '.att-modal-container'
    ];
    footerSelectors.forEach((sel) => {
      element.querySelectorAll(sel).forEach((el) => el.remove());
    });

    // Remove social media link containers
    element.querySelectorAll('a[href*="facebook.com"], a[href*="linkedin.com"], a[href*="twitter.com"], a[href*="youtube.com"]').forEach((link) => {
      const parent = link.closest('div, p');
      if (parent) parent.remove();
    });

    // Remove legal/privacy links
    element.querySelectorAll('a[href*="privacy"], a[href*="terms"], a[href*="accessibility"], a[href*="cyberaware"]').forEach((link) => {
      const parent = link.closest('p, div.parsys');
      if (parent && parent.textContent.trim().length < 100) parent.remove();
    });

    // STEP 3: Clean up specific patterns that may still remain
    element.querySelectorAll('p').forEach((p) => {
      const text = p.textContent.trim().toLowerCase();

      // Footer patterns
      if (text === 'sitemap' || text === 'support' || text === 'follow us') { p.remove(); return; }
      if (text.includes('privacy notice') || text.includes('terms & conditions') || text.includes('accessibility')) { p.remove(); return; }
      if (text.includes('© ') || text.includes('all rights reserved')) { p.remove(); return; }
      if (text.includes('firstnet.gov') || text.includes('cyber security') || text.includes('health privacy')) { p.remove(); return; }

      // Gated form patterns
      const gatedPatterns = ['gated form', 'first name', 'last name', 'company', 'company name', 'title', 'title name', 'city', 'state', 'zip code', 'email', 'email address'];
      if (gatedPatterns.some((pat) => text === pat)) { p.remove(); return; }
      if (text.includes('by submitting this form, i agree')) { p.remove(); return; }

      // Cookie/misc patterns
      if (text === 'i accept' || text === '×' || text === 'feedback') { p.remove(); return; }
    });

    // STEP 4: Remove any remaining footer-like lists
    element.querySelectorAll('ul').forEach((ul) => {
      const links = ul.querySelectorAll('a');
      const linkTexts = Array.from(links).map((l) => l.textContent.toLowerCase());

      // Check for sitemap-like footer links
      const footerPatterns = ['power of firstnet', 'rate plans', 'devices', 'industry solutions', 'application ecosystem', 'community', 'coverage'];
      const isFooterList = footerPatterns.some((pat) => linkTexts.some((t) => t.includes(pat)));

      if (isFooterList && links.length >= 5) {
        ul.remove();
      }
    });

    // STEP 5: Remove social media link paragraphs
    element.querySelectorAll('p').forEach((p) => {
      const socialLink = p.querySelector('a[href*="facebook.com"], a[href*="linkedin.com"], a[href*="twitter.com"], a[href*="youtube.com"]');
      if (socialLink) {
        p.remove();
      }
    });

    // STEP 6: Remove tracking pixels
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('bat.bing') || src.includes('rlcdn') || src.includes('verint') || src.includes('facebook.com/tr') || src.includes('pixel')) {
        const parent = img.parentElement;
        if (parent && parent.tagName === 'P') { parent.remove(); } else { img.remove(); }
      }
    });

    // STEP 7: Remove video/gated form headings
    element.querySelectorAll('h3, h4').forEach((h) => {
      const text = h.textContent.toLowerCase();
      if (text.includes('video title') || text.includes('gated form') || text.includes('we use cookies')) {
        h.remove();
      }
    });

    // STEP 8: Remove empty elements
    element.querySelectorAll('p, div, ul, ol').forEach((el) => {
      if (!el.textContent.trim() && !el.querySelector('img, picture, video, table')) {
        el.remove();
      }
    });

    // STEP 9: Remove FirstNet logo link that appears in footer
    element.querySelectorAll('p').forEach((p) => {
      const img = p.querySelector('img[alt*="FirstNet logo"], img[alt*="firstnet_logo"]');
      if (img && p.textContent.trim().length < 10) {
        p.remove();
      }
    });
  }
}
