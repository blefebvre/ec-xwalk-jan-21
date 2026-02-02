/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-resources block
 *
 * Source: https://www.gigamon.com/solutions/accelerate-cloud-migration.html
 * Base Block: cards
 *
 * Block Structure (container with card items):
 * - Each card is a row
 * - Columns: image (optional), text
 *
 * Model fields per card: image, text
 *
 * Generated: 2026-02-02
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find card items within the element
  const cards = element.querySelectorAll('.card, .resource-card, [class*="card-item"], [class*="video-card"], [class*="related-card"]');

  // If no specific card containers, look for grid children
  const cardItems = cards.length > 0 ? cards :
    element.querySelectorAll('.row > div, .grid > div, [class*="col-"]');

  if (cardItems.length > 0) {
    cardItems.forEach((card) => {
      // Find card image
      const image = card.querySelector('img');

      // Find card text content
      const title = card.querySelector('h2, h3, h4, .card-title, [class*="title"]');
      const description = card.querySelector('p, .card-description, [class*="description"]');
      const link = card.querySelector('a');
      const category = card.querySelector('[class*="category"], [class*="type"], .eyebrow');

      // Build text cell
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(' field:text '));

      if (category) {
        const categoryP = document.createElement('p');
        categoryP.innerHTML = `<strong>${category.textContent}</strong>`;
        textCell.appendChild(categoryP);
      }
      if (title) textCell.appendChild(title.cloneNode(true));
      if (description) textCell.appendChild(description.cloneNode(true));
      if (link) {
        const linkP = document.createElement('p');
        linkP.appendChild(link.cloneNode(true));
        textCell.appendChild(linkP);
      }

      // Add row with or without image
      if (image) {
        const imageCell = document.createDocumentFragment();
        imageCell.appendChild(document.createComment(' field:image '));
        imageCell.appendChild(image.cloneNode(true));
        cells.push([imageCell, textCell]);
      } else {
        cells.push([textCell]);
      }
    });
  } else {
    // Fallback: extract all content as single card
    const cell = document.createDocumentFragment();
    cell.appendChild(document.createComment(' field:text '));
    Array.from(element.children).forEach((child) => {
      cell.appendChild(child.cloneNode(true));
    });
    cells.push([cell]);
  }

  // Create block
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-resources', cells });
  element.replaceWith(block);
}
