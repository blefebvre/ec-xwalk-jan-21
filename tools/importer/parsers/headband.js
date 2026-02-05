/**
 * Headband block parser
 * Converts horizontal quick-links navigation to EDS block format
 */

export default function parse(element, { document }) {
  const cells = [];

  // Extract all navigation links
  const links = element.querySelectorAll('a');

  links.forEach((link) => {
    const row = [];
    const cell = document.createElement('div');

    // <!-- field hint: link -->
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.textContent = link.textContent.trim();
    cell.appendChild(anchor);

    row.push(cell);
    cells.push(row);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'headband',
    cells,
  });

  element.replaceWith(block);
}
