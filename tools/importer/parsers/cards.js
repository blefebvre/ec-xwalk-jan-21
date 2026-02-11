/* eslint-disable */
/* global WebImporter */

/**
 * Cards block parser
 * Converts card grids (eligibility cards, case study teasers) into Cards block.
 *
 * Handles two source patterns:
 * 1. .new-offers-card .card-tile — eligibility/offer cards with image, eyebrow, heading, body, CTA
 * 2. .content-teaser .item — case study teaser cards with image, title, description, CTA
 *
 * Expected output structure:
 * Each row = one card with 2 cells:
 * - Column 1: Card image
 * - Column 2: Text content (heading, description, link)
 */

export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: Offer/eligibility cards (.card-tile)
  const cardTiles = element.querySelectorAll('.card-tile');
  if (cardTiles.length > 0) {
    cardTiles.forEach((card) => {
      const row = [];

      // Column 1: Image
      const imageCell = document.createElement('div');
      const img = card.querySelector('.img-section img');
      if (img) {
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt || '';
        imageCell.appendChild(newImg);
      }
      row.push(imageCell);

      // Column 2: Text content
      const textCell = document.createElement('div');

      // Eyebrow
      const eyebrow = card.querySelector('.eyebrow');
      if (eyebrow) {
        const eyebrowP = document.createElement('p');
        const em = document.createElement('em');
        em.textContent = eyebrow.textContent.trim();
        eyebrowP.appendChild(em);
        textCell.appendChild(eyebrowP);
      }

      // Heading
      const heading = card.querySelector('.heading');
      if (heading) {
        const h3 = document.createElement('h3');
        h3.textContent = heading.textContent.trim();
        textCell.appendChild(h3);
      }

      // Body text
      const bodyText = card.querySelector('.bodyText p');
      if (bodyText) {
        const p = document.createElement('p');
        p.textContent = bodyText.textContent.trim();
        textCell.appendChild(p);
      }

      // CTA link
      const cta = card.querySelector('.cta-section a');
      if (cta) {
        const ctaP = document.createElement('p');
        const anchor = document.createElement('a');
        anchor.href = cta.href;
        anchor.textContent = cta.textContent.trim();
        ctaP.appendChild(anchor);
        textCell.appendChild(ctaP);
      }

      row.push(textCell);
      cells.push(row);
    });
  }

  // Pattern 2: Content teaser cards (.item)
  const teaserItems = element.querySelectorAll('.swiper-wrapper .item');
  if (teaserItems.length > 0 && cardTiles.length === 0) {
    teaserItems.forEach((item) => {
      const row = [];

      // Column 1: Image
      const imageCell = document.createElement('div');
      const img = item.querySelector('.image-wrapper img')
        || item.querySelector('.image-wrapper-container img')
        || item.querySelector('img');
      if (img) {
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt || '';
        imageCell.appendChild(newImg);
      }
      row.push(imageCell);

      // Column 2: Text content
      const textCell = document.createElement('div');

      // Title
      const title = item.querySelector('.item-title');
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        textCell.appendChild(h3);
      }

      // Description
      const desc = item.querySelector('.item-description');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textCell.appendChild(p);
      }

      // CTA link (from parent anchor)
      const link = item.querySelector('a.att-track');
      if (link && link.href) {
        const ctaP = document.createElement('p');
        const anchor = document.createElement('a');
        anchor.href = link.href;
        const ctaText = item.querySelector('.cta-btn .att-button');
        anchor.textContent = ctaText ? ctaText.textContent.trim() : 'Read more';
        ctaP.appendChild(anchor);
        textCell.appendChild(ctaP);
      }

      row.push(textCell);
      cells.push(row);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards',
    cells,
  });

  element.replaceWith(block);
}
