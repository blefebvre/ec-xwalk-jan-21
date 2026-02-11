/* eslint-disable */
/* global WebImporter */

/**
 * Cards-Insights block parser
 * Converts content teaser cards (case studies/insights) with background images into Cards-Insights block.
 *
 * Source pattern: .content-teaser .swiper-wrapper .item
 * Each item has:
 * - Background image via CSS style: background-image:url(...)
 * - Title (.item-title)
 * - Description (.item-description)
 * - CTA link (parent <a> wrapping the card)
 *
 * Note: The page uses lazy loading that strips background-image URLs from the DOM after JS executes.
 * To reliably extract images, we parse the raw HTML string (before JS execution) as the primary source.
 *
 * Expected output structure:
 * Each row = one card with 2 cells:
 * - Column 1: Card image (extracted from background-image CSS in raw HTML)
 * - Column 2: Text content (heading, description, link)
 */

/**
 * Extract background-image URLs from raw HTML for lzy-background elements.
 * Returns array of image URLs in the order they appear in the source.
 */
function extractBgUrlsFromRawHtml(html) {
  if (!html) return [];
  const urls = [];
  // Match only card image-wrapper elements (not hero marquee-item)
  const pattern = /lzy-background image-wrapper"[^>]*style="[^"]*background-image:\s*url\(([^)]+)\)/g;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const url = match[1].replace(/['"]/g, '').trim();
    if (url && !url.startsWith('data:')) {
      urls.push(url);
    }
  }
  return urls;
}

export default function parse(element, { document, html }) {
  const cells = [];

  // Pre-extract all background image URLs from raw HTML (before lazy loader modifies DOM)
  const bgUrls = extractBgUrlsFromRawHtml(html);

  const teaserItems = element.querySelectorAll('.swiper-wrapper .item');
  teaserItems.forEach((item, index) => {
    const row = [];

    // Column 1: Image
    const imageCell = document.createElement('div');
    let imgUrl = null;

    // Primary: use URL from raw HTML (reliable, not affected by lazy loader)
    if (index < bgUrls.length) {
      imgUrl = bgUrls[index];
    }

    // Fallback: try DOM-based extraction
    if (!imgUrl) {
      const bgEl = item.querySelector('.lzy-background, .image-wrapper, [style*="background-image"]');
      if (bgEl) {
        const styleAttr = bgEl.getAttribute('style') || '';
        const bgMatch = styleAttr.match(/url\(['"]?([^'")\s]+)['"]?\)/);
        if (bgMatch && !bgMatch[1].startsWith('data:')) {
          imgUrl = bgMatch[1];
        }
        if (!imgUrl && bgEl.style && bgEl.style.backgroundImage) {
          const computedMatch = bgEl.style.backgroundImage.match(/url\(['"]?([^'")\s]+)['"]?\)/);
          if (computedMatch && !computedMatch[1].startsWith('data:')) {
            imgUrl = computedMatch[1];
          }
        }
      }
    }

    if (imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = '';
      imageCell.appendChild(img);
    }
    row.push(imageCell);

    // Column 2: Text content
    const textCell = document.createElement('div');

    // Title
    const title = item.querySelector('.item-title');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      textCell.appendChild(h3);
    }

    // Description
    const desc = item.querySelector('.item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textCell.appendChild(p);
    }

    // CTA link (from parent anchor wrapping the entire card)
    const link = item.querySelector('a.att-track') || item.closest('a');
    if (link && link.href) {
      const ctaP = document.createElement('p');
      const anchor = document.createElement('a');
      anchor.href = link.href;
      const ctaText = item.querySelector('.cta-btn .att-button');
      anchor.textContent = ctaText ? ctaText.textContent.trim() : 'Read more';
      ctaP.appendChild(anchor);
      textCell.appendChild(ctaP);
    }

    row.push(textCell);
    cells.push(row);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards-Insights',
    cells,
  });

  element.replaceWith(block);
}
