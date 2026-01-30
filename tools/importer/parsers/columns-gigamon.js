/**
 * Parser for columns-gigamon block variant
 * Converts .component-columns and .columns elements to Columns Gigamon block format
 *
 * Note: Columns blocks do NOT require field hints per xwalk guidelines
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find the column sections within the component
  const columnSection = element.querySelector('.component-columns') || element;
  const columns = columnSection.querySelectorAll('[class*="col-md-"], [class*="col-xs-"]');

  if (columns.length > 0) {
    const row = [];

    columns.forEach(col => {
      const colContent = document.createElement('div');

      // Get headings
      const headings = col.querySelectorAll('h1, h2, h3, h4');
      headings.forEach(h => {
        if (h.textContent.trim()) {
          const heading = document.createElement(h.tagName.toLowerCase());
          heading.textContent = h.textContent.trim();
          colContent.appendChild(heading);
        }
      });

      // Get paragraphs
      const paragraphs = col.querySelectorAll('p');
      paragraphs.forEach(p => {
        if (p.textContent.trim()) {
          const para = document.createElement('p');
          para.textContent = p.textContent.trim();
          colContent.appendChild(para);
        }
      });

      // Get lists
      const lists = col.querySelectorAll('ul, ol');
      lists.forEach(list => {
        const listClone = list.cloneNode(true);
        colContent.appendChild(listClone);
      });

      // Get images
      const images = col.querySelectorAll('img');
      images.forEach(img => {
        if (img.src) {
          colContent.appendChild(img.cloneNode(true));
        }
      });

      // Get links/CTAs
      const links = col.querySelectorAll('a.btn, .component-cta-button a');
      links.forEach(link => {
        if (link.textContent.trim()) {
          const a = document.createElement('a');
          a.href = link.href || '#';
          a.textContent = link.textContent.trim();
          colContent.appendChild(a);
        }
      });

      // Only add column if it has content
      if (colContent.children.length > 0 || colContent.textContent.trim()) {
        row.push(colContent);
      }
    });

    if (row.length > 0) {
      cells.push(row);
    }
  }

  // Create block if we have content
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'Columns Gigamon',
      cells: cells
    });

    element.replaceWith(block);
  }
}
