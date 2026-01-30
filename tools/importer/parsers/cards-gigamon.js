/**
 * Parser for cards-gigamon block variant
 * Converts .resource-card elements to Cards Gigamon block format
 *
 * Target model fields (per card item):
 * - image: Card image (collapsed field - no hint needed)
 * - text: Card content (richtext - needs field hint)
 */

export default function parse(element, { document }) {
  const cells = [];

  // Handle individual resource-card
  if (element.classList.contains('resource-card')) {
    // Find the card image
    const cardImage = element.querySelector('.resource-card-image img, .component-image img');

    // Find the card content
    const cardContent = element.querySelector('.component-resource-card, .component-text');

    // Build row: [image, text content]
    const row = [];

    // Column 1: Image (no field hint for collapsed image field)
    if (cardImage) {
      row.push(cardImage.cloneNode(true));
    } else {
      row.push('');
    }

    // Column 2: Text content with field hint
    const textDiv = document.createElement('div');
    const fieldHint = document.createComment(' field:text ');
    textDiv.appendChild(fieldHint);

    if (cardContent) {
      // Get title/heading
      const heading = cardContent.querySelector('h2, h3, .super-title');
      if (heading && heading.textContent.trim()) {
        const h3 = document.createElement('h3');
        h3.textContent = heading.textContent.trim();
        textDiv.appendChild(h3);
      }

      // Get description
      const desc = cardContent.querySelector('.component-text p, p');
      if (desc && desc.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textDiv.appendChild(p);
      }

      // Get link/CTA
      const link = cardContent.querySelector('a');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href || '#';
        a.textContent = link.textContent.trim() || 'Read More';
        textDiv.appendChild(a);
      }
    }

    row.push(textDiv);
    cells.push(row);
  }

  // Handle container with multiple cards (promo-container, related-pages)
  if (element.classList.contains('promo-container') ||
      element.classList.contains('related-pages') ||
      element.classList.contains('component-related-pages')) {

    const cards = element.querySelectorAll('.resource-card, .promo-item, .related-page-item');

    cards.forEach(card => {
      const cardImage = card.querySelector('img');
      const cardTitle = card.querySelector('h2, h3, h4, .title');
      const cardDesc = card.querySelector('p, .description');
      const cardLink = card.querySelector('a');

      const row = [];

      // Column 1: Image
      if (cardImage) {
        row.push(cardImage.cloneNode(true));
      } else {
        row.push('');
      }

      // Column 2: Text content with field hint
      const textDiv = document.createElement('div');
      const fieldHint = document.createComment(' field:text ');
      textDiv.appendChild(fieldHint);

      if (cardTitle && cardTitle.textContent.trim()) {
        const h3 = document.createElement('h3');
        h3.textContent = cardTitle.textContent.trim();
        textDiv.appendChild(h3);
      }

      if (cardDesc && cardDesc.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = cardDesc.textContent.trim();
        textDiv.appendChild(p);
      }

      if (cardLink) {
        const a = document.createElement('a');
        a.href = cardLink.href || '#';
        a.textContent = cardLink.textContent.trim() || 'Learn More';
        textDiv.appendChild(a);
      }

      row.push(textDiv);
      cells.push(row);
    });
  }

  // Create block if we have content
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'Cards Gigamon',
      cells: cells
    });

    element.replaceWith(block);
  }
}
