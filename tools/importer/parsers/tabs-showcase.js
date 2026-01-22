/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-showcase block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: tabs
 *
 * Block Structure:
 * - Each row = 1 tab panel
 * - Column 1: Tab title
 * - Column 2+: Tab panel content
 *
 * Source HTML Pattern (from cleaned.html lines 162-194):
 * <div class="w-tabs">
 *   <div class="w-tab-menu">
 *     <a data-w-tab="Tab 1"><div>Tab Title</div></a>
 *   </div>
 *   <div class="w-tab-content">
 *     <div data-w-tab="Tab 1" class="w-tab-pane">
 *       <div><h3>Heading</h3><img></div>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-01-22
 */
export default function parse(element, { document }) {
  // Get all tab menu items
  const tabMenuItems = element.querySelectorAll('.w-tab-menu [data-w-tab]');
  // Get all tab panes
  const tabPanes = element.querySelectorAll('.w-tab-content .w-tab-pane');

  const cells = [];

  tabMenuItems.forEach((tabItem, index) => {
    // Get tab title text
    const titleDiv = tabItem.querySelector('div');
    const tabTitle = titleDiv ? titleDiv.textContent.trim() : `Tab ${index + 1}`;

    // Get matching tab pane by data-w-tab attribute
    const tabId = tabItem.getAttribute('data-w-tab');
    const matchingPane = element.querySelector(`.w-tab-pane[data-w-tab="${tabId}"]`);

    // Build tab title column with field hint
    const titleCol = [];
    titleCol.push(document.createComment(' field:title '));
    const titleEl = document.createElement('p');
    titleEl.textContent = tabTitle;
    titleCol.push(titleEl);

    // Build tab content column with field hints
    const contentCol = [];
    if (matchingPane) {
      // Get heading with field hint
      const heading = matchingPane.querySelector('h3, h2, .h2-heading');
      if (heading) {
        contentCol.push(document.createComment(' field:content_heading '));
        contentCol.push(heading.cloneNode(true));
      }

      // Get image with field hint
      const img = matchingPane.querySelector('img');
      if (img) {
        contentCol.push(document.createComment(' field:content_image '));
        contentCol.push(img.cloneNode(true));
      }
    }

    if (titleCol.length > 0) {
      cells.push([titleCol, contentCol]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-showcase', cells });
  element.replaceWith(block);
}
