/**
 * Parser for quote-analyst block variant
 * Converts .component-quotes and .quotes elements to Quote Analyst block format
 *
 * Target model fields:
 * - quotation: The quote text (richtext - needs field hint)
 * - attribution: Source attribution (richtext - needs field hint)
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find the quote section
  const quoteSection = element.querySelector('.component-quotes') || element;

  // Find the quote description/text
  const quoteDesc = quoteSection.querySelector('.quotes-description');

  // Find attribution (analyst logo, company name, etc.)
  const quoteLogo = quoteSection.querySelector('.quotes-left img, .quotes-head img');

  // Find CTA button
  const quoteCta = quoteSection.querySelector('.component-cta-button a, .quotes-right a');

  // Build row 1: quotation with field hint
  if (quoteDesc) {
    const quotationDiv = document.createElement('div');
    const fieldHintQuote = document.createComment(' field:quotation ');
    quotationDiv.appendChild(fieldHintQuote);

    // Get all text content from the quote description
    const paragraphs = quoteDesc.querySelectorAll('p, .component-text');
    paragraphs.forEach(p => {
      if (p.textContent.trim()) {
        const para = document.createElement('p');
        para.textContent = p.textContent.trim();
        quotationDiv.appendChild(para);
      }
    });

    // If no paragraphs found, get direct text
    if (quotationDiv.childNodes.length === 1) {
      const textContent = quoteDesc.textContent.trim();
      if (textContent) {
        const para = document.createElement('p');
        para.textContent = textContent;
        quotationDiv.appendChild(para);
      }
    }

    cells.push([quotationDiv]);
  }

  // Build row 2: attribution with field hint
  const attrDiv = document.createElement('div');
  const fieldHintAttr = document.createComment(' field:attribution ');
  attrDiv.appendChild(fieldHintAttr);

  // Add logo if present
  if (quoteLogo) {
    attrDiv.appendChild(quoteLogo.cloneNode(true));
  }

  // Add CTA link if present
  if (quoteCta) {
    const link = document.createElement('a');
    link.href = quoteCta.href || '#';
    link.textContent = quoteCta.textContent.trim();
    attrDiv.appendChild(link);
  }

  if (attrDiv.childNodes.length > 1) {
    cells.push([attrDiv]);
  }

  // Create block if we have content
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'Quote Analyst',
      cells: cells
    });

    element.replaceWith(block);
  }
}
