/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-promo block
 *
 * Source: https://www.gigamon.com/solutions/accelerate-cloud-migration.html
 * Base Block: cards
 *
 * Block Structure (container block with card items):
 * - Each card is a row with: image (optional), text
 *
 * Source HTML Pattern (from cleaned.html):
 * <div class="promo">
 *   <p>ESG TECHNICAL VALIDATION</p>
 *   <p>Description text...</p>
 *   <a href="#">READ REPORT</a>
 * </div>
 *
 * Model fields per card: image, text
 *
 * Generated: 2026-02-02
 */
export default function parse(element, { document }) {
  // Extract content from promo card
  // Using validated selectors from cleaned.html DOM structure
  const paragraphs = Array.from(element.querySelectorAll('p'));
  const link = element.querySelector('a');

  // Build cells array - single card (one row)
  const cells = [];

  // Row 1: Card content (text cell with all content)
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));

  // Add eyebrow text (first paragraph)
  if (paragraphs.length > 0) {
    const eyebrow = document.createElement('p');
    eyebrow.innerHTML = `<strong>${paragraphs[0].textContent}</strong>`;
    textCell.appendChild(eyebrow);
  }

  // Add description (second paragraph)
  if (paragraphs.length > 1) {
    textCell.appendChild(paragraphs[1].cloneNode(true));
  }

  // Add CTA link
  if (link) {
    const linkP = document.createElement('p');
    linkP.appendChild(link.cloneNode(true));
    textCell.appendChild(linkP);
  }

  cells.push([textCell]);

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
