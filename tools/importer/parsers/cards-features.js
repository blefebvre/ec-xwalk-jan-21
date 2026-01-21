/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-features block variant
 * Purpose: Grid of feature items with icons and text (no images)
 * Selector: section.section > .container > .w-layout-grid.desktop-4-column
 * Generated: 2026-01-21
 *
 * Field hints for xwalk:
 * - image: icon element
 * - text: description paragraph
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find all feature items (flex-horizontal with icon and text)
  const featureItems = element.querySelectorAll('.flex-horizontal.flex-gap-xxs');

  featureItems.forEach((item) => {
    const row = [];

    // Column 1: Icon (inline SVG converted to img)
    const iconContainer = document.createElement('div');
    iconContainer.appendChild(document.createComment(' field:image '));
    const iconDiv = item.querySelector('.icon');
    if (iconDiv) {
      const svg = iconDiv.querySelector('svg');
      if (svg) {
        // Convert SVG to data URI using XMLSerializer
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const dataUri = 'data:image/svg+xml,' + encodeURIComponent(svgString);
        const img = document.createElement('img');
        img.src = dataUri;
        img.alt = 'icon';
        iconContainer.appendChild(img);
      }
    }
    row.push(iconContainer);

    // Column 2: Text content
    const textContainer = document.createElement('div');
    // Add field hint for xwalk
    textContainer.appendChild(document.createComment(' field:text '));
    const paragraph = item.querySelector('p');
    if (paragraph) {
      const p = document.createElement('p');
      p.textContent = paragraph.textContent;
      textContainer.appendChild(p);
    }
    row.push(textContainer);

    cells.push(row);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards-Features',
    cells
  });

  element.replaceWith(block);
}
