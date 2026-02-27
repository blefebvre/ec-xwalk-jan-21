/* eslint-disable */
/* global WebImporter */

/**
 * Cards-pricing block parser -
 * Converts .table-comparison pricing cards into Cards Pricing block.
 *
 * Each row = one pricing card with 2 cells:
 * - Column 1: Plan name/heading
 * - Column 2: Pricing details (tier, price, features, CTAs)
 */

export default function parse(element, { document }) {
  const cells = [];

  const cards = element.querySelectorAll('.table-item, .swiper-slide');

  cards.forEach((card) => {
    const row = [];

    // Column 1: Plan name
    const nameCell = document.createElement('div');
    const planName = card.querySelector('.plan-name');
    if (planName) {
      const h3 = document.createElement('h3');
      h3.textContent = planName.textContent.trim();
      nameCell.appendChild(h3);
    }
    row.push(nameCell);

    // Column 2: Pricing details
    const detailsCell = document.createElement('div');

    // Price tier/label
    const priceLabel = card.querySelector('.price-option-label');
    if (priceLabel) {
      const tierP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = priceLabel.textContent.trim();
      tierP.appendChild(strong);
      detailsCell.appendChild(tierP);
    }

    // Price
    const price = card.querySelector('.plan-price');
    if (price) {
      const priceP = document.createElement('p');
      priceP.textContent = price.textContent.trim();
      detailsCell.appendChild(priceP);
    }

    // Features/options
    const features = card.querySelector('.options-label');
    if (features) {
      const featP = document.createElement('p');
      featP.textContent = features.textContent.trim();
      detailsCell.appendChild(featP);
    }

    // Plan feature list (expandable items)
    const featureItems = card.querySelectorAll('.accordion-title, .plan-features-header');
    if (featureItems.length > 0) {
      const ul = document.createElement('ul');
      featureItems.forEach((item) => {
        const text = item.textContent.trim();
        if (text) {
          const li = document.createElement('li');
          li.textContent = text;
          ul.appendChild(li);
        }
      });
      if (ul.children.length > 0) {
        detailsCell.appendChild(ul);
      }
    }

    // Dropdown selection (e.g., user type selector)
    const select = card.querySelector('select');
    if (select) {
      const options = [...select.querySelectorAll('option')].map((o) => o.textContent.trim());
      if (options.length > 0) {
        const optP = document.createElement('p');
        optP.textContent = `Options: ${options.join(', ')}`;
        detailsCell.appendChild(optP);
      }
    }

    // CTA links
    const links = card.querySelectorAll('a');
    links.forEach((link) => {
      const text = link.textContent.trim();
      if (link.href && text && !text.startsWith('#') && text !== '') {
        // Skip internal anchor links
        if (link.href.includes('#collapse-')) return;
        const linkP = document.createElement('p');
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.textContent = text;
        linkP.appendChild(anchor);
        detailsCell.appendChild(linkP);
      }
    });

    row.push(detailsCell);
    cells.push(row);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards Pricing',
    cells,
  });

  element.replaceWith(block);
}
