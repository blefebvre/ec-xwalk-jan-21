/**
 * Parser for accordion-faq block variant
 * Converts .faq-accordion and .component-faq-accordion elements to Accordion FAQ block format
 *
 * Target model fields (per accordion item):
 * - summary: Question/title text (text field - needs field hint)
 * - text: Answer content (richtext - collapsed field, no hint needed)
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find the accordion section
  const accordionSection = element.querySelector('.component-faq-accordion') || element;

  // Get the heading if present
  const heading = accordionSection.querySelector('.text-center h2, .component-text h2');

  // Find all accordion items
  const accordionItems = accordionSection.querySelectorAll('.accordion-item');

  // Add heading row if present
  if (heading && heading.textContent.trim()) {
    const headingDiv = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    headingDiv.appendChild(h2);
    cells.push([headingDiv]);
  }

  // Process each accordion item
  accordionItems.forEach(item => {
    // Get question/summary
    const questionEl = item.querySelector('.accordion-title, .accordion-header');
    const question = questionEl ? questionEl.textContent.trim() : '';

    // Get answer/content
    const answerEl = item.querySelector('.accordion-content');

    if (question) {
      // Create row with summary field hint
      const summaryDiv = document.createElement('div');
      const fieldHintSummary = document.createComment(' field:summary ');
      summaryDiv.appendChild(fieldHintSummary);

      const questionPara = document.createElement('p');
      questionPara.textContent = question;
      summaryDiv.appendChild(questionPara);

      // Create answer div (text is collapsed field - no hint needed)
      const answerDiv = document.createElement('div');
      if (answerEl) {
        // Clone answer content
        const answerContent = answerEl.cloneNode(true);
        // Clean up any nested structures
        const paragraphs = answerContent.querySelectorAll('p');
        if (paragraphs.length > 0) {
          paragraphs.forEach(p => {
            if (p.textContent.trim()) {
              const para = document.createElement('p');
              para.textContent = p.textContent.trim();
              answerDiv.appendChild(para);
            }
          });
        } else {
          const para = document.createElement('p');
          para.textContent = answerContent.textContent.trim();
          answerDiv.appendChild(para);
        }
      }

      // Each accordion item is one row with question and answer columns
      cells.push([summaryDiv, answerDiv]);
    }
  });

  // Create block if we have content
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'Accordion Faq',
      cells: cells
    });

    element.replaceWith(block);
  }
}
