/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-cta block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: columns
 *
 * Block Structure:
 * - Single row with 2 columns
 * - Column 1: Heading and description
 * - Column 2: Button group with CTA links
 *
 * Source HTML Pattern (from cleaned.html lines 255-264):
 * <div class="grid-layout desktop-4-column y-center">
 *   <div>
 *     <h2>Join the style revolution</h2>
 *     <p class="subheading">Description text...</p>
 *   </div>
 *   <div class="button-group">
 *     <a class="button">Primary CTA</a>
 *     <a class="button secondary-button">Secondary CTA</a>
 *   </div>
 * </div>
 *
 * Generated: 2026-01-22
 */
export default function parse(element, { document }) {
  // Get direct child divs (the two columns)
  const columns = element.querySelectorAll(':scope > div');

  const cells = [];
  const row = [];

  columns.forEach((col) => {
    const colContent = [];

    // Check if this is the content column (has h2)
    const heading = col.querySelector('h2');
    if (heading) {
      colContent.push(heading.cloneNode(true));
    }

    // Get description paragraph
    const description = col.querySelector('p.subheading, p');
    if (description) {
      colContent.push(description.cloneNode(true));
    }

    // Check if this is the button column
    const buttons = col.querySelectorAll('a.button, a.w-button');
    buttons.forEach((btn) => {
      const link = document.createElement('a');
      link.href = btn.getAttribute('href') || '#';
      link.textContent = btn.textContent.trim();
      colContent.push(link);
    });

    if (colContent.length > 0) {
      row.push(colContent);
    }
  });

  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
