/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-features block
 *
 * Source: https://www.gigamon.com/solutions/accelerate-cloud-migration.html
 * Base Block: columns
 *
 * Block Structure:
 * - Columns block - NO field hints required (per hinting.md rules)
 *
 * Generated: 2026-02-02
 */
export default function parse(element, { document }) {
  const cells = [];

  // Look for column containers within the element
  const row = element.querySelector('.row, .component-columns');

  if (row) {
    // Find column children
    const cols = row.querySelectorAll('[class*="col-md"], [class*="col-lg"], .col');

    if (cols.length > 0) {
      // Multi-column layout
      const rowCells = [];
      cols.forEach((col) => {
        const cell = document.createDocumentFragment();
        Array.from(col.childNodes).forEach((child) => {
          if (child.nodeType === 1 || (child.nodeType === 3 && child.textContent.trim())) {
            cell.appendChild(child.cloneNode(true));
          }
        });
        rowCells.push(cell);
      });
      cells.push(rowCells);
    } else {
      // Single column fallback
      const cell = document.createDocumentFragment();
      Array.from(row.childNodes).forEach((child) => {
        if (child.nodeType === 1) {
          cell.appendChild(child.cloneNode(true));
        }
      });
      cells.push([cell]);
    }
  } else {
    // Fallback: extract all content
    const cell = document.createDocumentFragment();
    const container = element.querySelector('.container') || element;
    Array.from(container.children).forEach((child) => {
      cell.appendChild(child.cloneNode(true));
    });
    cells.push([cell]);
  }

  // Create block
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-features', cells });
  element.replaceWith(block);
}
