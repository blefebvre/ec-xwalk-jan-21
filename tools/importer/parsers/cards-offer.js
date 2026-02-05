/**
 * Cards-offer block parser
 * Converts product offer cards with image, eyebrow, heading, description, and CTA
 *
 * Expected output structure:
 * Each row = one card with 2 columns:
 * - Column 1: Image
 * - Column 2: ALL text content in single cell (eyebrow, heading, description, CTA)
 */

export default function parse(element, { document }) {
  // Detect if this is offer content (not news content)
  const text = element.textContent.toLowerCase();
  const isOfferContent = text.includes('shop now') || text.includes('$')
    || text.includes('get iphone') || text.includes('break your contract')
    || text.includes('save 25%') || text.includes('families save');

  // Skip if this looks like news content instead of offers
  if (!isOfferContent) {
    return; // Don't process - let cards-news handle it
  }

  const cells = [];

  // Try multiple selectors for cards - live site may have different structure
  let cards = element.querySelectorAll('.card-tile');
  if (cards.length === 0) {
    cards = element.querySelectorAll('[class*="offer"]');
  }
  if (cards.length === 0) {
    cards = element.querySelectorAll('[class*="card"]');
  }
  if (cards.length === 0) {
    // If still no cards found, treat children divs as cards
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
      newImg.alt = img.alt || 'offer image';
      imageCell.appendChild(newImg);
    }
    row.push(imageCell);

    // Column 2: ALL text content (maps to 'text' field)
    const contentCell = document.createElement('div');
    contentCell.appendChild(document.createComment('field:text'));

    // Eyebrow - try multiple selectors
    let eyebrow = card.querySelector('.eyebrow');
    if (!eyebrow) eyebrow = card.querySelector('[class*="eyebrow"]');
    if (!eyebrow) eyebrow = card.querySelector('span:first-of-type');
    if (eyebrow) {
      const eyebrowP = document.createElement('p');
      eyebrowP.textContent = eyebrow.textContent.trim();
      contentCell.appendChild(eyebrowP);
    }

    // Heading - try multiple selectors
    let heading = card.querySelector('.heading');
    if (!heading) heading = card.querySelector('[class*="heading"]');
    if (!heading) heading = card.querySelector('h2, h3, h4');
    if (heading) {
      const headingEl = document.createElement('h3');
      headingEl.textContent = heading.textContent.trim();
      contentCell.appendChild(headingEl);
    }

    // Description paragraphs
    const allPs = card.querySelectorAll('p');
    allPs.forEach((p) => {
      if (!p.classList.contains('eyebrow') && !p.classList.contains('heading')) {
        const descP = document.createElement('p');
        descP.textContent = p.textContent.trim();
        if (descP.textContent) {
          contentCell.appendChild(descP);
        }
      }
    });

    // CTA links - capture all links (Shop now, Learn more, View product details, etc.)
    const allLinks = card.querySelectorAll('a');
    allLinks.forEach((link) => {
      const linkText = link.textContent.trim();
      // Skip empty links or links that are just images
      if (linkText && !link.querySelector('img')) {
        const ctaP = document.createElement('p');
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.textContent = linkText;
        ctaP.appendChild(anchor);
        contentCell.appendChild(ctaP);
      }
    });

    if (imageCell.children.length > 0 || contentCell.children.length > 0) {
      row.push(contentCell);
      cells.push(row);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'Cards Offer',
      cells,
    });
    element.replaceWith(block);
  }
}
