/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-hero-images block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: columns
 *
 * Block Structure:
 * - Row 1: Two images side-by-side (each in its own column)
 *
 * Source HTML Pattern (from cleaned.html lines 35-42):
 * <div class="w-layout-grid grid-layout mobile-portrait-1-column grid-gap-md">
 *   <div class="utility-aspect-1x1"><img src="..."></div>
 *   <div class="utility-aspect-1x1"><img src="..."></div>
 * </div>
 *
 * Note: Columns blocks do not require field comments per hinting rules
 *
 * Generated: 2026-01-22
 */
export default function parse(element, { document }) {
  // Extract images from the grid layout
  // VALIDATED: Found in cleaned.html - .utility-aspect-1x1 > img
  const imageDivs = element.querySelectorAll('.utility-aspect-1x1');

  const cells = [];

  if (imageDivs.length >= 2) {
    // Each div contains an image - create a row with two columns
    const col1 = [];
    const col2 = [];

    const img1 = imageDivs[0].querySelector('img');
    const img2 = imageDivs[1].querySelector('img');

    if (img1) col1.push(img1.cloneNode(true));
    if (img2) col2.push(img2.cloneNode(true));

    cells.push([col1, col2]);
  } else {
    // Fallback: try to get all images directly
    const images = Array.from(element.querySelectorAll('img'));
    if (images.length >= 2) {
      cells.push([[images[0].cloneNode(true)], [images[1].cloneNode(true)]]);
    } else if (images.length === 1) {
      cells.push([[images[0].cloneNode(true)], []]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-hero-images', cells });
  element.replaceWith(block);
}
