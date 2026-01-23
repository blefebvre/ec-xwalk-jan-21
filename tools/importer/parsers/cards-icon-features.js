/**
 * Parser for cards-icon-features block variant
 * Converts icon + text feature grid to EDS cards block
 *
 * Source DOM: .w-layout-grid with .flex-horizontal items containing icon and text
 * Target: Cards (Icon Features) block with icon/text pairs
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find all feature items
  const featureItems = element.querySelectorAll('.flex-horizontal');

  featureItems.forEach((item) => {
    // Find the icon
    const iconContainer = item.querySelector('.icon');
    const svg = iconContainer ? iconContainer.querySelector('svg') : null;

    // Find the text content
    const textElement = item.querySelector('p');
    const text = textElement ? textElement.textContent.trim() : '';

    if (text) {
      // Create row with icon and text
      const iconCell = document.createElement('div');
      // <!-- field:image -->
      iconCell.insertAdjacentHTML('afterbegin', '<!-- field:image -->');
      if (svg) {
        // Serialize the original SVG and embed as data URL
        const iconP = document.createElement('p');
        const iconImg = document.createElement('img');
        // Get SVG markup and normalize for data URL
        const svgClone = svg.cloneNode(true);
        // Ensure width/height are set for proper rendering
        svgClone.setAttribute('width', '24');
        svgClone.setAttribute('height', '24');
        const svgData = new XMLSerializer().serializeToString(svgClone);
        iconImg.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        iconImg.alt = 'feature icon';
        iconP.appendChild(iconImg);
        iconCell.appendChild(iconP);
      }

      const textCell = document.createElement('div');
      // <!-- field:text -->
      textCell.insertAdjacentHTML('afterbegin', '<!-- field:text -->');
      const p = document.createElement('p');
      p.textContent = text;
      textCell.appendChild(p);

      cells.push([iconCell, textCell]);
    }
  });

  // Create the block
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-icon-features',
    cells,
  });

  element.replaceWith(block);
}
