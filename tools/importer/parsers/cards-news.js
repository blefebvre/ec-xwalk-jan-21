/**
 * Cards-news block parser
 * Converts news article cards with image, category, heading, excerpt, and link
 *
 * Expected output structure:
 * Each row = one card with 2 columns:
 * - Column 1: Image
 * - Column 2: ALL text content in single cell (category, heading, excerpt, link)
 */

export default function parse(element, { document }) {
  // Detect if this is news content (not offer content)
  const text = element.textContent.toLowerCase();
  const isNewsContent = text.includes('read more')
    || text.includes('product launch') || text.includes('health and wellness')
    || text.includes('law enforcement') || text.includes('firstnet fusion')
    || text.includes('stress relief') || text.includes('town of duck');

  // Skip if this looks like offer content instead of news
  if (!isNewsContent) {
    return; // Don't process - let cards-offer handle it
  }

  const cells = [];

  // Find all card elements
  let cards = element.querySelectorAll('.card-tile');
  if (cards.length === 0) {
    cards = element.querySelectorAll(':scope > div');
  }

  cards.forEach((card, index) => {
    const row = [];

    // Column 1: Image (maps to 'image' field)
    const imageCell = document.createElement('div');
    imageCell.appendChild(document.createComment('field:image'));

    const img = card.querySelector('img');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || 'news image';
      imageCell.appendChild(newImg);
    }
    row.push(imageCell);

    // Column 2: ALL text content (maps to 'text' field)
    const contentCell = document.createElement('div');
    contentCell.appendChild(document.createComment('field:text'));

    // Category/eyebrow
    const eyebrow = card.querySelector('.eyebrow, [class*="eyebrow"]');
    if (eyebrow) {
      const eyebrowP = document.createElement('p');
      eyebrowP.textContent = eyebrow.textContent.trim();
      contentCell.appendChild(eyebrowP);
    }

    // Heading
    const heading = card.querySelector('.heading, h2, h3, h4');
    if (heading) {
      const headingEl = document.createElement('h3');
      headingEl.textContent = heading.textContent.trim();
      contentCell.appendChild(headingEl);
    }

    // Excerpt/description
    const desc = card.querySelector('p:not(.eyebrow):not(.heading)');
    if (desc) {
      const descP = document.createElement('p');
      descP.textContent = desc.textContent.trim();
      contentCell.appendChild(descP);
    }

    // Read more link
    const link = card.querySelector('a');
    if (link) {
      const linkP = document.createElement('p');
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = link.textContent.trim() || 'Read more';
      linkP.appendChild(anchor);
      contentCell.appendChild(linkP);
    }

    row.push(contentCell);
    cells.push(row);
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'Cards News',
      cells,
    });
    element.replaceWith(block);
  }
}
