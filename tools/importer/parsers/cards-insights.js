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

  // Support both swiper-wrapper (why-firstnet) and items-wrapper (power-of-firstnet)
  const teaserItems = element.querySelectorAll('.swiper-wrapper .item, .items-wrapper .item');
  teaserItems.forEach((item, index) => {
    const row = [];

    // Column 1: Image
    const imageCell = document.createElement('div');
    let imgUrl = null;

    // Try direct <img> in image-wrapper first (power-of-firstnet pattern)
    const directImg = item.querySelector('.image-wrapper img');
    if (directImg && directImg.src && !directImg.src.startsWith('data:')) {
      imgUrl = directImg.src;
    }

    // Fallback: use URL from raw HTML for lazy-loaded background-images (why-firstnet pattern)
    if (!imgUrl && index < bgUrls.length) {
      imgUrl = bgUrls[index];
    }

    // Fallback: try DOM-based background-image extraction
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

    // CTA link - try multiple patterns
    const link = item.querySelector('a.att-track') || item.closest('a');
    if (link && link.href) {
      const ctaP = document.createElement('p');
      const anchor = document.createElement('a');
      anchor.href = link.href;
      // Try various CTA text sources
      const ctaText = item.querySelector('.cta-btn .att-button')
        || item.querySelector('.cta-link span');
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
