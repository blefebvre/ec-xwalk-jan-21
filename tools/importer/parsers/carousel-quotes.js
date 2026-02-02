/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-quotes block
 *
 * Source: https://www.gigamon.com/solutions/accelerate-cloud-migration.html
 * Base Block: carousel
 *
 * Block Structure (container with carousel-quotes-item):
 * - Each slide is a row
 * - Columns: media_image (optional), content_text
 *
 * Model fields per item: media_image, media_imageAlt (collapsed), content_text
 *
 * Generated: 2026-02-02
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find quote slides/items
  const slides = element.querySelectorAll('.carousel-slide, .quote-item, [class*="slide"], .carousel-item');

  // If no specific slide containers, look for quote containers
  const quoteContainers = slides.length > 0 ? slides :
    element.querySelectorAll('[class*="quote"], [class*="testimonial"]');

  if (quoteContainers.length > 0) {
    quoteContainers.forEach((slide) => {
      // Find quote text and attribution
      const quoteText = slide.querySelector('p, .quote-text, blockquote');
      const attribution = slide.querySelector('[class*="author"], [class*="attribution"], p:last-child');

      // Build cell with field hints
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(' field:content_text '));

      if (quoteText) {
        textCell.appendChild(quoteText.cloneNode(true));
      }
      if (attribution && attribution !== quoteText) {
        textCell.appendChild(attribution.cloneNode(true));
      }

      // Check for background/speaker image
      const image = slide.querySelector('img');

      if (image) {
        const imageCell = document.createDocumentFragment();
        imageCell.appendChild(document.createComment(' field:media_image '));
        imageCell.appendChild(image.cloneNode(true));
        cells.push([imageCell, textCell]);
      } else {
        cells.push([textCell]);
      }
    });
  } else {
    // Fallback: extract all content as single item
    const cell = document.createDocumentFragment();
    cell.appendChild(document.createComment(' field:content_text '));
    Array.from(element.children).forEach((child) => {
      cell.appendChild(child.cloneNode(true));
    });
    cells.push([cell]);
  }

  // Create block
  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-quotes', cells });
  element.replaceWith(block);
}
