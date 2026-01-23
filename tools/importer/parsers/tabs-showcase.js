/**
 * Parser for tabs-showcase block variant
 * Converts tabbed content to EDS tabs block
 *
 * Source DOM: .w-tabs with tab menu and tab panes containing heading + image
 * Target: Tabs (Showcase) block with tab label and content pairs
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find tab menu items
  const tabLinks = element.querySelectorAll('.w-tab-link, [role="tab"]');

  // Find tab panes
  const tabPanes = element.querySelectorAll('.w-tab-pane, [role="tabpanel"]');

  // Match tabs with their content
  tabLinks.forEach((tabLink, index) => {
    // Get tab label
    const labelElement = tabLink.querySelector('div, span');
    const label = labelElement ? labelElement.textContent.trim() : tabLink.textContent.trim();

    // Get corresponding pane
    const pane = tabPanes[index];
    if (!pane) return;

    // Extract content from pane
    const heading = pane.querySelector('h3, h2');
    const img = pane.querySelector('img');

    // Create label cell
    const labelCell = document.createElement('div');
    // <!-- field:tabLabel -->
    labelCell.insertAdjacentHTML('afterbegin', '<!-- field:tabLabel -->');
    const labelP = document.createElement('p');
    labelP.textContent = label;
    labelCell.appendChild(labelP);

    // Create content cell
    const contentCell = document.createElement('div');

    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      contentCell.appendChild(h3);
    }

    // <!-- field:tabContent -->
    contentCell.insertAdjacentHTML('afterbegin', '<!-- field:tabContent -->');

    if (img) {
      const picture = document.createElement('picture');
      const imgClone = img.cloneNode(true);
      picture.appendChild(imgClone);
      contentCell.appendChild(picture);
    }

    cells.push([labelCell, contentCell]);
  });

  // Only create block if we found tabs
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'tabs-showcase',
      cells,
    });

    element.replaceWith(block);
  }
}
