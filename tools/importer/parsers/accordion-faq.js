/**
 * Accordion FAQ Parser
 * Parses accordion dropdown elements into Accordion-Faq blocks for EDS import.
 */
/* eslint-disable */
/* global WebImporter */



export default function parse(element, { document }) {
  const cells = [];

  // The element should be the container with accordion items
  // Find all accordion dropdown items
  let accordionItems = element.querySelectorAll('.accordion.w-dropdown');

  // If element itself is an accordion item, handle parent container
  if (accordionItems.length === 0 && element.classList.contains('accordion')) {
    // Single item case - wrap in array-like handling
    accordionItems = [element];
  }

  // If still no items, try getting from parent
  if (accordionItems.length === 0) {
    const parent = element.closest('.flex-vertical');
    if (parent) {
      accordionItems = parent.querySelectorAll('.accordion.w-dropdown');
    }
  }

  accordionItems.forEach((accordion) => {
    const row = [];

    // Column 1: Question (summary)
    const questionContainer = document.createElement('div');
    // Add field hint for xwalk
    questionContainer.appendChild(document.createComment(' field:summary '));

    const questionText = accordion.querySelector('.paragraph-lg');
    if (questionText) {
      const strong = document.createElement('strong');
      strong.textContent = questionText.textContent.trim();
      questionContainer.appendChild(strong);
    }
    row.push(questionContainer);

    // Column 2: Answer (text)
    const answerContainer = document.createElement('div');
    // Add field hint for xwalk
    answerContainer.appendChild(document.createComment(' field:text '));

    const answerContent = accordion.querySelector('.accordion-content .rich-text, .accordion-content .w-richtext');
    if (answerContent) {
      // Clone all paragraph content
      const paragraphs = answerContent.querySelectorAll('p');
      paragraphs.forEach((p) => {
        const para = document.createElement('p');
        para.textContent = p.textContent;
        answerContainer.appendChild(para);
      });
    } else {
      // Fallback: try to find any text in accordion content
      const contentArea = accordion.querySelector('.accordion-content');
      if (contentArea) {
        const p = document.createElement('p');
        p.textContent = contentArea.textContent.trim();
        answerContainer.appendChild(p);
      }
    }
    row.push(answerContainer);

    cells.push(row);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Accordion-Faq',
    cells
  });

  element.replaceWith(block);
}
