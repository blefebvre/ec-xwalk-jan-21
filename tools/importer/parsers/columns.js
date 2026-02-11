/* eslint-disable */
/* global WebImporter */

/**
 * Columns block parser
 * Converts side-by-side layouts into Columns block.
 *
 * Handles two source patterns:
 * 1. .image-text — Image left + text right (FirstNet Promise section)
 * 2. .icon-list — Icon list items side by side (Get Started section)
 *
 * Expected output structure:
 * Single row with 2 columns:
 * - Column 1: First content area (image or icon+text)
 * - Column 2: Second content area (text or icon+text)
 */

export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: Image-text component (.image-text)
  const imageTextContainer = element.querySelector('.image-text-container');
  if (imageTextContainer) {
    const row = [];

    // Column 1: Image
    const imageCell = document.createElement('div');
    const imgEl = imageTextContainer.querySelector('.col-image img');
    if (imgEl) {
      const newImg = document.createElement('img');
      newImg.src = imgEl.src;
      newImg.alt = imgEl.alt || '';
      imageCell.appendChild(newImg);
    }
    row.push(imageCell);

    // Column 2: Text content
    const textCell = document.createElement('div');

    // Title
    const title = imageTextContainer.querySelector('.imgtxt-title');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      textCell.appendChild(h3);
    }

    // Subtitle/description paragraphs
    const subtitleDiv = imageTextContainer.querySelector('.imgtxt-subtitle');
    if (subtitleDiv) {
      const paragraphs = subtitleDiv.querySelectorAll('p');
      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (text) {
          const newP = document.createElement('p');
          newP.textContent = text;
          textCell.appendChild(newP);
        }
      });
    }

    // CTA buttons/links
    const links = imageTextContainer.querySelectorAll('.col-text > div > a');
    links.forEach((link) => {
      const text = link.textContent.trim();
      if (text && link.href) {
        const ctaP = document.createElement('p');
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.textContent = text;
        ctaP.appendChild(anchor);
        textCell.appendChild(ctaP);
      }
    });

    row.push(textCell);
    cells.push(row);
  }

  // Pattern 2: Icon list (.icon-list)
  const iconListContainer = element.querySelector('.icon-list-container');
  if (iconListContainer && !imageTextContainer) {
    const listItems = iconListContainer.querySelectorAll('ul > li');
    if (listItems.length > 0) {
      const row = [];

      listItems.forEach((li) => {
        const cell = document.createElement('div');

        // Icon image
        const icon = li.querySelector('.icon-list-image');
        if (icon) {
          const newImg = document.createElement('img');
          newImg.src = icon.src;
          newImg.alt = icon.alt || '';
          cell.appendChild(newImg);
        }

        // Heading
        const heading = li.querySelector('h3');
        if (heading) {
          const h3 = document.createElement('h3');
          h3.textContent = heading.textContent.trim();
          cell.appendChild(h3);
        }

        // Description paragraphs
        const paragraphs = li.querySelectorAll('p');
        paragraphs.forEach((p) => {
          // Skip paragraphs that only contain links (handled below)
          if (p.children.length === 1 && p.querySelector('a')) return;
          const text = p.textContent.trim();
          if (text) {
            const newP = document.createElement('p');
            newP.textContent = text;
            cell.appendChild(newP);
          }
        });

        // CTA link
        const link = li.querySelector('p > a');
        if (link) {
          const ctaP = document.createElement('p');
          const anchor = document.createElement('a');
          anchor.href = link.href;
          anchor.textContent = link.textContent.trim();
          ctaP.appendChild(anchor);
          cell.appendChild(ctaP);
        }

        row.push(cell);
      });

      cells.push(row);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns',
    cells,
  });

  element.replaceWith(block);
}
