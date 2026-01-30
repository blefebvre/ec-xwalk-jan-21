/**
 * Parser for hero-dark block variant
 * Converts .component-mega-banner elements to Hero Dark block format
 *
 * Target model fields:
 * - image: Background/hero image (collapsed field - no hint needed)
 * - imageAlt: Alt text (collapsed field - no hint needed)
 * - text: Main content (richtext - needs field hint)
 */

export default function parse(element, { document }) {
  // Find the hero image - first check for <img> elements
  let heroImage = element.querySelector('img:not(.marginline)');
  let backgroundImageUrl = null;

  // If no <img> found, check for CSS background-image on the element
  if (!heroImage) {
    const computedStyle = window.getComputedStyle(element);
    const bgImage = computedStyle.backgroundImage;
    if (bgImage && bgImage !== 'none') {
      // Extract URL from background-image: url("...")
      const urlMatch = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
      if (urlMatch && urlMatch[1]) {
        backgroundImageUrl = urlMatch[1];
      }
    }
  }

  // Find the main content area
  const contentArea = element.querySelector('.mega-content, .mega-left-clm');

  // Row 1: Image with field hints for image and imageAlt
  const imageCell = document.createElement('div');
  if (heroImage) {
    // Add field hint for image
    imageCell.appendChild(document.createComment(' field:image '));
    const imgClone = heroImage.cloneNode(true);
    // Ensure alt text is preserved - model extracts imageAlt from img alt attribute
    if (!imgClone.alt) {
      imgClone.alt = 'Hero background image';
    }
    imageCell.appendChild(imgClone);
  } else if (backgroundImageUrl) {
    // Add field hint for image
    imageCell.appendChild(document.createComment(' field:image '));
    // Create img element from CSS background-image
    const img = document.createElement('img');
    img.src = backgroundImageUrl;
    img.alt = 'Hero background image';
    imageCell.appendChild(img);
  }

  // Row 2: Text content (richtext field) with field hint
  const textCell = document.createElement('div');
  if (contentArea) {
    // Add field hint for text
    textCell.appendChild(document.createComment(' field:text '));
    // Get heading
    const heading = contentArea.querySelector('h1, h2, .component-text h1, .component-text h2');
    if (heading) {
      const h1 = document.createElement('h1');
      h1.textContent = heading.textContent.trim();
      textCell.appendChild(h1);
    }

    // Get description paragraphs
    const paragraphs = contentArea.querySelectorAll('.component-text p');
    paragraphs.forEach(p => {
      if (p.textContent.trim()) {
        const pClone = document.createElement('p');
        pClone.textContent = p.textContent.trim();
        textCell.appendChild(pClone);
      }
    });

    // Get CTA buttons
    const buttons = contentArea.querySelectorAll('.component-cta-button a, .btn');
    buttons.forEach(btn => {
      const link = document.createElement('a');
      link.href = btn.href || '#';
      link.textContent = btn.textContent.trim();
      textCell.appendChild(link);
      textCell.appendChild(document.createElement('br'));
    });
  }

  // Structure: 2 rows, 1 column each
  // Row 1: image (imageAlt extracted from img alt attribute) - only if image exists
  // Row 2: text content
  const cells = [];

  // Only add image row if there's an actual image
  if (imageCell.hasChildNodes()) {
    cells.push([imageCell]);
  }

  // Always add text row if there's content
  if (textCell.hasChildNodes()) {
    cells.push([textCell]);
  }

  // Create block using WebImporter helper
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Hero Dark',
    cells: cells
  });

  element.replaceWith(block);
}
