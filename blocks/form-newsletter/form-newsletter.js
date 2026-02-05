export default function decorate(block) {
  // Form newsletter block decoration
  const rows = [...block.children];
  rows.forEach((row, index) => {
    if (index === 0) {
      row.classList.add('form-newsletter-heading');
    } else if (index === 1) {
      row.classList.add('form-newsletter-subheading');
    } else {
      row.classList.add('form-newsletter-form');
    }
  });
}
