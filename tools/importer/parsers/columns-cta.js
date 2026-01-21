/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-cta block variant
 * Purpose: Two-column CTA layout with text left, buttons right
 * Selector: section.section:last-of-type .w-layout-grid.desktop-4-column.y-center
 * Generated: 2026-01-21
 *
 * Note: Columns blocks do not require field hints per xwalk hinting rules
 */

export default function parse(element, { document }) {
  const cells = [];

  // Get the direct children divs (columns)
  const columns = element.querySelectorAll(':scope > div');

  if (columns.length >= 2) {
    const row = [];

    // Column 1: Text content (heading + paragraph)
    const textColumn = columns[0];
    const textContainer = document.createElement('div');

    const heading = textColumn.querySelector('h2');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent;
      textContainer.appendChild(h2);
    }

    const paragraph = textColumn.querySelector('p');
    if (paragraph) {
      const p = document.createElement('p');
      p.textContent = paragraph.textContent;
      textContainer.appendChild(p);
    }

    row.push(textContainer);

    // Column 2: Buttons
    const buttonColumn = columns[1];
    const buttonContainer = document.createElement('div');

    const buttons = buttonColumn.querySelectorAll('a.button');
    buttons.forEach((btn) => {
      const link = document.createElement('a');
      link.href = btn.getAttribute('href') || '#';
      link.textContent = btn.textContent.trim();
      buttonContainer.appendChild(link);
      buttonContainer.appendChild(document.createElement('br'));
    });

    row.push(buttonContainer);
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns-Cta',
    cells
  });

  element.replaceWith(block);
}
