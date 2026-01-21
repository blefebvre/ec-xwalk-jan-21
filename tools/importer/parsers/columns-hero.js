/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-hero block variant
 * Purpose: Two images displayed side-by-side in hero section
 * Selector: header .w-layout-grid.grid-layout.y-top
 * Generated: 2026-01-21
 *
 * Note: Columns blocks do not require field hints per xwalk hinting rules
 */

export default function parse(element, { document }) {
  // Find images in the grid layout
  const images = element.querySelectorAll('img');

  const cells = [];

  // Each image goes in its own column (single row, 2 columns)
  const row = [];
  images.forEach((img) => {
    const imgClone = img.cloneNode(true);
    row.push(imgClone);
  });

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns-Hero',
    cells
  });

  element.replaceWith(block);
}
