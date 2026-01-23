/**
 * Parser for cards-articles block variant
 * Converts article card grid to EDS cards block
 *
 * Source DOM: .w-layout-grid with article links containing image, tag, reading time, heading, description
 * Target: Cards (Articles) block with image and rich text content
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find all article card links - they are direct children anchor tags
  let articleCards = element.querySelectorAll('a.utility-link-content-block');

  // Fallback: try finding any anchor with w-inline-block class
  if (articleCards.length === 0) {
    articleCards = element.querySelectorAll('a.w-inline-block');
  }

  // Fallback: try finding direct anchor children
  if (articleCards.length === 0) {
    articleCards = element.querySelectorAll('a');
  }

  articleCards.forEach((card) => {
    // Find the image
    const img = card.querySelector('img');

    // Find the category tag
    const tagElement = card.querySelector('.tag div, .tag');
    const tag = tagElement ? tagElement.textContent.trim() : '';

    // Find reading time
    const readingTimeElement = card.querySelector('.paragraph-sm');
    const readingTime = readingTimeElement ? readingTimeElement.textContent.trim() : '';

    // Find heading
    const headingElement = card.querySelector('h3, h4');
    const heading = headingElement ? headingElement.textContent.trim() : '';

    // Find description - exclude paragraph-sm
    const paragraphs = card.querySelectorAll('p');
    let description = '';
    paragraphs.forEach((p) => {
      if (!p.classList.contains('paragraph-sm') && p.textContent.trim()) {
        description = p.textContent.trim();
      }
    });

    // Get link href
    const href = card.getAttribute('href') || '#';

    // Skip if no meaningful content
    if (!heading && !description) return;

    // Create image cell
    const imageCell = document.createElement('div');
    // <!-- field:image -->
    imageCell.insertAdjacentHTML('afterbegin', '<!-- field:image -->');
    if (img) {
      const picture = document.createElement('picture');
      const imgClone = img.cloneNode(true);
      picture.appendChild(imgClone);
      imageCell.appendChild(picture);
    }

    // Create text cell with structured content
    const textCell = document.createElement('div');

    // Add tag and reading time
    if (tag || readingTime) {
      const metaP = document.createElement('p');
      if (tag) {
        const tagSpan = document.createElement('strong');
        tagSpan.textContent = tag;
        metaP.appendChild(tagSpan);
      }
      if (readingTime) {
        if (tag) metaP.appendChild(document.createTextNode(' · '));
        metaP.appendChild(document.createTextNode(readingTime));
      }
      textCell.appendChild(metaP);
    }

    // Add heading
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading;
      textCell.appendChild(h3);
    }

    // Add description
    if (description) {
      const p = document.createElement('p');
      p.textContent = description;
      textCell.appendChild(p);
    }

    // Add link
    const link = document.createElement('p');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = 'Read';
    link.appendChild(a);
    textCell.appendChild(link);

    // <!-- field:text --> (inserted at beginning)
    textCell.insertAdjacentHTML('afterbegin', '<!-- field:text -->');

    cells.push([imageCell, textCell]);
  });

  // Only create block if we found cards
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'cards-articles',
      cells,
    });

    element.replaceWith(block);
  }
}
