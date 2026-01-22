/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-articles block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: cards
 *
 * Block Structure:
 * - Each row = 1 article card
 * - Column 1: Image
 * - Column 2: Tag, read time, heading, description, link
 *
 * Source HTML Pattern (from cleaned.html lines 99-156):
 * <div class="w-layout-grid grid-layout tablet-1-column grid-gap-md">
 *   <a href="..." class="utility-link-content-block w-inline-block">
 *     <div class="w-layout-grid">
 *       <img>
 *       <div>
 *         <div class="tag"><div>Category</div></div>
 *         <div class="paragraph-sm">X min read</div>
 *         <h3 class="h4-heading">Title</h3>
 *         <p>Description</p>
 *         <div>Read</div>
 *       </div>
 *     </div>
 *   </a>
 * </div>
 *
 * Generated: 2026-01-22
 */
export default function parse(element, { document }) {
  // Extract article cards - find all article link elements within the grid
  // Selector: .secondary-section .grid-layout.tablet-1-column.grid-gap-md
  const articleLinks = element.querySelectorAll('a.utility-link-content-block');

  const cells = [];

  articleLinks.forEach((articleLink) => {
    // Get the image
    const img = articleLink.querySelector('img');

    // Get the tag text (nested in div > div)
    const tagDiv = articleLink.querySelector('.tag');
    const tagText = tagDiv ? tagDiv.textContent.trim() : '';

    // Get read time
    const readTimeDiv = articleLink.querySelector('.paragraph-sm');
    const readTime = readTimeDiv ? readTimeDiv.textContent.trim() : '';

    // Get heading
    const heading = articleLink.querySelector('h3, .h4-heading');

    // Get description paragraph
    const description = articleLink.querySelector('p');

    // Build image column with field hint
    const imageCol = [];
    if (img) {
      imageCol.push(document.createComment(' field:image '));
      imageCol.push(img.cloneNode(true));
    }

    // Build content column with field hint
    const contentCol = [];
    contentCol.push(document.createComment(' field:text '));

    // Add tag as a div
    if (tagText) {
      const tagEl = document.createElement('div');
      tagEl.textContent = tagText;
      contentCol.push(tagEl);
    }

    // Add read time
    if (readTime) {
      const timeEl = document.createElement('div');
      timeEl.textContent = readTime;
      contentCol.push(timeEl);
    }

    // Add heading
    if (heading) {
      contentCol.push(heading.cloneNode(true));
    }

    // Add description
    if (description) {
      contentCol.push(description.cloneNode(true));
    }

    // Create link for "Read" action using the article's href
    const href = articleLink.getAttribute('href');
    if (href) {
      const readLink = document.createElement('a');
      readLink.href = href;
      readLink.textContent = 'Read';
      contentCol.push(readLink);
    }

    if (imageCol.length > 0 || contentCol.length > 0) {
      cells.push([imageCol, contentCol]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-articles', cells });
  element.replaceWith(block);
}
