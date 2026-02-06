/**
 * Columns-icons block parser
 * Converts icon grid with feature columns (icon, title, description)
 *
 * Expected output structure (matching xwalk model):
 * Each row = one column item with 2 cells:
 * - Column 1: Icon image (maps to 'icon' reference field)
 * - Column 2: Text content (maps to 'text' richtext field)
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find all icon blocks/columns
  let columns = element.querySelectorAll('.ig-block');
  if (columns.length === 0) {
    columns = element.querySelectorAll(':scope > div');
  }

  // Each column item becomes a row with [icon | text]
  columns.forEach((col, index) => {
    const row = [];

    // Column 1: Icon image (maps to 'icon' field)
    const iconCell = document.createElement('div');
    iconCell.appendChild(document.createComment('field:icon'));

    const icon = col.querySelector('img');
    if (icon) {
      const newImg = document.createElement('img');
      newImg.src = icon.src;
      newImg.alt = icon.alt || 'icon';
      iconCell.appendChild(newImg);
    }
    row.push(iconCell);

    // Column 2: Text content (maps to 'text' field)
    const textCell = document.createElement('div');
    textCell.appendChild(document.createComment('field:text'));

    // Get all text elements
    const paragraphs = col.querySelectorAll('p');

    // Title - first paragraph or one with title class
    const titleEl = col.querySelector('.icon-grid-icon-title') || paragraphs[0];
    if (titleEl) {
      const title = document.createElement('h4');
      title.textContent = titleEl.textContent.trim();
      textCell.appendChild(title);
    }

    // Description - second paragraph or one with description class
    const descEl = col.querySelector('.icon-grid-icon-description') || paragraphs[1];
    if (descEl && descEl !== titleEl) {
      const desc = document.createElement('p');
      desc.textContent = descEl.textContent.trim();
      textCell.appendChild(desc);
    }

    row.push(textCell);
    cells.push(row);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns-icons',
    cells,
  });

  element.replaceWith(block);
}
