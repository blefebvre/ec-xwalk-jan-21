/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq block
 *
 * Source: https://www.gigamon.com/solutions/accelerate-cloud-migration.html
 * Base Block: accordion
 *
 * Block Structure (container with accordion-faq-item):
 * - Each FAQ item is a row
 * - Columns: summary, text
 *
 * Model fields per item: summary, text
 *
 * Generated: 2026-02-02
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find accordion items
  const items = element.querySelectorAll('.accordion-item, [class*="faq-item"], details, .faq-question');

  // If no specific item containers, look for question/answer pairs
  const faqItems = items.length > 0 ? items :
    element.querySelectorAll('[class*="question"], [class*="accordion"]');

  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      // Find question/summary
      const question = item.querySelector('button, summary, [class*="question"], h3, h4');
      // Find answer/content
      const answer = item.querySelector('p, [class*="answer"], [class*="content"], .accordion-content');

      if (question || answer) {
        // Build summary cell
        const summaryCell = document.createDocumentFragment();
        summaryCell.appendChild(document.createComment(' field:summary '));
        if (question) {
          // Extract just the question text, not the +/- indicators
          const questionText = question.textContent.replace(/[+\-]/g, '').trim();
          const questionP = document.createElement('p');
          questionP.textContent = questionText;
          summaryCell.appendChild(questionP);
        }

        // Build text cell
        const textCell = document.createDocumentFragment();
        textCell.appendChild(document.createComment(' field:text '));
        if (answer) {
          textCell.appendChild(answer.cloneNode(true));
        }

        cells.push([summaryCell, textCell]);
      }
    });
  } else {
    // Fallback: extract all content
    const cell = document.createDocumentFragment();
    cell.appendChild(document.createComment(' field:text '));
    Array.from(element.children).forEach((child) => {
      cell.appendChild(child.cloneNode(true));
    });
    cells.push([cell]);
  }

  // Create block
  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
