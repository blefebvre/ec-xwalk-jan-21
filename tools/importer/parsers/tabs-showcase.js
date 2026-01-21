/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-showcase block variant
 * Purpose: Tabbed content with heading and banner image per tab
 * Selector: .section.inverse-section .w-tabs
 * Generated: 2026-01-21
 * Validated: 2026-01-21
 *
 * Field hints for xwalk:
 * - title: tab label (collapsed)
 * - content_heading: tab content heading
 * - content_headingType: heading type (h2, h3, etc.)
 * - content_image: tab content image
 * - content_richtext: additional rich text content
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find tab menu links
  const tabLinks = element.querySelectorAll('.w-tab-link');
  // Find tab panes
  const tabPanes = element.querySelectorAll('.w-tab-pane');

  // Create one row per tab
  tabLinks.forEach((tabLink, index) => {
    const row = [];
    const pane = tabPanes[index];

    // Column 1: Tab title (collapsed)
    const titleContainer = document.createElement('div');
    // Add field hint for xwalk
    titleContainer.appendChild(document.createComment(' field:title '));
    const titleText = tabLink.textContent.trim();
    const titleSpan = document.createElement('strong');
    titleSpan.textContent = titleText;
    titleContainer.appendChild(titleSpan);
    row.push(titleContainer);

    // Column 2: Tab content (heading, image, richtext)
    const contentContainer = document.createElement('div');

    if (pane) {
      // Heading with type hint
      const heading = pane.querySelector('h3, h2');
      if (heading) {
        // Add field hint for heading
        contentContainer.appendChild(document.createComment(' field:content_heading '));
        const h = document.createElement(heading.tagName.toLowerCase());
        h.textContent = heading.textContent;
        contentContainer.appendChild(h);
      }

      // Image
      const img = pane.querySelector('img');
      if (img) {
        contentContainer.appendChild(document.createComment(' field:content_image '));
        const imgClone = img.cloneNode(true);
        contentContainer.appendChild(imgClone);
      }

      // Additional richtext (if any paragraph exists)
      const additionalText = pane.querySelector('p');
      if (additionalText) {
        contentContainer.appendChild(document.createComment(' field:content_richtext '));
        const p = document.createElement('p');
        p.textContent = additionalText.textContent;
        contentContainer.appendChild(p);
      }
    }

    row.push(contentContainer);
    cells.push(row);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Tabs-Showcase',
    cells
  });

  element.replaceWith(block);
}
