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
 *
 * Contact section (gray style) includes:
 * - H3: "Connect with a FirstNet specialist"
 * - "Contact us" link
 */

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  const { document } = payload;

  // === DARK SECTION ===
  // Find the specific H2 that starts the dark section
  const whyFirstNetH2 = Array.from(element.querySelectorAll('h2')).find(
    (h2) => h2.textContent.trim() === 'Why FirstNet for 5G public safety'
  );

  // Find the H3 that marks the end of the dark section
  const latestNewsH3 = Array.from(element.querySelectorAll('h3')).find(
    (h3) => h3.textContent.includes('Latest news from public safety')
  );

  if (whyFirstNetH2 && latestNewsH3) {
    // Create Section Metadata block for dark style
    const darkSectionMetadata = WebImporter.Blocks.createBlock(document, {
      name: 'Section Metadata',
      cells: [
        [createTextDiv(document, 'Style'), createTextDiv(document, 'dark')]
      ]
    });

    // Insert HR before the H2 (creates section break before dark section)
    const hrBeforeDark = document.createElement('hr');
    whyFirstNetH2.parentElement.insertBefore(hrBeforeDark, whyFirstNetH2);

    // Insert Section Metadata and HR before the "Latest news" H3
    const hrAfterDark = document.createElement('hr');
    latestNewsH3.parentElement.insertBefore(darkSectionMetadata, latestNewsH3);
    latestNewsH3.parentElement.insertBefore(hrAfterDark, latestNewsH3);
  }

  // === CONTACT SECTION ===
  // Find the "Connect with a FirstNet specialist" H3 element
  let connectElement = null;
  const allH3s = element.querySelectorAll('h3');
  for (const h3 of allH3s) {
    if (h3.textContent.includes('Connect with a FirstNet specialist')) {
      connectElement = h3;
      break;
    }
  }

  // Find the form-newsletter block (table after parsing)
  const formNewsletter = element.querySelector('table.form-newsletter');

  if (connectElement && formNewsletter) {
    // Find closest experience fragment or meaningful wrapper for the connect element
    let connectWrapper = connectElement.closest('.experiencefragment') ||
                         connectElement.closest('.xf-content-height') ||
                         connectElement.closest('.text.parbase') ||
                         connectElement.parentElement;

    // Create Section Metadata block for gray style
    const graySectionMetadata = WebImporter.Blocks.createBlock(document, {
      name: 'Section Metadata',
      cells: [
        [createTextDiv(document, 'Style'), createTextDiv(document, 'gray')]
      ]
    });

    // Insert HR before the connect wrapper (start of gray section)
    const hrBeforeContact = document.createElement('hr');
    if (connectWrapper && connectWrapper.parentElement) {
      connectWrapper.parentElement.insertBefore(hrBeforeContact, connectWrapper);
    }

    // Insert Section Metadata and HR before the form-newsletter table (end of gray section)
    const hrAfterContact = document.createElement('hr');
    if (formNewsletter.parentElement) {
      formNewsletter.parentElement.insertBefore(graySectionMetadata, formNewsletter);
      formNewsletter.parentElement.insertBefore(hrAfterContact, formNewsletter);
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
