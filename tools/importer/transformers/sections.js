/**
 * Section Transformer
 * Creates EDS sections with section metadata for styled areas.
 *
 * Sections in EDS are created using horizontal rules (<hr>) as dividers.
 * Section Metadata blocks are added to apply styles (e.g., "dark", "grey").
 *
 * This transformer reads section definitions from payload.template.sections
 * and inserts section breaks and metadata blocks between content sections.
 *
 * IMPORTANT: During afterTransform, parsed blocks are TABLE elements (from createBlock),
 * not DIVs with class names. Block names are in the TH header text of each table.
 */

/* global WebImporter */

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  const { document, template } = payload;
  if (!template || !template.sections || template.sections.length < 2) return;

  const sections = template.sections;
  const claimed = new Set();

  /**
   * Find a parsed block TABLE by its block name (text in TH header).
   * During afterTransform, createBlock produces TABLE elements with TH headers.
   */
  function findBlockTable(blockName, searchRoot) {
    const tables = searchRoot.querySelectorAll('table');
    for (const table of tables) {
      if (claimed.has(table)) continue;
      const th = table.querySelector('th');
      if (th) {
        // Block names in TH: "Hero", "Cards", "Columns", "Accordion", etc.
        const thText = th.textContent.trim().toLowerCase().replace(/\s+/g, '-');
        if (thText === blockName.toLowerCase()) {
          return table;
        }
      }
    }
    return null;
  }

  // Find the first block table to determine the correct content level
  const firstTable = element.querySelector('table');
  if (!firstTable) return;

  // The content container is the parent that directly contains block tables and headings
  const contentContainer = firstTable.parentElement;
  if (!contentContainer) return;

  const sectionAnchors = [];

  for (const section of sections) {
    let anchor = null;

    // Try blocks first - find TABLE elements with matching TH headers
    if (section.blocks && section.blocks.length > 0) {
      for (const blockName of section.blocks) {
        const table = findBlockTable(blockName, contentContainer);
        if (table) {
          anchor = table;
          claimed.add(table);
          break;
        }
      }
    }

    // If no block found, try to find by heading content
    if (!anchor && section.defaultContent && section.defaultContent.length > 0) {
      const headings = contentContainer.querySelectorAll('h2');
      for (const h of headings) {
        if (!claimed.has(h)) {
          anchor = h;
          claimed.add(h);
          break;
        }
      }
    }

    sectionAnchors.push({ section, anchor });
  }

  // Insert section breaks and metadata
  for (let i = 1; i < sectionAnchors.length; i++) {
    const { anchor } = sectionAnchors[i];
    if (!anchor) continue;

    // Walk up anchor to be a direct child of contentContainer
    let target = anchor;
    while (target.parentElement && target.parentElement !== contentContainer) {
      target = target.parentElement;
    }
    // Safety check: target must actually be a child of contentContainer
    if (target.parentElement !== contentContainer) continue;

    // If previous section had a style, add Section Metadata before the break
    const prevSection = sectionAnchors[i - 1].section;
    if (prevSection.style) {
      const sectionMetadata = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: [
          [createTextDiv(document, 'style'), createTextDiv(document, prevSection.style)],
        ],
      });
      contentContainer.insertBefore(sectionMetadata, target);
    }

    // Insert section break <hr>
    const hr = document.createElement('hr');
    contentContainer.insertBefore(hr, target);
  }

  // Handle the last section's style
  const lastSection = sectionAnchors[sectionAnchors.length - 1];
  if (lastSection && lastSection.section.style) {
    const sectionMetadata = WebImporter.Blocks.createBlock(document, {
      name: 'Section Metadata',
      cells: [
        [createTextDiv(document, 'style'), createTextDiv(document, lastSection.section.style)],
      ],
    });
    // Insert before the page Metadata table
    const metadataTable = findBlockTable('metadata', contentContainer);
    if (metadataTable) {
      contentContainer.insertBefore(sectionMetadata, metadataTable);
    } else {
      contentContainer.appendChild(sectionMetadata);
    }
  }
}

/**
 * Helper to create a div with text content
 */
function createTextDiv(document, text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div;
}
