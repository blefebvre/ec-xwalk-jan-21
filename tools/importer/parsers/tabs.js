/* eslint-disable */
/* global WebImporter */

/**
 * Tabs block parser -
 * Converts .tabs.parbase tabbed components into Tabs block.
 *
 * Extracts tab labels and their panel content.
 * Each row = one tab with 2 cells:
 * - Column 1: Tab label
 * - Column 2: Tab panel content (rich text)
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find tab labels
  const tabLabels = element.querySelectorAll('.tablist label');
  const tabPanels = element.querySelectorAll('.tab-panel');

  tabPanels.forEach((panel, index) => {
    const row = [];

    // Column 1: Tab label
    const labelCell = document.createElement('div');
    const labelText = tabLabels[index]
      ? tabLabels[index].textContent.trim()
      : `Tab ${index + 1}`;
    const labelP = document.createElement('p');
    labelP.textContent = labelText;
    labelCell.appendChild(labelP);
    row.push(labelCell);

    // Column 2: Tab content
    const contentCell = document.createElement('div');

    // Extract headings from segment-heading components
    const headings = panel.querySelectorAll('.segment-heading h2, .segment-heading h3');
    headings.forEach((h) => {
      const heading = document.createElement(h.tagName.toLowerCase());
      heading.textContent = h.textContent.trim();
      contentCell.appendChild(heading);
    });

    // Extract image-text content (FirstNet and Family section)
    const imageText = panel.querySelector('.image-text');
    if (imageText) {
      const img = imageText.querySelector('img');
      if (img) {
        const imgSrc = img.getAttribute('data-src') || img.src;
        if (imgSrc && !imgSrc.startsWith('data:')) {
          const newImg = document.createElement('img');
          newImg.src = imgSrc;
          newImg.alt = img.alt || '';
          const imgP = document.createElement('p');
          imgP.appendChild(newImg);
          contentCell.appendChild(imgP);
        }
      }

      // Get text content
      const textDiv = imageText.querySelector('.col-text');
      if (textDiv) {
        const paragraphs = textDiv.querySelectorAll('p, li');
        paragraphs.forEach((p) => {
          const text = p.textContent.trim();
          if (text) {
            const newP = document.createElement('p');
            newP.textContent = text;
            contentCell.appendChild(newP);
          }
        });
      }

      // Get CTA
      const cta = imageText.querySelector('a.att-button, a.att-track');
      if (cta && cta.href) {
        const ctaP = document.createElement('p');
        const anchor = document.createElement('a');
        anchor.href = cta.href;
        anchor.textContent = cta.textContent.trim();
        ctaP.appendChild(anchor);
        contentCell.appendChild(ctaP);
      }
    }

    // Extract pricing table content (table-comparison)
    const tables = panel.querySelectorAll('.table-comparison');
    tables.forEach((table) => {
      const cards = table.querySelectorAll('.table-item, .swiper-slide');
      cards.forEach((card) => {
        const planName = card.querySelector('.plan-name');
        const priceLabel = card.querySelector('.price-option-label');
        const price = card.querySelector('.plan-price');
        const features = card.querySelector('.options-label');

        if (planName || price) {
          // Plan heading
          if (planName) {
            const h4 = document.createElement('h4');
            h4.textContent = planName.textContent.trim();
            contentCell.appendChild(h4);
          }
          // Price tier
          if (priceLabel) {
            const tierP = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = priceLabel.textContent.trim();
            tierP.appendChild(strong);
            contentCell.appendChild(tierP);
          }
          // Price
          if (price) {
            const priceP = document.createElement('p');
            priceP.textContent = price.textContent.trim();
            contentCell.appendChild(priceP);
          }
          // Features
          if (features) {
            const featP = document.createElement('p');
            featP.textContent = features.textContent.trim();
            contentCell.appendChild(featP);
          }
          // Links
          const links = card.querySelectorAll('a');
          links.forEach((link) => {
            if (link.href && link.textContent.trim()) {
              const linkP = document.createElement('p');
              const anchor = document.createElement('a');
              anchor.href = link.href;
              anchor.textContent = link.textContent.trim();
              linkP.appendChild(anchor);
              contentCell.appendChild(linkP);
            }
          });
          // Separator
          contentCell.appendChild(document.createElement('hr'));
        }
      });
    });

    // Extract standalone text/legal content
    const textBlocks = panel.querySelectorAll(':scope > .text, :scope > .legal-text');
    textBlocks.forEach((tb) => {
      const paragraphs = tb.querySelectorAll('p');
      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (text) {
          const newP = document.createElement('p');
          const em = document.createElement('em');
          em.textContent = text;
          newP.appendChild(em);
          contentCell.appendChild(newP);
        }
      });
    });

    row.push(contentCell);
    cells.push(row);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Tabs',
    cells,
  });

  element.replaceWith(block);
}
