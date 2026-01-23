/**
 * Parser for accordion-faq block variant
 * Converts FAQ accordion to EDS accordion block
 *
 * Source DOM: .flex-vertical with .w-dropdown accordion items
 * Target: Accordion (FAQ) block with question/answer pairs
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find all accordion items
  const accordionItems = element.querySelectorAll('.accordion, .w-dropdown');

  accordionItems.forEach((item) => {
    // Find the question (toggle label)
    const toggleElement = item.querySelector('.w-dropdown-toggle, [role="button"]');
    const questionElement = toggleElement ? toggleElement.querySelector('.paragraph-lg, div:not(.dropdown-icon)') : null;
    const question = questionElement ? questionElement.textContent.trim() : '';

    // Find the answer (dropdown content)
    const contentElement = item.querySelector('.accordion-content, .w-dropdown-list');
    const answerElement = contentElement ? contentElement.querySelector('.rich-text p, p') : null;
    const answer = answerElement ? answerElement.textContent.trim() : '';

    // Skip if no meaningful content
    if (!question) return;

    // Create question cell
    const questionCell = document.createElement('div');
    // <!-- field:title -->
    questionCell.insertAdjacentHTML('afterbegin', '<!-- field:title -->');
    const questionP = document.createElement('p');
    questionP.textContent = question;
    questionCell.appendChild(questionP);

    // Create answer cell
    const answerCell = document.createElement('div');
    // <!-- field:content -->
    answerCell.insertAdjacentHTML('afterbegin', '<!-- field:content -->');
    if (answer) {
      const answerP = document.createElement('p');
      answerP.textContent = answer;
      answerCell.appendChild(answerP);
    }

    cells.push([questionCell, answerCell]);
  });

  // Only create block if we found items
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'accordion-faq',
      cells,
    });

    element.replaceWith(block);
  }
}
