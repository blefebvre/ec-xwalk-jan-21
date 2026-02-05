/**
 * Form-newsletter block parser
 * Converts email signup form section
 *
 * Expected output structure (matching xwalk model):
 * 3 rows (one per field), each with 1 column:
 * - Row 1: Heading (maps to 'heading' field)
 * - Row 2: Subheading (maps to 'subheading' field)
 * - Row 3: Form content (maps to 'form' richtext field)
 */

export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Heading (maps to 'heading' field)
  const headingCell = document.createElement('div');
  headingCell.appendChild(document.createComment('field:heading'));

  const eyebrow = element.querySelector('.eyebrow, [class*="eyebrow"], .label');
  const heading = element.querySelector('h2, h3');
  if (eyebrow) {
    const p = document.createElement('p');
    p.textContent = eyebrow.textContent.trim();
    headingCell.appendChild(p);
  } else if (heading) {
    const p = document.createElement('p');
    p.textContent = heading.textContent.trim();
    headingCell.appendChild(p);
  }
  cells.push([headingCell]);

  // Row 2: Subheading (maps to 'subheading' field)
  const subheadingCell = document.createElement('div');
  subheadingCell.appendChild(document.createComment('field:subheading'));

  // If we used eyebrow for heading, use the h2/h3 for subheading
  if (eyebrow && heading) {
    const p = document.createElement('p');
    p.textContent = heading.textContent.trim();
    subheadingCell.appendChild(p);
  } else {
    // Look for description paragraph
    const desc = element.querySelector('p:not(.eyebrow):not(.label)');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      subheadingCell.appendChild(p);
    }
  }
  cells.push([subheadingCell]);

  // Row 3: Form content (maps to 'form' richtext field)
  const formCell = document.createElement('div');
  formCell.appendChild(document.createComment('field:form'));

  // Email input placeholder
  const emailInput = element.querySelector('input[type="email"], input[type="text"]');
  if (emailInput) {
    const emailP = document.createElement('p');
    emailP.textContent = emailInput.placeholder || 'Enter your email';
    formCell.appendChild(emailP);
  }

  // Dropdown/select options
  const select = element.querySelector('select');
  if (select) {
    const options = select.querySelectorAll('option');
    const optionP = document.createElement('p');
    const optionTexts = Array.from(options).map((opt) => opt.textContent.trim()).join(', ');
    optionP.textContent = `Options: ${optionTexts}`;
    formCell.appendChild(optionP);
  }
  cells.push([formCell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Form Newsletter',
    cells,
  });

  element.replaceWith(block);
}
