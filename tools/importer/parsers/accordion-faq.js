/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: accordion
 *
 * Block Structure:
 * - Each row = 1 accordion item
 * - Column 1: Question/label
 * - Column 2: Answer/body
 *
 * Source HTML Pattern (from cleaned.html lines 205-248):
 * <div class="flex-vertical">
 *   <div class="accordion w-dropdown">
 *     <div class="w-dropdown-toggle">
 *       <div class="paragraph-lg">Question text</div>
 *     </div>
 *     <nav class="accordion-content w-dropdown-list">
 *       <div class="rich-text"><p>Answer text</p></div>
 *     </nav>
 *   </div>
 * </div>
 *
 * Generated: 2026-01-22
 */
export default function parse(element, { document }) {
  // Find all accordion items (w-dropdown elements)
  const accordionItems = element.querySelectorAll('.accordion.w-dropdown, .w-dropdown');

  const cells = [];

  accordionItems.forEach((item) => {
    // Get the question from the toggle
    const toggle = item.querySelector('.w-dropdown-toggle');
    const questionDiv = toggle ? toggle.querySelector('.paragraph-lg') : null;
    const questionText = questionDiv ? questionDiv.textContent.trim() : '';

    // Get the answer from the dropdown list
    const content = item.querySelector('.accordion-content, .w-dropdown-list');
    const answerDiv = content ? content.querySelector('.rich-text, p') : null;

    // Build question column with field hint
    const questionCol = [];
    if (questionText) {
      questionCol.push(document.createComment(' field:summary '));
      const qEl = document.createElement('p');
      qEl.textContent = questionText;
      questionCol.push(qEl);
    }

    // Build answer column with field hint
    const answerCol = [];
    if (answerDiv) {
      answerCol.push(document.createComment(' field:text '));
      // Clone the content - if it's rich-text, get its inner content
      const answerP = answerDiv.querySelector('p') || answerDiv;
      if (answerP) {
        answerCol.push(answerP.cloneNode(true));
      }
    }

    if (questionCol.length > 0) {
      cells.push([questionCol, answerCol]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
