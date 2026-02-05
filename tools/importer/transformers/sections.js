/**
 * Section Transformer
 * Creates EDS sections with section metadata for styled areas
 *
 * Sections in EDS are created using horizontal rules (<hr>) as dividers.
 * Section Metadata blocks are added to apply styles (e.g., "dark" background).
 *
 * Dark section includes:
 * - H2: "Why FirstNet for 5G public safety"
 * - H3: "Built from the ground up..."
 * - Columns (icons) block
 * - "Learn more" link
 * - Legal text about 5G
 */

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  const { document } = payload;

  // Find the specific H2 that starts the dark section
  const whyFirstNetH2 = Array.from(element.querySelectorAll('h2')).find(
    (h2) => h2.textContent.trim() === 'Why FirstNet for 5G public safety'
  );

  if (!whyFirstNetH2) return;

  // Find the H3 that marks the end of the dark section
  const latestNewsH3 = Array.from(element.querySelectorAll('h3')).find(
    (h3) => h3.textContent.includes('Latest news from public safety')
  );

  if (!latestNewsH3) return;

  // Create Section Metadata block for dark style
  const sectionMetadata = WebImporter.Blocks.createBlock(document, {
    name: 'Section Metadata',
    cells: [
      [createTextDiv(document, 'Style'), createTextDiv(document, 'dark')]
    ]
  });

  // Insert HR before the H2 (creates section break before dark section)
  const hrBefore = document.createElement('hr');
  whyFirstNetH2.parentElement.insertBefore(hrBefore, whyFirstNetH2);

  // Insert Section Metadata and HR before the "Latest news" H3
  const hrAfter = document.createElement('hr');
  latestNewsH3.parentElement.insertBefore(sectionMetadata, latestNewsH3);
  latestNewsH3.parentElement.insertBefore(hrAfter, latestNewsH3);
}

/**
 * Helper to create a div with text content
 */
function createTextDiv(document, text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div;
}
