/* eslint-disable */
/* global WebImporter */

/**
 * Accordion block parser
 * Converts expandable FAQ sections into Accordion block.
 *
 * Source DOM structure:
 * .accordion > div > .container > .row > .accordion-block > div[FAQPage]
 *   > div[itemprop="mainEntity"] (repeated for each Q&A)
 *     > .accordion-title > h5.accordion-title-content (question)
 *     > .accordion-body > .accordion-body-content (answer with <p> tags)
 *
 * Expected output structure:
 * Each row = one accordion item with 2 cells:
 * - Column 1: Question text
 * - Column 2: Answer text
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find FAQ items using Schema.org markup
  let faqItems = element.querySelectorAll('[itemprop="mainEntity"]');
  if (faqItems.length === 0) {
    // Fallback: find by accordion-title siblings
    faqItems = element.querySelectorAll('.accordion-block > div > div');
  }

  faqItems.forEach((item) => {
    const row = [];

    // Column 1: Question (from accordion-title h5)
    const questionCell = document.createElement('div');
    const questionEl = item.querySelector('.accordion-title-content')
      || item.querySelector('.accordion-title h5')
      || item.querySelector('.accordion-title');
    if (questionEl) {
      questionCell.textContent = questionEl.textContent.trim();
    }
    row.push(questionCell);

    // Column 2: Answer (from accordion-body-content)
    const answerCell = document.createElement('div');
    const bodyContent = item.querySelector('.accordion-body-content')
      || item.querySelector('.accordion-body');
    if (bodyContent) {
      const paragraphs = bodyContent.querySelectorAll('p');
      if (paragraphs.length > 0) {
        paragraphs.forEach((p) => {
          const text = p.textContent.trim();
          if (text) {
            const newP = document.createElement('p');
            // Preserve links within paragraphs
            const links = p.querySelectorAll('a');
            if (links.length > 0) {
              // Clone content preserving links
              Array.from(p.childNodes).forEach((node) => {
                if (node.nodeType === 3) {
                  // Text node
                  newP.appendChild(document.createTextNode(node.textContent));
                } else if (node.tagName === 'A') {
                  const anchor = document.createElement('a');
                  anchor.href = node.href;
                  anchor.textContent = node.textContent;
                  newP.appendChild(anchor);
                } else {
                  newP.appendChild(document.createTextNode(node.textContent));
                }
              });
            } else {
              newP.textContent = text;
            }
            answerCell.appendChild(newP);
          }
        });
      } else {
        const text = bodyContent.textContent.trim();
        if (text) {
          const p = document.createElement('p');
          p.textContent = text;
          answerCell.appendChild(p);
        }
      }
    }
    row.push(answerCell);

    // Only add row if we have both question and answer
    if (questionCell.textContent && answerCell.textContent) {
      cells.push(row);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Accordion',
    cells,
  });

  element.replaceWith(block);
}
