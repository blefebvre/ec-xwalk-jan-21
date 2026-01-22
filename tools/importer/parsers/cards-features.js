/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-features block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: cards
 *
 * Block Structure:
 * - Each row = 1 card with 2 columns
 * - Column 1: Icon (SVG converted to data URL)
 * - Column 2: Rich text description
 *
 * Source HTML Pattern (live page):
 * <div class="w-layout-grid grid-layout desktop-4-column">
 *   <div class="flex-horizontal flex-gap-xxs">
 *     <div><div class="icon"><svg>...</svg></div></div>
 *     <p>Feature text...</p>
 *   </div>
 *   ... (8 items total)
 * </div>
 *
 * SVG Handling: Inline SVGs are converted to base64 data URLs for preservation.
 *
 * Generated: 2026-01-22
 */
export default function parse(element, { document }) {
  // Extract feature items from the grid
  const featureItems = element.querySelectorAll('.flex-horizontal.flex-gap-xxs');

  const cells = [];

  featureItems.forEach((item) => {
    // Each feature has an icon div (with SVG on live page) and a paragraph
    const textP = item.querySelector('p');

    // Build image cell - look for SVG first, convert to data URL
    const imageCell = [];
    const svg = item.querySelector('svg');
    const img = item.querySelector('.icon img') || item.querySelector('img');

    if (svg) {
      // Convert SVG to data URL for preservation
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const base64 = btoa(unescape(encodeURIComponent(svgString)));
      const dataUrl = `data:image/svg+xml;base64,${base64}`;

      // Create img element with data URL
      const imgEl = document.createElement('img');
      imgEl.src = dataUrl;
      imgEl.alt = 'feature icon';

      imageCell.push(document.createComment(' field:image '));
      imageCell.push(imgEl);
    } else if (img) {
      // Clone the img element with field hint
      imageCell.push(document.createComment(' field:image '));
      imageCell.push(img.cloneNode(true));
    }

    // Build text cell with field hint
    const textCell = [];
    if (textP) {
      textCell.push(document.createComment(' field:text '));
      textCell.push(textP.cloneNode(true));
    }

    // Only add row if we have text content
    if (textCell.length > 0) {
      cells.push([imageCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-features', cells });
  element.replaceWith(block);
}
