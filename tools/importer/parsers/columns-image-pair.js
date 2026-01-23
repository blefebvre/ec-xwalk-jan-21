/**
 * Parser for columns-image-pair block variant
 * Converts side-by-side hero images to EDS columns block
 *
 * Source DOM: .w-layout-grid with two .utility-aspect-1x1 children containing images
 * Target: Columns (Image Pair) block with two image columns
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find all image containers
  const imageContainers = element.querySelectorAll('.utility-aspect-1x1');

  if (imageContainers.length === 0) {
    // Fallback: look for direct img children
    const images = element.querySelectorAll('img');
    if (images.length >= 2) {
      // Create row with images
      const row = [];
      images.forEach((img, index) => {
        if (index < 2) {
          const cell = document.createElement('div');
          // <!-- field:image -->
          cell.insertAdjacentHTML('afterbegin', '<!-- field:image -->');
          const picture = document.createElement('picture');
          const imgClone = img.cloneNode(true);
          picture.appendChild(imgClone);
          cell.appendChild(picture);
          row.push(cell);
        }
      });
      cells.push(row);
    }
  } else {
    // Build single row with both images
    const row = [];
    imageContainers.forEach((container) => {
      const img = container.querySelector('img');
      if (img) {
        const cell = document.createElement('div');
        // <!-- field:image -->
        cell.insertAdjacentHTML('afterbegin', '<!-- field:image -->');
        const picture = document.createElement('picture');
        const imgClone = img.cloneNode(true);
        picture.appendChild(imgClone);
        cell.appendChild(picture);
        row.push(cell);
      }
    });
    if (row.length > 0) {
      cells.push(row);
    }
  }

  // Create the block
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-image-pair',
    cells,
  });

  element.replaceWith(block);
}
