/**
 * Hero block parser
 * Converts marquee/hero section with background image, text overlay, and CTA
 *
 * Expected output structure (matching xwalk model):
 * Row 1: Background image (maps to 'image' reference field)
 * Row 2: ALL text content in a SINGLE cell (maps to 'text' richtext field)
 *
 * Model fields: image, imageAlt, text
 * Field hints use HTML comments: <!-- field: fieldName -->
 */

export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Background image (maps to 'image' field)
  const imageRow = [];
  const imageCell = document.createElement('div');

  // Field hint for image field
  imageCell.appendChild(document.createComment('field:image'));

  const bgStyle = element.querySelector('[style*="background-image"]');
  if (bgStyle) {
    const bgMatch = bgStyle.getAttribute('style').match(/url\(['"]?([^'")\s]+)['"]?\)/);
    if (bgMatch) {
      const img = document.createElement('img');
      img.src = bgMatch[1];
      img.alt = 'Hero background';
      imageCell.appendChild(img);
    }
  }
  imageRow.push(imageCell);
  cells.push(imageRow);

  // Row 2: ALL text content in a SINGLE cell (maps to 'text' field)
  const contentRow = [];
  const contentCell = document.createElement('div');

  // Field hint for text field
  contentCell.appendChild(document.createComment('field:text'));

  // Eyebrow text (small heading above main title)
  const eyebrow = element.querySelector('h3');
  if (eyebrow) {
    const eyebrowEl = document.createElement('p');
    eyebrowEl.textContent = eyebrow.textContent.trim();
    contentCell.appendChild(eyebrowEl);
  }

  // Main heading
  const heading = element.querySelector('h2');
  if (heading) {
    const headingEl = document.createElement('h1');
    headingEl.textContent = heading.textContent.trim();
    contentCell.appendChild(headingEl);
  }

  // Description paragraphs (exclude legal text)
  const paragraphs = element.querySelectorAll('p:not(.legal-text)');
  paragraphs.forEach((p) => {
    const text = p.textContent.trim();
    if (text && text.length > 10) { // Skip very short text fragments
      const descP = document.createElement('p');
      descP.textContent = text;
      contentCell.appendChild(descP);
    }
  });

  // CTA button
  const cta = element.querySelector('a.att-button, a[class*="button"]');
  if (cta) {
    const ctaP = document.createElement('p');
    const anchor = document.createElement('a');
    anchor.href = cta.href;
    anchor.textContent = cta.textContent.trim();
    ctaP.appendChild(anchor);
    contentCell.appendChild(ctaP);
  }

  contentRow.push(contentCell);
  cells.push(contentRow);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Hero',
    cells,
  });

  element.replaceWith(block);
}
