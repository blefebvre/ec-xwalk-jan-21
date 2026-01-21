/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-articles block variant
 * Purpose: Article cards with image, tag, read time, heading, description
 * Selector: .section.secondary-section .w-layout-grid.tablet-1-column
 * Generated: 2026-01-21
 *
 * Field hints for xwalk:
 * - image: article image
 * - text: article text content (tag, heading, description)
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find all article card links
  const articleCards = element.querySelectorAll('.utility-link-content-block');

  articleCards.forEach((card) => {
    const row = [];

    // Column 1: Image
    const imageContainer = document.createElement('div');
    // Add field hint for xwalk
    imageContainer.appendChild(document.createComment(' field:image '));
    const img = card.querySelector('img');
    if (img) {
      const imgClone = img.cloneNode(true);
      imageContainer.appendChild(imgClone);
    }
    row.push(imageContainer);

    // Column 2: Text content
    const textContainer = document.createElement('div');
    // Add field hint for xwalk
    textContainer.appendChild(document.createComment(' field:text '));

    // Tag
    const tag = card.querySelector('.tag');
    if (tag) {
      const tagSpan = document.createElement('em');
      tagSpan.textContent = tag.textContent.trim();
      textContainer.appendChild(tagSpan);
      textContainer.appendChild(document.createTextNode(' '));
    }

    // Read time
    const readTime = card.querySelector('.paragraph-sm');
    if (readTime) {
      const timeSpan = document.createElement('span');
      timeSpan.textContent = readTime.textContent.trim();
      textContainer.appendChild(timeSpan);
      textContainer.appendChild(document.createElement('br'));
    }

    // Heading
    const heading = card.querySelector('h3');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent;
      textContainer.appendChild(h3);
    }

    // Description
    const description = card.querySelector('p:not(.paragraph-sm)');
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent;
      textContainer.appendChild(p);
    }

    // Link text
    const href = card.getAttribute('href');
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = 'Read';
      textContainer.appendChild(link);
    }

    row.push(textContainer);
    cells.push(row);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards-Articles',
    cells
  });

  element.replaceWith(block);
}
