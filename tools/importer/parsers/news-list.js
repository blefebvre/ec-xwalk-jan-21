/* eslint-disable */
/* global WebImporter */

/**
 * Parser for news-list. Base: news-list. Source: https://www.firstnet.com/community.html
 * Generated: 2026-02-23
 *
 * Converts .icon-list:has(.hide-icons) into News List block.
 * Source structure: <ul class="hide-icons"> with <li> items.
 * Each <li> contains:
 * - h5: date (e.g., "February 5, 2026") — sometimes wrapped in <span>
 * - p: title text — sometimes wrapped in <span>
 * - h5: description text (the second h5 without a link)
 * - h4/h5/span > a: "Read more" link with href
 *
 * Target (xwalk container block, per _news-list.json model):
 * Each row = one news-item with 2 cells:
 * - Cell 1: date (text field)
 * - Cell 2: content (richtext: title, description, link)
 *
 * Model fields: date (text), content (richtext)
 */

export default function parse(element, { document }) {
  const cells = [];

  const newsItems = element.querySelectorAll('ul.hide-icons > li');

  newsItems.forEach((li) => {
    const row = [];

    // Cell 1: Date (maps to 'date' text field)
    const dateCell = document.createElement('div');
    dateCell.appendChild(document.createComment(' field:date '));

    // First h5 in each li is the date
    const dateEl = li.querySelector(':scope > h5:first-of-type');
    if (dateEl) {
      const dateP = document.createElement('p');
      dateP.textContent = dateEl.textContent.trim();
      dateCell.appendChild(dateP);
    }
    row.push(dateCell);

    // Cell 2: Content (maps to 'content' richtext field)
    const contentCell = document.createElement('div');
    contentCell.appendChild(document.createComment(' field:content '));

    // Title — the <p> element in each li
    const titleEl = li.querySelector(':scope > p');
    if (titleEl) {
      const titleP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      titleP.appendChild(strong);
      contentCell.appendChild(titleP);
    }

    // Description — the h5 that does NOT contain a link and is NOT the date (first h5)
    // Iterate h5 elements: first is date, subsequent ones without links are descriptions
    const allH5s = li.querySelectorAll(':scope > h5');
    for (let i = 1; i < allH5s.length; i++) {
      const h5 = allH5s[i];
      // Skip h5 elements that contain a link (those are "Read more" links)
      if (h5.querySelector('a')) continue;
      const descText = h5.textContent.trim();
      if (descText) {
        const descP = document.createElement('p');
        descP.textContent = descText;
        contentCell.appendChild(descP);
      }
      break; // Only take the first description h5
    }

    // Read more link — find the <a> element (can be nested in h4, h5, or span)
    const readMoreLink = li.querySelector('a[href]');
    if (readMoreLink) {
      // Verify it's not inside the date element (first h5)
      const dateH5 = li.querySelector(':scope > h5:first-of-type');
      const isInsideDate = dateH5 && dateH5.contains(readMoreLink);
      if (!isInsideDate && readMoreLink.href) {
        const linkP = document.createElement('p');
        const anchor = document.createElement('a');
        anchor.href = readMoreLink.href;
        anchor.textContent = readMoreLink.textContent.trim() || 'Read more';
        linkP.appendChild(anchor);
        contentCell.appendChild(linkP);
      }
    }

    row.push(contentCell);
    cells.push(row);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'news-list', cells });
  element.replaceWith(block);
}
