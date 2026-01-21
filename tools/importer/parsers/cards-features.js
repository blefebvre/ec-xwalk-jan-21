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

    // Column 1: Icon (as image placeholder since these are icon fonts)
    const iconContainer = document.createElement('div');
    // Add field hint for xwalk
    iconContainer.appendChild(document.createComment(' field:image '));
    const iconDiv = item.querySelector('.icon');
    if (iconDiv) {
      // Icons are CSS-based, create placeholder
      const iconPlaceholder = document.createElement('span');
      iconPlaceholder.textContent = '●';
      iconContainer.appendChild(iconPlaceholder);
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
